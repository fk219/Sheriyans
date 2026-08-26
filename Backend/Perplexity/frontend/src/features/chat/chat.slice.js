import { createSlice } from '@reduxjs/toolkit'

/**
 * ============================================================================
 * ARCHITECTURE LAYER 2: REDUX STATE MANAGEMENT SLICE (chat.slice.js)
 * ============================================================================
 * 
 * WHAT IS THIS FILE?
 * This is the central in-memory database of our frontend (Single Source of Truth).
 * Any React component (like `Dashboard.jsx`) can read state from here using `useSelector`,
 * and any controller hook (like `useChat.js`) can update this state using `dispatch(action)`.
 * 
 * WHY DICTIONARY (KEY-VALUE OBJECT) FOR `chats` INSTEAD OF AN ARRAY?
 * If `chats` was an array `[ { _id: "1", ... }, { _id: "2", ... } ]`:
 * - Finding a chat to insert a new message would require `array.find()` -> O(n) slow lookup.
 * By storing it as an object dictionary `{ "1": { ... }, "2": { ... } }`:
 * - We can instantly read or update `state.chats[chatId]` -> O(1) instant lookup!
 * 
 * ----------------------------------------------------------------------------
 * COMPLETE REDUX STATE STRUCTURE & SAMPLE DATA:
 * ----------------------------------------------------------------------------
 * state.chat = {
 *   chats: {
 *     "66a012bc394a8f10": {
 *       _id: "66a012bc394a8f10",
 *       title: "Node.js Basics",
 *       messages: [
 *         {
 *           _id: "msg_001",
 *           role: "user",
 *           content: "What is Node.js?",
 *           createdAt: "2026-08-19T10:00:00.000Z"
 *         },
 *         {
 *           _id: "msg_002",
 *           role: "ai",
 *           content: "Node.js is an open-source, cross-platform JavaScript runtime...",
 *           createdAt: "2026-08-19T10:00:04.000Z"
 *         }
 *       ],
 *       updatedAt: "2026-08-19T10:00:04.000Z"
 *     }
 *   },
 *   currentChatId: "66a012bc394a8f10", // ID of chat currently displayed on screen (null = hero landing page)
 *   loading: false,                     // true when AI is generating response or fetching data
 *   error: null                         // Error message string if any request fails, otherwise null
 * }
 */
