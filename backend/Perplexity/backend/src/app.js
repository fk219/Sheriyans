import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"

import {authRouter} from "./routes/auth.routes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin: ["https://scaling-waddle-q5v7p6gvxj73wrx-5173.app.github.dev/", "http://localhost:5173"],
    credentials: true,
    methods: [GET, POST, DELETE, PUT]
}))

app.use("/api/auth", authRouter)

app.get("/", (req, res)=>{
    res.send("Hello World")
})

export {app}