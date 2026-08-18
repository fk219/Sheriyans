import { createSlice } from '@reduxjs/toolkit'

/**
 * Chat Redux Slice
 * Structure of `chats`:
 * {
 *   "chat_id_123": {
 *      _id: "chat_id_123",
 *      title: "Title of chat",
 *      messages: [
 *        { _id: "msg1", role: "user", content: "hello" },
 *        { _id: "msg2", role: "ai", content: "Hi! How can I help?" }
 *      ]
 *   }
 * }
 */
const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        loading: false,
        error: null
    },
    reducers: {
        // Create a new chat session in state
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                _id: chatId,
                title: title || "New Thread",
                messages: []
            }
        },
        // Add a message (user or ai) to a specific chat
        addNewMessage: (state, action) => {
            const { chatId, message } = action.payload
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    _id: chatId,
                    title: "New Thread",
                    messages: []
                }
            }
            state.chats[chatId].messages.push(message)
        },
        // Set all chats
        setChats: (state, action) => {
            state.chats = action.payload
        },
        // Set the currently active chat ID
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        // Loading status (e.g. while waiting for AI response)
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        // Set any API error
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const {
    createNewChat,
    addNewMessage,
    setChats,
    setCurrentChatId,
    setLoading,
    setError
} = chatSlice.actions

export default chatSlice.reducer