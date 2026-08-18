import axios from 'axios'

const api = axios.create({
    baseURL: "https://perplexity-clone-7nda.onrender.com",
    withCredentials: true
})

// Send a message (creates a new chat if chatId is null, or continues existing chat)
const sendMessage = async ({ message, chatId }) => {
    // Note: Backend controller expects { message, chat: chatId }
    const response = await api.post('/api/chats/message', {
        message,
        chat: chatId
    })
    return response.data
}

// Get list of all previous chats
const getChats = async () => {
    const response = await api.get('/api/chats')
    return response.data
}

// Get all messages for a specific chat
const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

// Delete a chat
const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}

export { sendMessage, getChats, getMessages, deleteChat }