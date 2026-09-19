import { tavily } from '@tavily/core';

const client = tavily({ 
    apiKey: process.env.TAVILY_API_KEY 
});

const searchInternet = async (queryInput) => {
    if (!process.env.TAVILY_API_KEY) {
        console.warn("⚠️ TAVILY_API_KEY is not set in environment variables. Web search will not work.");
        return JSON.stringify({
            error: "TAVILY_API_KEY is missing. Please set TAVILY_API_KEY in your .env file.",
            results: [],
            sources: []
        });
    }

    const query = typeof queryInput === 'object' && queryInput !== null
        ? queryInput.query
        : queryInput;

    if (!query || typeof query !== 'string') {
        return JSON.stringify({
            error: "Search query must be a valid non-empty string.",
            results: [],
            sources: []
        });
    }

    try {
        const searchResult = await client.search(query, {
            maxResults: 5,
            searchDepth: "basic"
        });

        const sources = (searchResult.results || []).map((result) => ({
            title: result.title,
            url: result.url
        }));

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