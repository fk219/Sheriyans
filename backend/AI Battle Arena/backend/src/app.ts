import express from 'express'
import useGraph from './services/graph.ai.service.js'

const app = express()

app.get('/health', (req, res) => {

    res.status(200).json({
        status: 'OK'
    })
})


app.post('/use-graph', async (req, res) => {
    await useGraph("Helo Furqan, Allah will save you!")
    res.send("ok");
})

export {app}