import axios from 'axios'


const api = axios.create({
    baseURL: "https://perplexity-clone-7nda.onrender.com/",
    withCredentials: true
})


const sendMessage = async ({message, chatId}) => {
    const response = await api.post('/api/chats/message', {
        message,
        chatId
    })

    return response
}

const getChats = async () => {
    const response = await api.get('/api/chats')
    return response
}

const getMessages = async (chatdId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response
}

const deleteChat = async (chatdId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response
}

export {sendMessage, getChats, getMessages, deleteChat}