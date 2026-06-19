const express = require("express")
const cookieParser = require("cookie-parser")

const authRouter = require("../routes/auth.route")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    res.send("Server Is Up and Running Boss!!")
})

module.exports = app