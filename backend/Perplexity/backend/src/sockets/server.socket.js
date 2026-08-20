import { Server } from "socket.io";
import { generateResponse, generateTitle } from "../services/ai.services.js";
import { messageModel } from "../models/message.model.js";
import { chatModel } from "../models/chat.model.js";

/**
 * ============================================================================
 * SOCKET.IO REAL-TIME SERVER (server.socket.js)
 * ============================================================================
 * 
 * PURPOSE:
 *  - Handles real-time two-way communication between React Frontend and Backend.
 *  - Streams AI answers word-by-word (typewriter effect) so the user does NOT have
 *    to wait for the whole answer to generate.
 * 
 * DATA FLOW:
 *  1. Frontend emits:   `socket.emit("send_message", { message, chatId, userId })`
 *  2. Backend:          Saves user message to MongoDB
 *  3. Backend:          Calls `generateResponse(chatHistory, onChunk)`
 *  4. On every chunk:   Emits `socket.emit("ai_chunk", { chunk })` to browser
 *  5. Backend:          Saves complete AI message to MongoDB
 *  6. Backend finishes: Emits `socket.emit("ai_done", { aiMessage, chatId })`
 */

let io;

const socketInit = (httpServer) => {
  // Initialize Socket.IO with CORS enabled for frontend
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true
    }
  });

  console.log("SocketIO Server is Running!");

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join a room for a specific chat (keeps chats organized)
    socket.on("join_chat", (chatId) => {
      if (chatId) socket.join(chatId);
    });

    /**
     * Event: "send_message"
     * Triggered when the user types a prompt in Dashboard and clicks Send.
     */
    socket.on("send_message", async ({ message, chatId, userId }) => {
      try {
        let currentChatId = chatId;
        let title = null;
        let newChat = null;

        // Step 1: If starting a fresh chat, generate title and create chat document
        if (!currentChatId) {
          title = await generateTitle(message);
          newChat = await chatModel.create({
            title: title,
            user: userId
          });
          currentChatId = newChat._id.toString();
          socket.join(currentChatId);

          // Tell frontend about the new chat (so sidebar updates)
          socket.emit("chat_created", { newChat, title });
        }

        // Step 2: Save user's question in MongoDB
        const userMessage = await messageModel.create({
          chat: currentChatId,
          content: message,
          role: "user"
        });

        // Inform client that user message is saved
        socket.emit("user_message_saved", userMessage);

        // Step 3: Fetch past messages in this chat for AI context
        const chatHistory = await messageModel.find({ chat: currentChatId }).sort({ createdAt: 1 });

        // Step 4: Stream response chunk-by-chunk to the user
        const fullAnswer = await generateResponse(chatHistory, (chunk) => {
          // Send each individual word/token to frontend in real time
          socket.emit("ai_chunk", {
            chatId: currentChatId,
            chunk: chunk
          });
        });

        // Step 5: Save complete AI response to MongoDB
        const aiMessage = await messageModel.create({
          chat: currentChatId,
          content: fullAnswer,
          role: "ai"
        });

        // Step 6: Notify frontend that AI finished typing
        socket.emit("ai_done", {
          chatId: currentChatId,
          aiMessage: aiMessage
        });

      } catch (error) {
        console.error("Socket Streaming error:", error);
        socket.emit("ai_error", { error: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket IO is Not Initialized");
  }
  return io;
};

export { socketInit, getIO };