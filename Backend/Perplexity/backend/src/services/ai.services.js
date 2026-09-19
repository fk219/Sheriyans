import * as z from 'zod'
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, AIMessage, SystemMessage, tool, createAgent } from 'langchain'
import { searchInternet } from "./internet.service.js";

const model = new ChatMistralAI({
  model: "mistral-small-latest"
});

const searchInternetTool = tool(
    async ({ query }) => {
      const response = await searchInternet(query);
      return response;
    },
    {
      name: "search_internet",
      description: "Searches the live web/internet for recent information, real-time facts, news, documentation, or queries that require up-to-date knowledge beyond the model's training data cutoff.",
      schema: z.object({
        query: z.string().describe("The search query string to search the web for, e.g. 'latest quantum computing news 2026'")
      })
    }
);

const agent = createAgent({
  model: model,
  tools: [searchInternetTool]
})

const extractChunkText = (chunk) => {
  const content = chunk?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .filter((block) => block?.type === "text" && typeof block.text === "string")
      .map((block) => block.text)
      .join("");
  }

  return "";
};

const generateResponse = async (messages, onChunk) => {
  const formattedMessages = messages
    .map((msg) => {
      if (msg.role === "user") return new HumanMessage(msg.content);
      if (msg.role === "ai") return new AIMessage(msg.content);
      return null;
    })
    .filter(Boolean);

  const eventStream = await agent.streamEvents(
    { messages: formattedMessages },
    { version: "v3" }
  );

  let fullResponse = "";

  for await (const message of eventStream.messages) {
    for await (const textChunk of message.text) {
      if (!textChunk) continue;
      fullResponse += textChunk;

      if (typeof onChunk === "function") {
        onChunk(textChunk);
      }
    }
  }

  return fullResponse;
};

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