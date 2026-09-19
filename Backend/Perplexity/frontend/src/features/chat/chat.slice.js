import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        loading: false,
        error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                _id: chatId,
                title: title || "New Thread",
                messages: []
            }
        },
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
        appendAiChunk: (state, action) => {
            const { chatId, chunk } = action.payload
            const chat = state.chats[chatId]
            if (!chat) return

            const last = chat.messages[chat.messages.length - 1]
            if (last && last.role === "ai" && last.streaming) {
                last.content += chunk
            } else {
                chat.messages.push({ role: "ai", content: chunk, streaming: true })
            }
        },
        finalizeAiMessage: (state, action) => {
            const { chatId, message } = action.payload
            const chat = state.chats[chatId]
            if (!chat) return

            const index = chat.messages.findIndex((item) => item.streaming)
            if (index !== -1) {
                chat.messages[index] = { ...message, streaming: false }
            } else {
                chat.messages.push(message)
            }
        },
        setMessages: (state, action) => {
            const { chatId, messages } = action.payload
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    _id: chatId,
                    title: "New Thread",
                    messages: []
                }
            }
            state.chats[chatId].messages = messages
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const {
    createNewChat,
    addNewMessage,
    appendAiChunk,
    finalizeAiMessage,
    setMessages,
    setChats,
    setCurrentChatId,
    setLoading,
    setError
} = chatSlice.actions

export default chatSlice.reducer