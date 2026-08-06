

import {app} from './src/app.js'
import {createServer} from 'http'
import {Server} from 'socket.io'

const port = 3000
const httpServer = createServer(app)
const io = new Server(httpServer, {/* Options*/})


io.on("connection", (socket) => {
    console.log('New Socket(User) is Connected!')
    
    socket.on('message', (data) => {
        console.log("Socket(User) is listening on Message!")
        console.log("Data: ", data)
        io.emit("Room123")
    })
})


httpServer.listen(port, ()=>{
    console.log(`Your Server is Running at http://localhost:${port}`)
})

/*
IO => Server
Socket => Single User

On => Event Ko Listen Karna
Emit => Event Ko Fire/ Trigger Karna


socker.emit()
io.emit()
socket.broadcast().emit()

*/