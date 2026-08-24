import express from 'express'

const app = express()

app.get('/health', (req, res) => {

    res.status(200).json({
        status: 'OK'
    }).send('Server is Up and Running, Dont Worry!')
})

export {app}