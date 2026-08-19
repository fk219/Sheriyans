import axios from 'axios'

/**
 * ============================================================================
 * ARCHITECTURE LAYER 1: API SERVICE LAYER (chat.api.js)
 * ============================================================================
 * 
 * PURPOSE:
 * - This layer is responsible ONLY for talking to the Backend server over HTTP/REST.
 * - It does NOT know anything about React components, state, or Redux.
 * - It takes simple parameters, makes Axios network calls, and returns JSON data.
 * 
 * DATA FLOW:
 * [useChat Hook] ---> Calls functions here ---> [Backend REST API (Express + MongoDB)]
 * [useChat Hook] <--- Returns Response JSON <--- [Backend REST API]
 * 
 * AXIOS INSTANCE CONFIGURATION:
 * - `baseURL`: Server address where the backend API is hosted.
 * - `withCredentials: true`: Automatically sends HTTP-only session cookies (JWT tokens)
 *   so the backend knows which user is currently logged in.
 */

const api = axios.create({
    baseURL: "https://perplexity-clone-7nda.onrender.com",
    withCredentials: true
})

/**
 * ----------------------------------------------------------------------------
 * 1. sendMessage({ message, chatId })
 * ----------------------------------------------------------------------------
 * METHOD: POST
 * ENDPOINT: /api/chats/message
 * 
 * PURPOSE:
 * Sends the user's prompt to the backend. The backend forwards it to Google Gemini AI,
 * saves the conversation in MongoDB, and returns both the user message and AI reply.
 * 
 * PARAMETERS PASSED:
 * @param {Object} payload
 * @param {string} payload.message - The text prompt typed by the user (e.g. "What is Node.js?")
 * @param {string|null} payload.chatId - Existing MongoDB Chat _id (e.g. "66a012bc..."), OR null if starting a brand new conversation
 * 
 * REQUEST BODY SENT TO BACKEND:
 * {
 *   "message": "What is Node.js?",
 *   "chat": "66a012bc..." // or null
 * }
 * 
 * SAMPLE RESPONSE RECEIVED FROM BACKEND:
 * Case A: First message of a NEW chat (chatId was null)
 * {
 *   "title": "Node.js Basics",
 *   "newChat": {
 *     "_id": "66a012bc394a8f10",
 *     "title": "Node.js Basics",
 *     "user": "66a00f12...",
 *     "createdAt": "2026-08-19T10:00:00.000Z"
 *   },
 *   "userMessage": {
 *     "_id": "msg_001",
 *     "role": "user",
 *     "content": "What is Node.js?",
 *     "chat": "66a012bc394a8f10"
 *   },
 *   "aiMessage": {
 *     "_id": "msg_002",
 *     "role": "ai",
 *     "content": "Node.js is an open-source, cross-platform JavaScript runtime environment...",
 *     "chat": "66a012bc394a8f10"
 *   }
 * }
 * 
 * Case B: Message in an EXISTING chat (chatId was "66a012bc394a8f10")
 * {
 *   "userMessage": {
 *     "_id": "msg_003",
 *     "role": "user",
 *     "content": "How does the event loop work?",
 *     "chat": "66a012bc394a8f10"
 *   },
 *   "aiMessage": {
 *     "_id": "msg_004",
 *     "role": "ai",
 *     "content": "The event loop allows Node.js to perform non-blocking I/O operations...",
 *     "chat": "66a012bc394a8f10"
 *   }
 * }
 */
const sendMessage = async ({ message, chatId }) => {
    const response = await api.post('/api/chats/message', {
        message,
        chat: chatId
    })
    return response.data
}

/**
 * ----------------------------------------------------------------------------
 * 2. getChats()
 * ----------------------------------------------------------------------------
 * METHOD: GET
 * ENDPOINT: /api/chats
 * 
 * PURPOSE:
 * Fetches all past chat threads created by the currently logged-in user.
 * Used to populate the left sidebar library list when the page loads.
 * 
 * PARAMETERS: None (User identity is read from authentication cookie)
 * 
 * SAMPLE RESPONSE RECEIVED FROM BACKEND:
 * {
 *   "chats": [
 *     {
 *       "_id": "66a012bc394a8f10",
 *       "title": "Node.js Basics",
 *       "user": "66a00f12...",
 *       "updatedAt": "2026-08-19T10:05:00.000Z"
 *     },
 *     {
 *       "_id": "66a099ef412b1234",
 *       "title": "React Custom Hooks",
 *       "user": "66a00f12...",
 *       "updatedAt": "2026-08-18T15:30:00.000Z"
 *     }
 *   ]
 * }
 */
const getChats = async () => {
    const response = await api.get('/api/chats')
    return response.data
}

/**
 * ----------------------------------------------------------------------------
 * 3. getMessages(chatId)
 * ----------------------------------------------------------------------------
 * METHOD: GET
 * ENDPOINT: /api/chats/:chatId/messages
 * 
 * PURPOSE:
 * Fetches the entire conversation history of a specific chat session.
 * Called when a user clicks on a chat title in the sidebar.
 * 
 * PARAMETERS PASSED:
 * @param {string} chatId - The MongoDB ID of the selected chat (e.g. "66a012bc394a8f10")
 * 
 * SAMPLE RESPONSE RECEIVED FROM BACKEND:
 * {
 *   "messages": [
 *     {
 *       "_id": "msg_001",
 *       "role": "user",
 *       "content": "What is Node.js?",
 *       "createdAt": "2026-08-19T10:00:00.000Z"
 *     },
 *     {
 *       "_id": "msg_002",
 *       "role": "ai",
 *       "content": "Node.js is an open-source, cross-platform JavaScript runtime...",
 *       "createdAt": "2026-08-19T10:00:04.000Z"
 *     }
 *   ]
 * }
 */
const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

/**
 * ----------------------------------------------------------------------------
 * 4. deleteChat(chatId)
 * ----------------------------------------------------------------------------
 * METHOD: DELETE
 * ENDPOINT: /api/chats/delete/:chatId
 * 
 * PURPOSE:
 * Permanently deletes a chat session and all its messages from MongoDB.
 * 
 * SAMPLE RESPONSE RECEIVED FROM BACKEND:
 * {
 *   "message": "Chat deleted successfully",
 *   "chatId": "66a012bc394a8f10"
 * }
 */
const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}

export { sendMessage, getChats, getMessages, deleteChat }