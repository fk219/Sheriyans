const express = require('express')
const app = express()

const authRouter = require("../routes/auth.route")

app.post('/', () => {
    res.send("All API's are working!")
})

app.use("/api/auth", authRouter)

module.exports = app