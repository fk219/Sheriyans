import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  apiKey: process.env.GEMINI_API
});

const llmresponse = async () => {
    model.invoke("Who is the father of AI, answer in one word")
        .then((response)=>{
            console.log(response)
        })
        .catch(err=> console.log(err))
}

export {llmresponse}