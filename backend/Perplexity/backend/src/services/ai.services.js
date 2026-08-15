import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from 'langchain'

const model = new ChatMistralAI({
  model: "mistral-small-latest"
});

const generateResponse = async (message) => {
  const response = await model.invoke([
    new HumanMessage(message)
  ])

  return response.text
}

export {generateResponse}