const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},           // Object map: { [chatId]: { _id, title, messages: [], updatedAt } }
        currentChatId: null, // String chatId or null
        loading: false,      // Boolean: shows loading indicator / disables send button
        error: null          // String | null
    },
    reducers: {
        /**
         * --------------------------------------------------------------------
         * 1. createNewChat
         * --------------------------------------------------------------------
         * PURPOSE:
         * Registers a brand new chat session in the Redux store.
         * 
         * WHEN IS IT DISPATCHED?
         * When the user starts a fresh conversation and backend responds with `data.newChat`.
         * 
         * SAMPLE ACTION PAYLOAD:
         * {
         *   chatId: "66a012bc394a8f10",
         *   title: "Node.js Basics"
         * }
         * 
         * WHAT IT DOES TO STATE:
         * Inserts a new key `state.chats["66a012bc394a8f10"]` with an empty `messages: []` array.
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
         * --------------------------------------------------------------------
         * 2. addNewMessage
         * --------------------------------------------------------------------
         * PURPOSE:
         * Appends a single message (either user prompt or AI response) to the active chat.
         * 
         * WHEN IS IT DISPATCHED?
         * 1. Immediately when user clicks send (Optimistic UI update).
         * 2. When AI response is received from backend or WebSocket.
         * 
         * SAMPLE ACTION PAYLOAD:
         * {
         *   chatId: "66a012bc394a8f10",
         *   message: {
         *     role: "user",
         *     content: "What is Node.js?"
         *   }
         * }
         * 
         * WHAT IT DOES TO STATE:
         * Finds `state.chats[chatId].messages` and does `.push(message)`.
         * (If chat entry didn't exist, safely initializes it first).
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
         * --------------------------------------------------------------------
         * 2.5 appendAiChunk  (NEW: powers the live Socket.IO typing effect)
         * --------------------------------------------------------------------
         * PURPOSE:
         * Appends ONE incoming token/chunk from the AI to the current "typing"
         * message. This is fired on EVERY `ai_typing` socket event, so the
         * answer appears word-by-word live in the chat window.
         * 
         * WHEN IS IT DISPATCHED?
         * - Every time the backend streams `ai_typing { chatId, chunk }`.
         * 
         * SAMPLE ACTION PAYLOAD:
         * {
         *   chatId: "66a012bc394a8f10",
         *   chunk: "Paris"
         * }
         * 
         * WHAT IT DOES TO STATE:
         * - If the LAST message is already a live AI "streaming" message, we
         *   just concatenate the new chunk onto it.
         * - Otherwise (fresh AI turn), we create a new temporary message with
         *   `streaming: true` and start it off with this first chunk.
         * 
         * SAMPLE STATE BEFORE:
         * messages: [ { role:"user", content:"Top Paris attractions?" } ]
         * 
         * SAMPLE STATE AFTER (three chunks "Paris", " is", " great"):
         * messages: [
         *   { role:"user", content:"Top Paris attractions?" },
         *   { role:"ai", content:"Paris is great", streaming: true }
         * ]
         */
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

        /**
         * --------------------------------------------------------------------
         * 2.6 finalizeAiMessage  (NEW: replaces temp bubble with saved message)
         * --------------------------------------------------------------------
         * PURPOSE:
         * Called when the backend emits `ai_done`. The AI answer is finished
         * and has been saved to MongoDB — we swap the temporary streaming
         * message for the real saved message (which has a proper _id).
         * 
         * WHEN IS IT DISPATCHED?
         * - When the `ai_done { chatId, message }` socket event arrives.
         * 
         * SAMPLE ACTION PAYLOAD:
         * {
         *   chatId: "66a012bc394a8f10",
         *   message: { _id: "msg_9", role: "ai", content: "Paris is great", chat: "66a..." }
         * }
         */
        finalizeAiMessage: (state, action) => {
            const { chatId, message } = action.payload
            const chat = state.chats[chatId]
            if (!chat) return

            const idx = chat.messages.findIndex((m) => m.streaming)
            if (idx !== -1) {
                chat.messages[idx] = { ...message, streaming: false }
            } else {
                chat.messages.push(message)
            }
        },

        /**
         * --------------------------------------------------------------------
         * 3. setMessages
         * --------------------------------------------------------------------
         * PURPOSE:
         * Replaces the entire `messages` array of a specific chat with a full list of messages.
         * 
         * WHEN IS IT DISPATCHED?
         * 1. When user clicks an old chat thread from sidebar -> Fetches full message history.
         * 2. When a new chat finishes loading -> Replaces temporary messages with official backend messages.
         * 
         * SAMPLE ACTION PAYLOAD:
         * {
         *   chatId: "66a012bc394a8f10",
         *   messages: [
         *     { _id: "m1", role: "user", content: "Hi" },
         *     { _id: "m2", role: "ai", content: "Hello! How can I help you?" }
         *   ]
         * }
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
         * --------------------------------------------------------------------
         * 4. setChats
         * --------------------------------------------------------------------
         * PURPOSE:
         * Populates the complete sidebar list of all chat sessions.
         * 
         * WHEN IS IT DISPATCHED?
         * On initial dashboard mount (`useEffect`) after `getChats()` API returns.
         * 
         * SAMPLE ACTION PAYLOAD:
         * {
         *   "66a012bc394a8f10": { _id: "66a012bc394a8f10", title: "Node.js Basics", messages: [] },
         *   "66a099ef412b1234": { _id: "66a099ef412b1234", title: "React Hooks", messages: [] }
         * }
         */
        setChats: (state, action) => {
            state.chats = action.payload
        },

        /**
         * --------------------------------------------------------------------
         * 5. setCurrentChatId
         * --------------------------------------------------------------------
         * PURPOSE:
         * Tells the UI which chat conversation should be shown on screen.
         * 
         * WHEN IS IT DISPATCHED?
         * - Dispatched with `"66a012bc..."` when user clicks a sidebar chat or creates a new one.
         * - Dispatched with `null` when user clicks "+ New Thread" button.
         * 
         * SAMPLE ACTION PAYLOAD:
         * "66a012bc394a8f10"   OR   null
         */
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },

        /**
         * --------------------------------------------------------------------
         * 6. setLoading
         * --------------------------------------------------------------------
         * PURPOSE:
         * Toggles loading spinner in the UI and disables the submit button.
         * 
         * SAMPLE ACTION PAYLOAD: true | false
         */
        setLoading: (state, action) => {
            state.loading = action.payload
        },

        /**
         * --------------------------------------------------------------------
         * 7. setError
         * --------------------------------------------------------------------
         * PURPOSE:
         * Stores error message string if an API fails, or clears it with null.
         * 
         * SAMPLE ACTION PAYLOAD: "Network error occurred" | null
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
    appendAiChunk,
    finalizeAiMessage,
    setMessages,
    setChats,
    setCurrentChatId,
    setLoading,
    setError
} = chatSlice.actions

// Export reducer to be combined into the main Redux store
export default chatSlice.reducer