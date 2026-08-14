import 'dotenv/config';

import http from "http"
import { app } from './src/app.js';
import { connectDB } from './src/config/database.js';
import { socketInit } from './src/sockets/server.socket.js';

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app)

socketInit(httpServer)

connectDB()
.catch((err)=>{
    console.error("MongoDB Connection Failed! ", err)
    process.exit(1)
});

httpServer.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});