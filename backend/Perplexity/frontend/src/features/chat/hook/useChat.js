import { useDispatch } from 'react-redux'
import { sendMessage, getChats, getMessages } from '../service/chat.api'
import { initializeSocketConnection } from '../service/chat.socket'

import {
    createNewChat,
    addNewMessage,
    setMessages,
    setChats,
    setCurrentChatId,
    setLoading,
    setError
} from '../chat.slice'

/**
 * ============================================================================
 * ARCHITECTURE LAYER 3: CONTROLLER / CUSTOM HOOK LAYER (useChat.js)
 * ============================================================================
 * 
 * WHAT IS THIS FILE?
 * This is the Controller/Brain of the entire Chat feature.
 * 
 * WHY DO WE NEED THIS HOOK INSTEAD OF WRITING LOGIC IN DASHBOARD.JSX?
 * 1. Clean UI Separation: The UI component (`Dashboard.jsx`) only cares about JSX & rendering.
 * 2. It handles the complete business logic: Optimistic UI updates, Axios API calling,
 *    error handling with try/catch, and updating the Redux Store.
 * 
 * COMPLETE DATA FLOW OVERVIEW:
 * [User types prompt & presses Enter in Dashboard.jsx]
 *          │
 *          ▼
 * [Dashboard.jsx calls handleSendMessage({ message, chatId })]
 *          │
 *          ├─► 1. Redux `setLoading(true)` -> Dashboard shows "Thinking..."
 *          ├─► 2. Optimistic Update: Redux `addNewMessage` -> User sees their message INSTANTLY on screen!
 *          │
 *          ▼
 * [Axios API calls Backend POST /api/chats/message]
 *          │ (Backend runs Google Gemini AI & saves chat/messages in MongoDB)
 *          ▼
 * [Backend returns response JSON: { newChat, userMessage, aiMessage, title }]
 *          │
 *          ├─► 3. Redux `createNewChat` & `setMessages` -> Updates chat with official MongoDB IDs
 *          ├─► 4. Redux `setCurrentChatId` -> Switches UI to real chat thread
 *          └─► 5. Redux `setLoading(false)` -> Spinner hides, ready for next question!
 */
