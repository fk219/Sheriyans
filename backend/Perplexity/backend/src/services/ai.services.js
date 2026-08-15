import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, AIMessage, SystemMessage } from 'langchain'

const model = new ChatMistralAI({
  model: "mistral-small-latest"
});

const generateResponse = async (messages) => {
  const response = await model.invoke(messages.map((msg) => {
    if(msg.role === "user"){
      return new HumanMessage(msg.content)
    }else if(msg.role === "ai"){
      return new AIMessage(msg.content)
    }
  }))

  return response.text
}


const generateTitle = async (message) => {
  const title = await model.invoke([
    new SystemMessage(`
      You are a helpful AI assistance your task is to create a title for the user's query. 
      The title should be short and concise and should be relevant to the user's query.
      The title should be in the same language as the user's query.
      Do not use any special characters or symbols in the title. 
      Do not use any quotes or punctuation in the title.
      `),
    new HumanMessage(`
        Generate a title in 2-4 words for the following message: ${message}
        `)
  ])
  return title.text
}

export { generateResponse, generateTitle }