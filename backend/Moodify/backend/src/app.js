const express = require("express")
const cookieParser = require('cookie-parser') 
const cors = require('cors')

const authRouter = require('../routes/auth.routes')
const songRouter = require('../routes/song.routes')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["https://scaling-waddle-q5v7p6gvxj73wrx-3000.app.github.dev", "https://scaling-waddle-q5v7p6gvxj73wrx-5173.app.github.dev", "http://localhost:5173"],
    credentials: true
}))



app.use('/api/song', songRouter)
app.use('/api/auth', authRouter)


app.get('/', (req, res)=>{
    res.send("API's are up and Running")
})

module.exports = app
