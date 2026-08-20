import * as z from 'zod'
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, AIMessage, SystemMessage, tool, createAgent } from 'langchain'
import { searchInternet } from "./internet.service.js";

/**
 * ============================================================================
 * AI SERVICE & LANGCHAIN AGENT (ai.services.js)
 * ============================================================================
 * 
 * 1. PURPOSE:
 *    - Uses Mistral AI (`mistral-small-latest`) as the core LLM reasoning engine.
 *    - Equips the AI model with a custom tool (`search_internet`) powered by Tavily.
 *    - When a user asks a question needing live web info, the model automatically decides
 *      to call `search_internet`, retrieves facts, and synthesizes a well-informed response.
 * 
 * 2. COMPLETE DATA FLOW ARCHITECTURE:
 * 
 *    [User in Frontend]
 *           │ types: "What are the latest developments in AI this week?"
 *           ▼
 *    [chat.controller.js] -> fetches past messages from MongoDB
 *           │ passes: `[{ role: "user", content: "..." }]`
 *           ▼
 *    [ai.services.js -> generateResponse(messages)]
 *           │
 *           ├──► 1. Convert DB messages into LangChain Message Instances:
 *           │       • role "user" -> `new HumanMessage(content)`
 *           │       • role "ai"   -> `new AIMessage(content)`
 *           │
 *           ├──► 2. Invoke LangChain Agent: `agent.invoke({ messages })`
 *           │       ├── LLM inspects prompt & decides: "I need live web data!"
 *           │       ├── LLM calls `searchInternetTool({ query: "AI news August 2026" })`
 *           │       ├── `internet.service.js` fetches Tavily web results
 *           │       └── LLM reads results and generates final markdown answer
 *           │
 *           ▼
 *    [Return String Answer] -> `chat.controller.js` -> Saves to MongoDB -> Sends back to Client
 */

// Initialize Mistral AI LLM
const model = new ChatMistralAI({
  model: "mistral-small-latest"
});

/**
 * ----------------------------------------------------------------------------
 * TOOL DEFINITION: searchInternetTool
 * ----------------------------------------------------------------------------
 * - Defined with LangChain's `tool` helper.
 * - `schema`: Zod schema specifying the parameters the LLM must generate.
 * - `description`: Crucial for the LLM! Tells the LLM *when* and *why* to use this tool.
 */
const searchInternetTool = tool(
    async ({ query }) => {
      // 1. Receive query string generated autonomously by the LLM
      // 2. Call Tavily web search service
      const response = await searchInternet(query);
      // 3. Return string result back to the LLM agent
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

/**
 * ----------------------------------------------------------------------------
 * AGENT CREATION:
 * ----------------------------------------------------------------------------
 * Binds the LLM with available tools. When invoked, LangChain runs a loop (ReAct):
 * Reason -> Tool Call -> Observation -> Final Answer.
 */
const agent = createAgent({
  model: model,
  tools: [searchInternetTool]
})

/**
 * Generates and streams an AI response chunk-by-chunk in real time.
 * 
 * 1. HOW DATA FLOWS:
 *    - Converts raw MongoDB messages into LangChain classes (HumanMessage, AIMessage).
 *    - Calls `agent.streamEvents()` which starts Mistral AI and any tools (Tavily search).
 *    - Every time Mistral AI outputs a new word/token (`on_chat_model_stream`), it calls `onChunk(word)`.
 *    - Simultaneously accumulates all words into `fullResponse`.
 *    - Once generation finishes, returns the full string to be saved in MongoDB.
 * 
 * @param {Array<{ role: 'user' | 'ai', content: string }>} messages - Past chat messages from database.
 * @param {Function} onChunk - Callback function that receives each word/token as it arrives.
 * @returns {Promise<string>} The complete assembled response text.
 */
const generateResponse = async (messages, onChunk) => {
  // Step 1: Format messages array for LangChain
  const formattedMessages = messages.map((msg) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    } else if (msg.role === "ai") {
      return new AIMessage(msg.content);
    }
  });

  // Step 2: Open an event stream with the agent
  const eventStream = await agent.streamEvents(
    { messages: formattedMessages },
    { version: "v2" }
  );

  let fullResponse = "";

  // Step 3: Loop through events as they arrive over the internet
  for await (const event of eventStream) {
    // Check if the event is the AI model producing a text chunk
    if (event.event === "on_chat_model_stream" && event.data?.chunk?.content) {
      const textChunk = event.data.chunk.content;
      fullResponse += textChunk;
      
      // Send this single piece of text to the socket callback
      if (typeof onChunk === "function") {
        onChunk(textChunk);
      }
    }
  }

  // Step 4: Return full text once streaming is complete
  return fullResponse;
};

/**
 * Generates a concise title (2-4 words) for a chat conversation based on the initial user message.
 * 
 * @param {string} message - The first message or prompt sent by the user.
 * 
 * @example
 * // 1. EXAMPLE INPUT DATA:
 * const message = "Can you help me write a Python script to scrape product prices from Amazon?";
 * 
 * // 2. HOW DATA FLOWS:
 * // - Sends SystemMessage (instructions) + HumanMessage (the prompt) to Mistral AI
 * 
 * // 3. EXAMPLE OUTPUT:
 * const title = await generateTitle(message);
 * // Returns: "Amazon Price Scraper"
 * 
 * @returns {Promise<string>} Short, clean 2-4 word chat title.
 */
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