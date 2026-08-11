import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  apiKey: process.env.GEMINI_API
});

const llmresponse = async () => {
    const response = await model.invoke("What is FKodeLabs, and who is the founder of FKodeLabs. www.fkodelabs.com in one word")
    return console.log(response.content)
}

export {llmresponse}