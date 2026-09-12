import express from 'express'
import startGraph from '../src/ai/graph.ai.js'

const app = express()

app.post('/', async (req, res) => {
    const result = await startGraph("Write a fucntion to calculate the distance of earth")

    res.send(result)
})

export {app}