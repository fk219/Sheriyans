import { io } from "socket.io-client";
import {
  appendAiChunk,
  finalizeAiMessage,
  setLoading,
  setError
} from "../chat.slice";

/**
 * ============================================================================
 * SOCKET.IO CLIENT SERVICE (chat.socket.js)
 * ============================================================================
 *
 * 1. PURPOSE:
 *    - Opens ONE real-time WebSocket connection from the browser to the server.
 *    - Listens for the AI's live "typing" chunks and feeds them into Redux.
 *    - Exposes `askAi()` so the controller (useChat.js) can start streaming.
 *
 * 2. COMPLETE DATA FLOW:
 *
 *    [useChat.js]  socket.emit("ask_ai", { chatId })
 *                      │
 *                      ▼  (travels over the WebSocket to the backend)
 *    [server.socket.js]  streams Mistral tokens one-by-one
 *                      │
 *         ┌─────────────┼──────────────────────────────┐
 *         ▼             ▼                              ▼
 *    "ai_typing"   "ai_done"                        "ai_error"
 *    {chatId,chunk}{chatId,message}                 {chatId,error}
 *         │             │                              │
 *         ▼             ▼                              ▼
 *   Redux append    Redux finalize                Redux setError
 *   chunk to live   replace temp bubble           + setLoading(false)
 *   bubble          with saved message            (never stuck!)
 *
 * 3. SINGLETON PATTERN:
 *    We keep a module-level `socket` variable so that mounting/unmounting
 *    Dashboard does NOT create a duplicate connection each time.
 */

// Where is the backend hosted? Overridable with a Vite env variable.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://perplexity-clone-7nda.onrender.com";

let socket = null;

/**
 * Creates (once) the Socket.IO connection and wires up all event handlers.
 *
 * @param {Function} dispatch - Redux dispatch from useChat (used to update store).
 * @returns {object} The Socket.IO socket instance.
 */
const initializeSocketConnection = (dispatch) => {
  // Already connected? Reuse it (singleton pattern)
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true
  });

  // Connection lifecycle logs
  socket.on("connect", () => {
    console.log("Socket.IO connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket.IO disconnected");
  });

  // If the WebSocket can't reach the server at all, make sure the UI is
  // never left stuck on the loading spinner (= the "timer" bug).
  socket.on("connect_error", (err) => {
    console.error("Socket.IO connection error:", err.message);
    dispatch(setError("Cannot reach AI stream server. Is the backend running?"));
    dispatch(setLoading(false));
  });

  /**
   * EVENT: "ai_typing"
   * Fires for EVERY token the AI generates. We append the chunk to the live
   * streaming bubble inside Redux -> React re-renders it instantly.
   */
  socket.on("ai_typing", ({ chatId, chunk }) => {
    dispatch(appendAiChunk({ chatId, chunk }));
  });

  /**
   * EVENT: "ai_done"
   * AI finished. The backend already saved the full answer in MongoDB and
   * sends it to us. We replace the temporary typing bubble with the final
   * saved message, then switch OFF the loading spinner.
   */
  socket.on("ai_done", ({ chatId, message }) => {
    dispatch(finalizeAiMessage({ chatId, message }));
    dispatch(setLoading(false));
  });

  /**
   * EVENT: "ai_error"
   * Something failed server-side. We turn OFF loading so the UI is never
   * stuck on the "Searching and reasoning..." spinner forever.
   */
  socket.on("ai_error", ({ error }) => {
    console.error("AI streaming error:", error);
    dispatch(setError(error || "AI streaming failed"));
    dispatch(setLoading(false));
  });

  return socket;
};

/**
 * Tells the backend to begin streaming the AI answer for a chat.
 *
 * @param {string} chatId - MongoDB id of the chat to stream the answer for.
 * @returns {boolean} `true` if the event was emitted, `false` if no socket.
 */
const askAi = (chatId) => {
  if (socket) {
    socket.emit("ask_ai", { chatId });
    return true;
  }
  console.warn("Socket not initialized. Call initializeSocketConnection() first.");
  return false;
};

export { initializeSocketConnection, askAi };