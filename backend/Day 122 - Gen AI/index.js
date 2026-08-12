import "dotenv/config"
import readline from 'readline/promises'
import z from 'zod'

import { sendEmail } from "./services.js";

import {HumanMessage, tool, createAgent} from 'langchain'
import { ChatMistralAI } from "@langchain/mistralai";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const model = new ChatMistralAI({
    model: 'mistral-small-latest',
    temperature: 0
})

const emailTool = tool(
    sendEmail,
    {
        name: "emailTool",
        description: "Use this tool to send emails",
        schema: z.object({
            to: z.string().describe("The Recipient's email address"),
            subject: z.string().describe('The Subject of the Email'),
            html: z.string().describe("The HTML content of the Email")
        })
    }
)

const agent = createAgent({
    model,
    tools: [emailTool]
})

// rl.question("Hi How can I help you?", async (answer)=> {
//     const response = await model.invoke(answer)
//     console.log(response.text)
// })




const messages = []

while(true){
    const userInput = await rl.question("You: ")

    messages.push(new HumanMessage(userInput))

    const response = await agent.invoke({messages})

    // Push only the AI's last message into history, not the whole response object
    messages.push(response.messages[response.messages.length - 1])

    console.log(response)
}