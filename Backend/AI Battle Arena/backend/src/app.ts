import express from 'express'
import startGraph from '../src/ai/graph.ai.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5172",
        "http://localhost:5173",
        "https://scaling-waddle-q5v7p6gvxj73wrx-5173.app.github.dev"
    ],
    methods: ["GET", "POST"],
    credentials: true
}))


app.get('/', (_req, res) => {
    res.send('API is up and running')
})

app.post('/api/invoke', async (req, res) => {
    try {
        const { problem } = req.body

        if (!problem || typeof problem !== 'string') {
            return res.status(400).json({
                error: "problem must be a non-empty string"
            })
        }

        const result = await startGraph(problem)

        res.status(200).json({
            message: "Graph Executed Successfully!",
            success: true,
            result
        })
    } catch (error: any) {
        console.error("Arena error:", error)
        res.status(500).json({
            error: error?.message || String(error) || "Something went wrong in the arena"
        })
    }
})

export {app}
