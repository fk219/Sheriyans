const express = require("express")
const cookieParser = require('cookie-parser') 
const authRouter = require('../routes/auth.routes')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://scaling-waddle-q5v7p6gvxj73wrx-3000.app.github.dev",
    credentials: true
}))


app.use('/api/auth', authRouter)


app.get('/', (req, res)=>{
    res.send("API's are up and Running")
})

module.exports = app
