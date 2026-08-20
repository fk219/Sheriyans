import { io } from "socket.io-client";

/**
 * ============================================================================
 * SOCKET.IO CLIENT SERVICE (chat.socket.js)
 * ============================================================================
 * 
 * Manages the client-side WebSocket connection to the backend.
 * Provides singleton socket instance so all components can emit and listen.
 */

let socket = null;

const initializeSocketConnection = () => {
    if (!socket) {
        socket = io("https://perplexity-clone-7nda.onrender.com/", {
            withCredentials: true
        });

        socket.on("connect", () => {
            console.log("Connected to Socket.IO Server:", socket.id);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket Connection Error:", err.message);
        });
    }

    return socket;
};

const getSocket = () => {
    if (!socket) {
        return initializeSocketConnection();
    }
    return socket;
};

export { initializeSocketConnection, getSocket };
