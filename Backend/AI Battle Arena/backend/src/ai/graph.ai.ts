import {StateGraph, StateSchema, type GraphNode } from "@langchain/langgraph"
import {geminiModel, mistralModel, cohereModel} from "./models.ai.js"
import z from "zod"

const state =  new StateSchema({
    problem: z.string().default(""),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_feedback: z.string().default(""),
        solution_2_feedback: z.string().default(""),
    })
})


const solutionNode: GraphNode<typeof state> = async (state) => {
    const [cohereResponse, mistralResponse] = await Promise.all([
        cohereModel.invoke(state.problem),
        mistralModel.invoke(state.problem),
    ])
    
    return{
        solution_1: cohereResponse.text,
        solution_2: mistralResponse.text,
    }
}