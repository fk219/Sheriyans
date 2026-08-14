import {Server} from "socket.io"

let io;

const socketInit = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173", "https://scaling-waddle-q5v7p6gvxj73wrx-5173.app.github.dev"],
            credentials: true
        }
    })

    console.log("SocketIO Server is Running!")

    io.on('connection', (socket) => {
        console.log("A user is connected: "+ socket.id)
    })
}

const getIO = () => {
    if(!io){
        throw new Error("Socker IO is Not Initialized")
    }

    return io
}

export {socketInit, getIO}
