import express from 'express'
import startGraph from '../src/ai/graph.ai.js'

const app = express()

app.use(express.json())

app.get('/', (_req, res) => {
    res.send('API is up and running')
})

app.post('/api/arena', async (req, res) => {
    try {
        const problem = req.body?.problem

        if (!problem || typeof problem !== "string") {
            res.status(400).json({ error: "problem is required in the request body" })
            return
        }

        const response = await startGraph(problem)

        res.json(response)
    } catch (error: any) {
        console.error("Arena error:", error)
        res.status(500).json({ error: "Something went wrong in the arena" })
    }
})

export {app}
