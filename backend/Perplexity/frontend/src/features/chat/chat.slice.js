import { createSlice } from '@reduxjs/toolkit'

/**
 * ============================================================================
 * LAYER 2: REDUX STATE MANAGEMENT SLICE (chat.slice.js)
 * ============================================================================
 * 
 * WHAT IS THIS FILE?
 * This file defines the global "Single Source of Truth" for our chat feature.
 * In Redux Toolkit:
 * - `initialState`: Defines what the data starts like.
 * - `reducers`: Functions that describe HOW to mutate/update that data.
 * - `actions`: Auto-generated trigger functions that components dispatch to run reducers.
 *
 * HOW IS `state.chats` STRUCTURED?
 * We store chats as a dictionary (Key-Value Object) instead of an array.
 * Key = chatId (`_id`), Value = Chat object containing its metadata and messages array.
 * 
 * Example of `state`:
 * {
 *   chats: {
 *     "66a012bc": {
 *       _id: "66a012bc",
 *       title: "How does Javascript work?",
 *       messages: [
 *         { _id: "m1", role: "user", content: "How does Javascript work?" },
 *         { _id: "m2", role: "ai",   content: "Javascript is single-threaded..." }
 *       ]
 *     }
 *   },
 *   currentChatId: "66a012bc", // Tells UI which chat is actively open on the screen
 *   loading: false,            // True when waiting for backend/AI response
 *   error: null                // Error message string if something fails
 * }
 */
const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},           // Object map of all chats keyed by chatId
        currentChatId: null, // Active chat ID (null = new thread / landing view)
        loading: false,      // Boolean loading state for spinners & button disabling
        error: null          // Stores error message or null
    },
    reducers: {
        /**
         * 1. createNewChat
         * WHY: When a user sends their first message in a brand new thread, the backend
         * creates a new chat document with an AI-generated title and `_id`. We need
         * to register this brand new chat inside `state.chats`.
         * 
         * PAYLOAD EXPECTED: { chatId: "...", title: "..." }
         */
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                _id: chatId,
                title: title || "New Thread",
                messages: []
            }
        },

        /**
         * 2. addNewMessage
         * WHY: Whenever a message arrives (either the user sent a prompt, or AI responded),
         * we push that single message to `state.chats[chatId].messages`.
         * 
         * SAFETY: If for some reason the chat entry doesn't exist yet, it creates it first.
         * 
         * PAYLOAD EXPECTED: { chatId: "...", message: { _id, role: "user"|"ai", content: "..." } }
         */
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

        /**
         * 3. setMessages
         * WHY: When a user clicks on an old chat from the sidebar, we fetch its entire
         * message history from the backend (`/api/chats/:chatId/messages`). This reducer
         * sets/replaces the entire `messages` array for that specific chat session.
         * 
         * PAYLOAD EXPECTED: { chatId: "...", messages: [ {...}, {...} ] }
         */
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

        /**
         * 4. setChats
         * WHY: When Dashboard first loads, we fetch the list of all past chats from the backend
         * to show in the sidebar. This reducer sets the whole `state.chats` object.
         * 
         * PAYLOAD EXPECTED: Object map { "chatId1": { ... }, "chatId2": { ... } }
         */
        setChats: (state, action) => {
            state.chats = action.payload
        },

        /**
         * 5. setCurrentChatId
         * WHY: Controls which conversation is displayed on the main screen.
         * - Setting to `"chatId123"` opens that chat's conversation feed.
         * - Setting to `null` displays the clean "Where knowledge begins" hero prompt.
         * 
         * PAYLOAD EXPECTED: "chatId123" OR null
         */
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },

        /**
         * 6. setLoading
         * WHY: Indicates whether an async operation (like waiting for Gemini AI or fetching chats)
         * is in progress. The UI uses this to show "Thinking..." and disable the Send button.
         * 
         * PAYLOAD EXPECTED: true | false
         */
        setLoading: (state, action) => {
            state.loading = action.payload
        },

        /**
         * 7. setError
         * WHY: Stores any error message returned from the backend or Axios failure.
         * 
         * PAYLOAD EXPECTED: "Error message string" | null
         */
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

// Export action creators for use with dispatch(...)
export const {
    createNewChat,
    addNewMessage,
    setMessages,
    setChats,
    setCurrentChatId,
    setLoading,
    setError
} = chatSlice.actions

// Export reducer to be combined into the main Redux store
export default chatSlice.reducer