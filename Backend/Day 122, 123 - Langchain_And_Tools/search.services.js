// To install: npm i @tavily/core
import { tavily } from '@tavily/core'

const client = tavily({ 
    apiKey: process.env.TAVILY_API_KEY
});


const searchGoogle = ({query}) => {
    const response = client.search(query, {
        searchDepth: 'advanced'
    })

    return query
}

export {searchGoogle}