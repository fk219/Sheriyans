import express from 'express'
import useGraph from './services/graph.ai.service.js'

const app = express()

app.get('/', (req, res) => {
    res.send('Your Server us up and Running!')
})

app.get('/health', (req, res) => {

    res.status(200).json({
        status: 'OK'
    })
})


app.post('/use-graph', async (req, res) => {
    try {
        const result = await useGraph("Explain AI Engineering in 30 words")
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(503).json({
            error: "An AI provider is temporarily unavailable. Try again later."
        });
    }
})

export {app}