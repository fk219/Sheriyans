import express from 'express'
import startGraph from '../src/ai/graph.ai.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5172", "https://scaling-waddle-q5v7p6gvxj73wrx-5173.app.github.dev/"],
    methods: ["GET", "POST"],
    credentials: true
}))


app.get('/', (_req, res) => {
    res.send('API is up and running')
})

app.post('/api/arena', async (req, res) => {
    try {
        const {input} = req.body?.problem

        if (!input || typeof input !== "string") {
            res.status(400).json({ error: "input is required in the request body" })
            return
        }

        const result = await startGraph(input)

        res.status(200).json({
            message: "Graph Executed Successfully!",
            success: true,
            data: result
        })
    } catch (error: any) {
        console.error("Arena error:", error)
        res.status(500).json({ error: "Something went wrong in the arena" })
    }
})

export {app}