const useChat = () => {
    const dispatch = useDispatch()

    /**
     * ------------------------------------------------------------------------
     * 1. handleSendMessage({ message, chatId })
     * ------------------------------------------------------------------------
     * PURPOSE:
     * Handles sending a user prompt to the AI with instant (Optimistic) UI feedback.
     * 
     * @param {Object} params
     * @param {string} params.message - The text question (e.g., "What is Node.js?")
     * @param {string|null} params.chatId - The active chat ID or null (for new thread)
     * 
     * HOW DATA FLOWS STEP-BY-STEP:
     * 
     * Step A: Activate Loading state
     *   - Dispatches `setLoading(true)` to Redux so UI disables the send button.
     * 
     * Step B: Determine Active Chat ID
     *   - If `chatId` exists (e.g. "66a012..."), we use it.
     *   - If starting a brand new conversation (`chatId` is null), we use a temporary ID `"temp"`.
     * 
     * Step C: Optimistic UI Update (INSTANT VISIBILITY)
     *   - Before waiting 3-5 seconds for Gemini AI, we immediately push the user's message
     *     into Redux via `addNewMessage`.
     *   - User sees their message appear on screen within 0 milliseconds!
     * 
     * Step D: Switch View
     *   - If it was a new thread, switch `currentChatId` in Redux to `"temp"` so the
     *     conversation view replaces the landing hero page.
     * 
     * Step E: Call Backend API
     *   - Calls `sendMessage({ message, chatId })` in `chat.api.js`.
     *   - Backend returns: `{ title, newChat, userMessage, aiMessage }`.
     * 
     * Step F: Sync with Backend Response
     *   - Case 1: NEW CHAT CREATED
     *     - Redux registers the real chat document with its real MongoDB `_id` (`createNewChat`).
     *     - Replaces temporary messages with official backend saved messages (`setMessages`).
     *     - Sets `currentChatId` to the real MongoDB `_id`.
     *   - Case 2: EXISTING CHAT
     *     - Appends the AI reply (`addNewMessage`) to the active conversation.
     * 
     * Step G: Turn off Loading
     *   - In `finally` block, `setLoading(false)` ensures spinner is always hidden.
     */
    const handleSendMessage = async ({ message, chatId }) => {
        try {
            // Step A: Loading spinner ON
            dispatch(setLoading(true))
            dispatch(setError(null))

            // Step B: Target Chat ID (use "temp" if chatId is null)
            const activeChatId = chatId || "temp"

            // Step C: Optimistic UI Update (User message appears instantly)
            dispatch(addNewMessage({
                chatId: activeChatId,
                message: {
                    role: "user",
                    content: message
                }
            }))

            // Step D: If starting a fresh chat, switch view from hero screen to conversation
            if (!chatId) {
                dispatch(setCurrentChatId("temp"))
            }

            // Step E: Send HTTP request to backend & wait for AI reasoning
            const data = await sendMessage({ message, chatId })
            // Sample data received:
            // {
            //   title: "Node.js Basics",
            //   newChat: { _id: "66a012bc...", title: "Node.js Basics" },
            //   userMessage: { _id: "m1", role: "user", content: "..." },
            //   aiMessage: { _id: "m2", role: "ai", content: "..." }
            // }

            // Step F: Update Redux with real MongoDB IDs and AI response
            if (data.newChat) {
                // Register new chat thread in Redux store
                dispatch(createNewChat({
                    chatId: data.newChat._id,
                    title: data.title || data.newChat.title
                }))

                // Save both user question and AI answer under real chat ID
                dispatch(setMessages({
                    chatId: data.newChat._id,
                    messages: [data.userMessage, data.aiMessage]
                }))

                // Set current view to official MongoDB chat ID
                dispatch(setCurrentChatId(data.newChat._id))
            } else {
                // For continuing chats, append AI answer to existing conversation
                if (data.aiMessage) {
                    dispatch(addNewMessage({
                        chatId: activeChatId,
                        message: data.aiMessage
                    }))
                }
            }
        } catch (err) {
            console.error("Failed to send message:", err)
            dispatch(setError(err?.response?.data?.error || err.message))
        } finally {
            // Step G: Loading spinner OFF
            dispatch(setLoading(false))
        }
    }

    /**
     * ------------------------------------------------------------------------
     * 2. handleGetChats()
     * ------------------------------------------------------------------------
     * PURPOSE:
     * Fetches all user's previous conversations on page load to populate the sidebar.
     * 
     * HOW IT WORKS:
     * Step A: Calls `getChats()` API (`GET /api/chats`).
     * Step B: Backend returns array: `[{ _id: "1", title: "Chat 1" }, { _id: "2", title: "Chat 2" }]`.
     * Step C: Converts array into key-value map dictionary:
     *         `{ "1": { _id: "1", title: "Chat 1", messages: [] }, "2": { ... } }`.
     * Step D: Dispatches `setChats(chatsMap)` to Redux.
     */
    const handleGetChats = async () => {
        try {
            dispatch(setLoading(true))
            const data = await getChats()
            const { chats } = data || { chats: [] }

            // Convert array into an object dictionary keyed by `_id` for instant O(1) lookup
            const chatsMap = (chats || []).reduce((acc, chat) => {
                acc[chat._id] = {
                    _id: chat._id,
                    title: chat.title,
                    messages: [],
                    updatedAt: chat.updatedAt
                }
                return acc
            }, {})

            // Store chats map in Redux state
            dispatch(setChats(chatsMap))
        } catch (err) {
            console.error("Failed to fetch chats:", err)
            dispatch(setError(err?.response?.data?.error || err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    /**
     * ------------------------------------------------------------------------
     * 3. handleOpenChats(chatId)
     * ------------------------------------------------------------------------
     * PURPOSE:
     * Loads the complete message history when user clicks a chat thread in the sidebar.
     * 
     * @param {string} chatId - MongoDB ID of the clicked chat thread (e.g. "66a012bc...")
     * 
     * HOW IT WORKS:
     * Step A: Immediately highlights the active chat in UI (`setCurrentChatId(chatId)`).
     * Step B: Calls `getMessages(chatId)` API (`GET /api/chats/:chatId/messages`).
     * Step C: Dispatches `setMessages({ chatId, messages })` to Redux store.
     * Step D: Dashboard re-renders with the entire loaded message thread.
     */
    const handleOpenChats = async (chatId) => {
        try {
            // Highlight clicked chat in UI immediately
            dispatch(setCurrentChatId(chatId))
            dispatch(setLoading(true))

            // Fetch messages from MongoDB
            const data = await getMessages(chatId)
            const { messages } = data || { messages: [] }

            // Store loaded messages in Redux
            dispatch(setMessages({
                chatId,
                messages: messages || []
            }))
        } catch (err) {
            console.error("Failed to fetch chat messages:", err)
            dispatch(setError(err?.response?.data?.error || err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    // Expose all functions to UI components
    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChats
    }
}

export default useChat