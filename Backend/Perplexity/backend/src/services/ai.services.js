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
 *    [chat.controller.js / server.socket.js] -> fetches past messages from MongoDB
 *           │ passes: `[{ role: "user", content: "..." }]`
 *           ▼
 *    [ai.services.js -> generateResponse(messages, onChunk)]
 *           │
 *           ├──► 1. Convert DB messages into LangChain Message Instances:
 *           │       • role "user" -> `new HumanMessage(content)`
 *           │       • role "ai"   -> `new AIMessage(content)`
 *           │
 *           ├──► 2. Stream the Agent: `agent.streamEvents({ messages }, { version: "v2" })`
 *           │       ├── LLM inspects prompt & decides: "I need live web data!"
 *           │       ├── LLM calls `searchInternetTool({ query: "AI news August 2026" })`
 *           │       ├── `internet.service.js` fetches Tavily web results
 *           │       └── LLM reads results and streams tokens one-by-one
 *           │
 *           ├──► 3. For every `on_chat_model_stream` event, we extract the tiny token
 *           │       and call `onChunk(token)`. The caller (server.socket.js) forwards
 *           │       that token to the browser over WebSocket (Socket.IO) -> live typing!
 *           │
 *           ▼
 *    [Return Full String Answer] -> saved to MongoDB AND streamed live to the Client
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
 * Safely converts a single AI stream chunk into a plain text string.
 *
 * WHY IS THIS NEEDED?
 * Mistral (and other providers) sometimes send chunks whose `content` is:
 *   - A plain string  -> "Hello"
 *   - An ARRAY of blocks -> [{ type: "text", text: "Hello" }, ...]
 *   - Empty ""         -> happens while the model is "thinking" or calling a tool
 *
 * We MUST filter out empty/tool-call chunks, otherwise the UI would flash
 * broken or blank fragments in the middle of the live typing effect.
 *
 * @param {object} chunk - The raw AIMessageChunk from a stream event.
 * @returns {string} The extracted text ("" if chunk had no text).
 */
const extractChunkText = (chunk) => {
  const content = chunk?.content;

  // Case 1: Standard string content (most common)
  if (typeof content === "string") {
    return content;
  }

  // Case 2: Multi-part content blocks (some modern models)
  if (Array.isArray(content)) {
    return content
      .filter((block) => block?.type === "text" && typeof block.text === "string")
      .map((block) => block.text)
      .join("");
  }

  // Case 3: No readable text (tool-call chunk etc.) -> ignore it
  return "";
};

/**
 * Generates an AI response for a conversation thread, streaming live tokens.
 * 
 * @param {Array<{ role: 'user' | 'ai', content: string }>} messages - Array of message objects representing the chat history.
 * @param {function(string): void} [onChunk] - Optional callback invoked for EVERY
 *        token/word streamed by the model. The caller forwards it to the browser.
 * 
 * @example
 * // 1. EXAMPLE INPUT DATA:
 * const messages = [
 *   { role: "user", content: "What is the capital of France?" },
 *   { role: "ai", content: "The capital of France is Paris." },
 *   { role: "user", content: "What are some top attractions to visit there today?" }
 * ];
 * 
 * // 2. HOW DATA FLOWS INSIDE:
 * // - `messages` mapped to [HumanMessage, AIMessage, HumanMessage]
 * // - `agent.streamEvents()` streams the Agent loop (ReAct: reason -> tool -> answer)
 * // - Every `on_chat_model_stream` event carries one tiny text chunk.
 * // - We extract the text with `extractChunkText()` and forward it via `onChunk()`.
 * 
 * // 3. EXAMPLE USAGE:
 * const response = await generateResponse(messages, (piece) => {
 *   console.log("live token:", piece);   // "Paris", " is", " the", ...
 * });
 * // `response` holds the full concatenated string as well.
 * 
 * @returns {Promise<string>} The complete AI assistant response text.
 */
const generateResponse = async (messages, onChunk) => {
  // Step 1: Convert plain DB objects into LangChain message instances.
  // `filter(Boolean)` removes any message with an unknown/unmapped role.
  const formattedMessages = messages
    .map((msg) => {
      if (msg.role === "user") return new HumanMessage(msg.content);
      if (msg.role === "ai") return new AIMessage(msg.content);
      return null;
    })
    .filter(Boolean);

  // Step 2: Open the live event stream for the Agent.
  // version "v2" gives us richer, easier-to-read events (incl. token streaming).
  const eventStream = await agent.streamEvents(
    { messages: formattedMessages },
    { version: "v2" }
  );

  let fullResponse = "";

  // Step 3: Walk through every event emitted by the Agent.
  for await (const event of eventStream) {
    // We only care about token-streaming events from the chat model itself.
    // (Other events are for tool calls, chain start/end, etc.)
    if (event.event !== "on_chat_model_stream") continue;

    const textChunk = extractChunkText(event.data?.chunk);
    if (!textChunk) continue; // skip empty/tool-call chunks

    // Accumulate it into the full answer (saved to DB later)
    fullResponse += textChunk;

    // Send this single token to the live callback (-> Socket.IO -> browser)
    if (typeof onChunk === "function") {
      onChunk(textChunk);
    }
  }

  // Step 4: Return the assembled final answer to the caller.
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