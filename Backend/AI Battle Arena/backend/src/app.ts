import express from 'express'

const app = express()


app.post('/', (req, res) => {
    res.send("Your Server is Up and Running!")
})

export {app}