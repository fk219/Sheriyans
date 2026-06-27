const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const authRouter = require("../routes/auth.route")
const postRouter = require("../routes/post.route")
const userRouter = require("../routes/user.route")

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://scaling-waddle-q5v7p6gvxj73wrx-5173.app.github.dev",
    "https://5173-firebase-sheriyans-1776681977873.cluster-55m56i2mgjalcvl276gecmncu6.cloudworkstations.dev"
  ],
  credentials: true,
}))

app.get('/', (req, res) => {
    res.send("All API's are working!")
})

app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

module.exports = app