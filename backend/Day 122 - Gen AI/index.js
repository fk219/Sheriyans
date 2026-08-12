import "dotenv/config"
import readline from 'readline/promises'
import { ChatMistralAI } from "@langchain/mistralai";
import {HumanMessage} from 'langchain'


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const model = new ChatMistralAI({
    model: 'mistral-small-latest',
    temperature: 0
})

// rl.question("Hi How can I help you?", async (answer)=> {
//     const response = await model.invoke(answer)
//     console.log(response.text)
// })


const messages = []

while(true){
    const userInput = await rl.question("You: ")

    messages.push(new HumanMessage(userInput))

    const response = await model.invoke(messages)

    messages.push(response)

    console.log("AI:", response.text)
}