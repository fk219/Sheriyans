import config from "../config/config.js";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai"
import { ChatCohere } from "@langchain/cohere"

const geminiModel = new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: config.GOOGLE_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY
})

const cohereModel = new ChatCohere({
    model: "command-r-03-2025",
    apiKey: config.COHERE_API_KEY
})

export {geminiModel, mistralModel, cohereModel}