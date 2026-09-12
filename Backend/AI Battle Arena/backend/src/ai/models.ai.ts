import {ChatGoogle} from "@langchain/google";
import {ChatMistralAI} from "@langchain/mistralai";
import {ChatCohere} from "@langchain/cohere";
import {ChatGroq} from "@langchain/groq";
import config from "../config/config.js";

const geminiModel = new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: config.GOOGLE_API_KEY,
})

const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRALAI_API_KEY,
})

const cohereModel = new ChatCohere({
    model: "command-r7b-12-2024",
    apiKey: config.COHERE_API_KEY,
})

const groqModel = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: config.GROQ_API_KEY,
})

export {
    geminiModel,
    mistralModel,
    cohereModel,
    groqModel
}