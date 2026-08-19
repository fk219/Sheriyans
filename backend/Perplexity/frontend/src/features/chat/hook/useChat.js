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
 * LAYER 3: CUSTOM HOOK / CONTROLLER LAYER (useChat.js)
 * ============================================================================
 * 
 * WHAT IS THIS FILE?
 * This is the Controller/Brain of our chat feature.
 * UI components (`Dashboard.jsx`) shouldn't directly deal with Axios API calls,
 * try/catch blocks, error parsing, and complex Redux dispatches.
 * Instead, this hook exposes 3 clean, simple async functions:
 * 1. `handleSendMessage({ message, chatId })` -> Sends prompt to AI and updates store
 * 2. `handleGetChats()` -> Loads sidebar threads list from backend
 * 3. `handleOpenChats(chatId)` -> Loads message history when a user clicks a chat
 * 4. `initializeSocketConnection()` -> Connects to WebSocket server
 */
const useChat = () => {
    const dispatch = useDispatch()

    /**
     * ------------------------------------------------------------------------
     * 1. handleSendMessage({ message, chatId })
     * ------------------------------------------------------------------------
     * PURPOSE:
     * Handles the entire lifecycle of sending a prompt to the AI.
     * 
     * HOW IT WORKS STEP-BY-STEP:
     * Step A: Sets loading = true (UI shows "Thinking..." spinner) & clears old errors.
     * Step B: Calls backend API `sendMessage({ message, chatId })`.
     *         - If `chatId` is null (first message of a new thread), backend generates
     *           a new MongoDB Chat document with an AI title and returns `{ newChat, title, ... }`.
     * Step C: If it's a new chat, registers it in Redux (`createNewChat`) and makes it active (`setCurrentChatId`).
     * Step D: Dispatches the user's message (`addNewMessage`) to Redux store.
     * Step E: Dispatches the AI's response message (`addNewMessage`) to Redux store.
     * Step F: Sets loading = false.
     */
    const handleSendMessage = async ({ message, chatId }) => {
        try {
            // Step A: Activate loading state in Redux
            dispatch(setLoading(true))
            dispatch(setError(null))

            // Step B: Send HTTP request to backend
            const data = await sendMessage({ message, chatId })
            // Returned payload format: { title, newChat, userMessage, aiMessage }

            const activeChatId = chatId || (data.newChat && data.newChat._id)

            // Step C: If a new chat thread was created on backend, save it to Redux
            if (data.newChat) {
                dispatch(createNewChat({
                    chatId: activeChatId,
                    title: data.title || data.newChat.title
                }))
                // Switch current view to this new chat ID
                dispatch(setCurrentChatId(activeChatId))
            }

            // Step D: Add user's question to the chat in Redux
            if (data.userMessage) {
                dispatch(addNewMessage({
                    chatId: activeChatId,
                    message: data.userMessage
                }))
            }

            // Step E: Add AI's generated reply to the chat in Redux
            if (data.aiMessage) {
                dispatch(addNewMessage({
                    chatId: activeChatId,
                    message: data.aiMessage
                }))
            }
        } catch (err) {
            console.error("Failed to send message:", err)
            // Save error message to Redux store so UI can display alert if needed
            dispatch(setError(err?.response?.data?.error || err.message))
        } finally {
            // Step F: Always turn off loading spinner when done
            dispatch(setLoading(false))
        }
    }

    /**
     * ------------------------------------------------------------------------
     * 2. handleGetChats()
     * ------------------------------------------------------------------------
     * PURPOSE:
     * Fetches all previous chats created by the logged-in user to display in the sidebar.
     * 
     * HOW IT WORKS STEP-BY-STEP:
     * Step A: Calls `getChats()` API (`GET /api/chats`).
     * Step B: Backend returns an array `[{ _id, title, ... }]`.
     * Step C: Converts that array into a normalized key-value dictionary object:
     *         `{ [chat._id]: { _id, title, messages: [] } }`
     * Step D: Saves the dictionary into Redux (`setChats`).
     */
    const handleGetChats = async () => {
        try {
            dispatch(setLoading(true))
            const data = await getChats()
            const { chats } = data || { chats: [] }

            // Convert array into an object dictionary keyed by `_id` for O(1) instant lookup
            const chatsMap = (chats || []).reduce((acc, chat) => {
                acc[chat._id] = {
                    _id: chat._id,
                    title: chat.title,
                    messages: [],
                    updatedAt: chat.updatedAt
                }
                return acc
            }, {})

            // Store all chats in Redux state
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
     * Called when a user clicks on an existing chat in the sidebar.
     * 
     * HOW IT WORKS STEP-BY-STEP:
     * Step A: Sets `currentChatId` in Redux to `chatId` immediately (highlights clicked item).
     * Step B: Calls backend API `getMessages(chatId)` (`GET /api/chats/:chatId/messages`).
     * Step C: Formats and stores the full message history into Redux (`setMessages`).
     * Step D: Dashboard re-renders with the entire past conversation feed.
     */
    const handleOpenChats = async (chatId) => {
        try {
            // Step A: Highlight active chat in UI immediately
            dispatch(setCurrentChatId(chatId))
            dispatch(setLoading(true))

            // Step B: Fetch messages for this chat from MongoDB
            const data = await getMessages(chatId)
            const { messages } = data || { messages: [] }

            // Step C: Format message objects cleanly
            const formattedMessages = (messages || []).map(msg => ({
                _id: msg._id,
                content: msg.content,
                role: msg.role,
                createdAt: msg.createdAt
            }))

            // Step D: Save messages in Redux for this chat
            dispatch(setMessages({
                chatId,
                messages: formattedMessages
            }))
        } catch (err) {
            console.error("Failed to fetch chat messages:", err)
            dispatch(setError(err?.response?.data?.error || err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    // Expose all operations to UI components
    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChats
    }
}

export default useChat