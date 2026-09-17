import express from 'express'
import startGraph from '../src/ai/graph.ai.js'

const app = express()

app.use(express.json())

app.post('/api/arena', async (req, res) => {
    try {
        const problem = req.body?.problem

        if (!problem || typeof problem !== "string") {
            res.status(400).json({ error: "problem is required in the request body" })
            return
        }

        const response = await startGraph(problem)

        res.json({
            problem: response.problem,
            solution_1: response.solution_1,
            solution_2: response.solution_2,
            judge: {
                solution_1_score: response.judge.solution_1_score,
                solution_2_score: response.judge.solution_2_score,
                solution_1_feedback: response.judge.solution_1_feedback,
                solution_2_feedback: response.judge.solution_2_feedback,
                winner: response.judge.winner,
            }
        })
    } catch (error: any) {
        console.error("Arena error:", error)
        res.status(500).json({ error: "Something went wrong in the arena" })
    }
})

export {app}
