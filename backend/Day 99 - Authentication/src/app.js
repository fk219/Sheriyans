const express = require('express')
const authRouter = require('../routes/auth.routes')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(cookieParser())

app.post('/', ()=> {
    res.send("API's are UP and Running")
})


app.use('/api/auth', authRouter)

module.exports = app