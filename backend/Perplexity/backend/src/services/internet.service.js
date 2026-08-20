import { tavily } from '@tavily/core';

const client = tavily({ 
    apiKey: process.env.TAVILY_API_KEY 
});

const searchInternet = async (query) => {
    const searchResult = await client.search(query, {
        maxResults: 5,
        searchDepth: "basic"
    });

    // Extract clean sources (title and url)
    const sources = (searchResult.results || []).map((result) => ({
        title: result.title,
        url: result.url
    }));

    // Return string for AI model + sources array for frontend
    return JSON.stringify({
        results: searchResult.results,
        sources: sources
    });
};

export { searchInternet };