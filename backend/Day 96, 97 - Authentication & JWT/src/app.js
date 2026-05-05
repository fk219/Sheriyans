const express = require('express')
const authRouter = require('../routes/auth.routes.js')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Your API are all UP & RUNNING!!')
})



module.exports = app