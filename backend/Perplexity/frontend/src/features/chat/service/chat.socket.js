import { io } from "socket.io-client";

const initializeSocketConnection = () => {
    
    const socket = io("https://perplexity-clone-7nda.onrender.com/", {
        withCredentials: true
    });

    socket.on("connect", () => {
        console.log("Connected to Socket IO Server")
    })
}

export {initializeSocketConnection}
