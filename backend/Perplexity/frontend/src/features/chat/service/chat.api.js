import axios from 'axios'

/**
 * ============================================================================
 * LAYER 1: API SERVICE LAYER (chat.api.js)
 * ============================================================================
 * Purpose:
 * Direct Axios HTTP requests to the backend API endpoints.
 * Handles baseURL, cookies/credentials, and returning raw response data.
 */

const api = axios.create({
    baseURL: "https://perplexity-clone-7nda.onrender.com",
    withCredentials: true
})

// 1. Send a message (creates a new chat if chatId is null, or continues existing chat)
const sendMessage = async ({ message, chatId }) => {
    // Note: Backend controller expects { message, chat: chatId }
    const response = await api.post('/api/chats/message', {
        message,
        chat: chatId
    })
    return response.data
}

// 2. Fetch list of all previous chats belonging to the user
const getChats = async () => {
    const response = await api.get('/api/chats')
    return response.data
}

// 3. Fetch all messages belonging to a specific chat ID
const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

// 4. Delete a chat session by ID
const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}

export { sendMessage, getChats, getMessages, deleteChat }