import { Server } from "socket.io";
import { generateResponse } from "../services/ai.services.js";
import { messageModel } from "../models/message.model.js";

/**
 * ============================================================================
 * SOCKET.IO SERVER (server.socket.js)
 * ============================================================================
 *
 * 1. PURPOSE:
 *    - Opens a real-time, bi-directional WebSocket connection between the
 *      browser (frontend) and this Node.js server.
 *    - The crucial job of this file: STREAM the AI answer token-by-token live
 *      to the browser, instead of making the user wait for the whole response.
 *
 * 2. COMPLETE DATA FLOW (end-to-end):
 *
 *    [Frontend Dashboard]
 *           │ 1. REST call  POST /api/chats/message  { message, stream: true }
 *           │    -> Backend creates/updates the Chat + saves the USER message
 *           │    -> Returns the real MongoDB chatId immediately (no AI wait)
 *           ▼
 *    [Frontend] 2. socket.emit("ask_ai", { chatId })
 *           │
 *           ▼
 *    [server.socket.js: "ask_ai" handler]
 *           │ 3. Load all past messages for this chat (sorted by createdAt)
 *           │ 4. Call generateResponse(history, onChunk)
 *           │        -> Mistral streamEvents() emits tiny tokens
 *           │        -> onChunk(token) fires for EVERY token
 *           ▼
 *    Backend -> 5. socket.emit("ai_typing", { chatId, chunk })  (× N times)
 *           │       Frontend appends each chunk to a live "typing" bubble.
 *           │
 *           ├──► 6. After streaming finishes: save full AI answer to MongoDB
 *           │
 *           └──► 7. socket.emit("ai_done", { chatId, message })
 *                      Frontend replaces the temp bubble with the saved message.
 *
 * 3. EVENT CONTRACT (what frontend listens for):
 *    - "ai_typing"  { chatId, chunk }   -> show live word-by-word text
 *    - "ai_done"    { chatId, message } -> streaming finished, message saved in DB
 *    - "ai_error"   { chatId, error }   -> something went wrong (no stuck loading!)
 */

let io;

/**
 * Attaches Socket.IO to the provided HTTP server.
 *
 * @param {import('http').Server} httpServer - The Node http.Server from server.js.
 */
const socketInit = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" } // allows the frontend to connect
  });

  // Runs once for EVERY new browser tab/device that opens the app
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /**
     * ------------------------------------------------------------------------
     * EVENT: "ask_ai"
     * ------------------------------------------------------------------------
     * Triggered by the frontend right AFTER it saved the user's message using
     * the REST API. The socket only needs the chatId — it fetches the message
     * history itself and streams back the AI answer.
     *
     * @param {object} payload
     * @param {string} payload.chatId - MongoDB id of the active chat thread.
     */
    socket.on("ask_ai", async ({ chatId }) => {
      try {
        // Guard: never stream for a non-existent chat
        if (!chatId) {
          socket.emit("ai_error", { error: "chatId is required" });
          return;
        }

        // Load the full conversation history IN CHRONOLOGICAL ORDER.
        // NOTE: `.sort({ createdAt: 1 })` is the FIX for the "messages out of
        // order / wrong timestamp context" bug — without it the AI could see
        // the conversation backwards or jumbled.
        const chatHistory = await messageModel
          .find({ chat: chatId })
          .sort({ createdAt: 1 });

        // Stream the answer. Every token arrives via the `onChunk` callback.
        const fullAnswer = await generateResponse(chatHistory, (chunk) => {
          // TODO: send only to THIS socket (single-user demo keeps it simple)
          socket.emit("ai_typing", { chatId, chunk });
        });

        // Persist the AI's complete answer so it survives a page refresh
        const savedMessage = await messageModel.create({
          chat: chatId,
          content: fullAnswer,
          role: "ai"
        });

        // Tell the browser: streaming finished + here is the saved message.
        socket.emit("ai_done", { chatId, message: savedMessage });
      } catch (error) {
        // CRITICAL FIX: if we swallow errors, the frontend's loading spinner
        // would stay stuck forever ("Searching and reasoning..." timer bug).
        console.error("ask_ai error:", error.message);
        socket.emit("ai_error", { chatId, error: error.message });
      }
    });

    // Cleanup log when the user closes the tab/refreshes
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export { socketInit };