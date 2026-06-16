const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const authRouter = require("../routes/auth.route")
const postRouter = require("../routes/post.route")
const userRouter = require("../routes/user.route")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.get('/', (req, res) => {
    res.send("All API's are working!")
})

app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

module.exports = app