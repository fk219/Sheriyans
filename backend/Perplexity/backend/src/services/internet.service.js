import { tavily } from '@tavily/core';

/**
 * ============================================================================
 * INTERNET SEARCH SERVICE (internet.service.js)
 * ============================================================================
 * 
 * 1. PURPOSE:
 *    - Connects to the external Tavily Search API.
 *    - Gives the AI Agent the superpower to query live internet search results,
 *      news, documentation, and real-time facts.
 * 
 * 2. COMPLETE DATA FLOW:
 *    ┌─────────────────────────────────────────────────────────────┐
 *    │ 1. AI Agent in ai.services.js decides it needs live info    │
 *    │    e.g. Query: "What happened today in Tech news?"          │
 *    └──────────────────────────────┬──────────────────────────────┘
 *                                   │ passes string `query`
 *                                   ▼
 *    ┌─────────────────────────────────────────────────────────────┐
 *    │ 2. internet.service.js -> `searchInternet(query)`           │
 *    │    Calls Tavily API using TAVILY_API_KEY                    │
 *    └──────────────────────────────┬──────────────────────────────┘
 *                                   │ receives raw search object
 *                                   ▼
 *    ┌─────────────────────────────────────────────────────────────┐
 *    │ 3. Extract & Format:                                        │
 *    │    - `results`: Detailed page content for AI to read        │
 *    │    - `sources`: [{ title, url }] for citations              │
 *    └──────────────────────────────┬──────────────────────────────┘
 *                                   │ returns JSON string
 *                                   ▼
 *    ┌─────────────────────────────────────────────────────────────┐
 *    │ 4. Sent back to AI Agent (LangChain Tool)                   │
 *    │    The AI reads the search results and drafts the answer!   │
 *    └─────────────────────────────────────────────────────────────┘
 */

// Initialize Tavily Client with API Key from environment variables (.env)
const client = tavily({ 
    apiKey: process.env.TAVILY_API_KEY 
});

/**
 * Searches the web for a given query and returns formatted results + sources.
 * 
 * @param {string} query - The search query term.
 * 
 * @example
 * // 1. EXAMPLE INPUT DATA:
 * const query = "Who won the latest football match yesterday?";
 * 
 * // 2. HOW TAVILY PROCESSES IT:
 * // Tavily queries search engines, parses live websites, and strips HTML.
 * 
 * // 3. EXAMPLE RETURNED DATA (JSON string):
 * // {
 * //   "results": [
 * //     {
 * //       "title": "Match Summary - August 2026",
 * //       "url": "https://sports.example.com/match-123",
 * //       "content": "Real Madrid secured a 2-1 victory...",
 * //       "score": 0.98
 * //     }
 * //   ],
 * //   "sources": [
 * //     { "title": "Match Summary - August 2026", "url": "https://sports.example.com/match-123" }
 * //   ]
 * // }
 * 
 * @returns {Promise<string>} JSON string representation of search results and sources.
 */
const searchInternet = async ({query}) => {
    // Check if API key is configured
    if (!process.env.TAVILY_API_KEY) {
        console.warn("⚠️ TAVILY_API_KEY is not set in environment variables. Web search will not work.");
        return JSON.stringify({
            error: "TAVILY_API_KEY is missing. Please set TAVILY_API_KEY in your .env file.",
            results: [],
            sources: []
        });
    }

    try {
        const searchResult = await client.search(query, {
            maxResults: 5,
            searchDepth: "basic"
        });

        // Extract clean sources (title and url) for citations
        const sources = (searchResult.results || []).map((result) => ({
            title: result.title,
            url: result.url
        }));

        // Return string for AI model + sources array
        return JSON.stringify({
            results: searchResult.results || [],
            sources: sources
        });
    } catch (error) {
        console.error("❌ Error executing web search:", error.message);
        return JSON.stringify({
            error: `Web search failed: ${error.message}`,
            results: [],
            sources: []
        });
    }
};

export { searchInternet };