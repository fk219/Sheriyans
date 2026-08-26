import { useDispatch } from 'react-redux'
import { sendMessage, getChats, getMessages } from '../service/chat.api'
import { initializeSocketConnection as initSocket, askAi } from '../service/chat.socket'

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
 * 1. WHAT IS THIS FILE?
 *    - This is the Controller/Business Logic layer for the chat feature.
 *    - It orchestrates interactions between the UI (`Dashboard.jsx`), REST API (`chat.api.js`),
 *      WebSockets (`chat.socket.js`), and Redux Global State (`chat.slice.js`).
 * 
 * 2. WHERE DOES DATA COME FROM & WHERE DOES IT GO?
 *    - INPUT FROM UI: User prompt string & active `chatId` passed from `Dashboard.jsx`.
 *    - DATA FROM BACKEND: 
 *        • `getChats()` -> Fetches array of all user chat sessions from MongoDB (`GET /api/chats`).
 *        • `getMessages(chatId)` -> Fetches messages array of selected chat from MongoDB (`GET /api/chats/:chatId/messages`).
 *        • `sendMessage({ message, chatId, stream: true })` -> Creates/updates chat + saves the USER message
 *          and returns the real chatId instantly (`POST /api/chats/message`).
 *        • WebSocket ("ask_ai" -> "ai_typing" / "ai_done") -> Streams the AI answer live token-by-token.
 *    - DISPATCH TO REDUX STORE: Updates `state.chat.chats`, `state.chat.currentChatId`, `state.chat.loading`, `state.chat.error`.
 * 
 * 3. COMPLETE DATA FLOW DIAGRAM (LIVE STREAMING):
 *    [Dashboard.jsx UI]
 *           │
 *           ├──► User types prompt & clicks send
 *           │
 *           ▼
 *    [useChat Hook (handleSendMessage)]
 *           │
 *           ├──► 1. Dispatch `setLoading(true)` (UI shows loading indicator)
 *           ├──► 2. Optimistic UI: Dispatch `addNewMessage` (User sees prompt immediately)
 *           ├──► 3. Call `sendMessage({..., stream: true })` API in `chat.api.js`
 *           │            ▼ (HTTP POST, returns FAST)
 *           │       Backend creates chat + saves USER message -> returns { newChat, userMessage }
 *           ├──► 4. Dispatch `createNewChat` / `setMessages` (real MongoDB ids replace "temp")
 *           ├──► 5. `askAi(chatId)` emits "ask_ai" over Socket.IO
 *           │            ▼
 *           │       Backend streams Mistral tokens -> "ai_typing { chatId, chunk }"
 *           │            ▼
 *           ├──► 6. Redux `appendAiChunk` -> UI shows live typing text
 *           ├──► 7. Backend saves full answer -> emits "ai_done { chatId, message }"
 *           └──► 8. Redux `finalizeAiMessage` + `setLoading(false)`
 */
const useChat = () => {
    // Redux dispatch hook used to send actions and update global Redux state
    const dispatch = useDispatch()

    /**
     * Opens the WebSocket connection and wires its event handlers to `dispatch`.
     * Exposed to Dashboard so it can call `initializeSocketConnection()` on mount.
     */
    const initializeSocketConnection = () => {
        initSocket(dispatch)
    }

    /**
     * ------------------------------------------------------------------------
     * 1. handleSendMessage({ message, chatId })
     * ------------------------------------------------------------------------
     * PURPOSE:
     * - Handles sending a user prompt to the backend AI service with Optimistic UI updates.
     * 
     * WHERE IS IT CALLED?
     * - In `Dashboard.jsx` when the user submits from the Hero search box or bottom input bar.
     * 
     * PARAMETERS:
     * @param {Object} params
     * @param {string} params.message - The text prompt typed by the user (e.g., "What is React?")
     * @param {string|null} params.chatId - The MongoDB `_id` of active chat (e.g. "66a012bc..."), or null if starting fresh
     * 
     * SAMPLE INPUT DATA:
     * {
     *   message: "Explain recursion in JavaScript",
     *   chatId: "66a012bc394a8f10" // or null for new chat
     * }
     * 
     * SAMPLE BACKEND RESPONSE (stream mode):
     * {
     *   title: "JavaScript Recursion",
     *   newChat: { _id: "66a012bc394a8f10", title: "JavaScript Recursion", user: "66a00f12..." },
     *   userMessage: { _id: "m_001", role: "user", content: "Explain recursion...", chat: "66a012bc394a8f10" },
     *   chatId: "66a012bc394a8f10",
     *   stream: true     // means: the AI answer is streamed via Socket.IO
     * }
     * 
     * AFTER THE RESPONSE, THE AI ANSWER ARRIVES LIVE VIA SOCKETS:
     *   "ai_typing" { chatId, chunk: "Recursion " }  (repeated, word by word)
     *   "ai_done"   { chatId, message: { _id: "m_002", role:"ai", content:"Recursion is when..." } }
     */
    const handleSendMessage = async ({ message, chatId }) => {
        try {
            // Line: Set loading true in Redux so send buttons disable and AI loading pulse appears
            dispatch(setLoading(true))
            // Line: Reset any previous error state to null
            dispatch(setError(null))

            // Line: If chatId is null (new chat), use "temp" as temporary key in Redux
            const activeChatId = chatId || "temp"

            // Line: OPTIMISTIC UPDATE - Immediately push user message to Redux so it renders with 0ms delay
            dispatch(addNewMessage({
                chatId: activeChatId,
                message: {
                    role: "user",
                    content: message
                }
            }))

            // Line: If this is a fresh conversation, switch active view to "temp" so hero screen hides
            if (!chatId) {
                dispatch(setCurrentChatId("temp"))
            }

            // Line: Call HTTP API with `stream: true` — the backend ONLY creates
            // the chat + saves the user message, then returns instantly. This
            // avoids the long blocking call; the AI answer comes via WebSocket.
            const data = await sendMessage({ message, chatId, stream: true })

            // Determine the REAL chat id the AI stream belongs to
            let streamChatId = chatId

            // Line: If backend created a brand new chat session document
            if (data.newChat) {
                // Line: Register the new chat title and MongoDB _id in Redux sidebar list
                dispatch(createNewChat({
                    chatId: data.newChat._id,
                    title: data.title || data.newChat.title
                }))

                // Line: Replace temporary optimistic chat with the official saved user message
                dispatch(setMessages({
                    chatId: data.newChat._id,
                    messages: [data.userMessage]
                }))

                // Line: Switch active chat pointer from "temp" to real MongoDB _id
                dispatch(setCurrentChatId(data.newChat._id))

                // The AI stream will arrive under this new chat id
                streamChatId = data.newChat._id
            }

            // Line: Start the Socket.IO live stream for this chat.
            // Loading stays ON until the backend emits "ai_done" or "ai_error".
            const sent = askAi(streamChatId)
            if (!sent) {
                dispatch(setError("WebSocket not connected. Please refresh."))
                dispatch(setLoading(false))
            }
        } catch (err) {
            // Line: Log error in browser console and store error message in Redux for UI notification
            console.error("Failed to send message:", err)
            dispatch(setError(err?.response?.data?.error || err.message))
            // Line: Turn off loading since we won't get a socket event in this case
            dispatch(setLoading(false))
        }
        // NOTE: NO `finally { dispatch(setLoading(false)) }` here — loading must
        // stay true while the AI streams, and gets turned off by "ai_done"/"ai_error".
    }

    /**
     * ------------------------------------------------------------------------
     * 2. handleGetChats()
     * ------------------------------------------------------------------------
     * PURPOSE:
     * - Fetches all chat sessions created by the authenticated user to populate sidebar history.
     * 
     * WHERE IS IT CALLED?
     * - In `Dashboard.jsx` inside the initial `useEffect` hook when the component mounts.
     * 
     * WHERE DOES DATA COME FROM?
     * - Backend REST endpoint: `GET /api/chats` (via `getChats()` in `chat.api.js`).
     * 
     * SAMPLE BACKEND RESPONSE DATA:
     * {
     *   message: "Chats Fetched Successfully",
     *   chats: [
     *     { _id: "66a012bc394a8f10", title: "React Hooks Guide", user: "u1", updatedAt: "2026-08-19" },
     *     { _id: "66a099ef412b1234", title: "Node.js Architecture", user: "u1", updatedAt: "2026-08-18" }
     *   ]
     * }
     * 
     * SAMPLE REDUX DICTIONARY STORED:
     * {
     *   "66a012bc394a8f10": { _id: "66a012bc394a8f10", title: "React Hooks Guide", messages: [] },
     *   "66a099ef412b1234": { _id: "66a099ef412b1234", title: "Node.js Architecture", messages: [] }
     * }
     */
    const handleGetChats = async () => {
        try {
            // Line: Turn on loading spinner while initial chats list is fetched
            dispatch(setLoading(true))
            
            // Line: Execute Axios GET /api/chats request to backend
            const data = await getChats()
            // Line: Destructure chats array with safe fallback to empty array
            const { chats } = data || { chats: [] }

            // Line: Transform array into key-value map dictionary object for O(1) instant lookup by ID
            const chatsMap = (chats || []).reduce((acc, chat) => {
                acc[chat._id] = {
                    _id: chat._id,
                    title: chat.title,
                    messages: [],
                    updatedAt: chat.updatedAt
                }
                return acc
            }, {})

            // Line: Dispatch populated chats dictionary into Redux store
            dispatch(setChats(chatsMap))
        } catch (err) {
            // Line: Log error and update Redux error state
            console.error("Failed to fetch chats:", err)
            dispatch(setError(err?.response?.data?.error || err.message))
        } finally {
            // Line: Turn off loading spinner
            dispatch(setLoading(false))
        }
    }

    /**
     * ------------------------------------------------------------------------
     * 3. handleOpenChats(chatId)
     * ------------------------------------------------------------------------
     * PURPOSE:
     * - Loads conversation history when user clicks a specific chat thread from sidebar.
     * 
     * WHERE IS IT CALLED?
     * - In `Dashboard.jsx` when clicking any chat item button: `onClick={() => handleOpenChats(chat._id)}`.
     * 
     * WHERE DOES DATA COME FROM?
     * - Backend REST endpoint: `GET /api/chats/:chatId/messages` (via `getMessages(chatId)` in `chat.api.js`).
     * 
     * SAMPLE BACKEND RESPONSE DATA:
     * {
     *   message: "Messages Fetched Successfully",
     *   success: true,
     *   messages: [
     *     { _id: "msg_1", role: "user", content: "What is Redux?", chat: "66a012bc..." },
     *     { _id: "msg_2", role: "ai", content: "Redux is a state management library...", chat: "66a012bc..." }
     *   ]
     * }
     */
    /**
     * ------------------------------------------------------------------------
     * 3. handleOpenChats(chatId, chats)
     * ------------------------------------------------------------------------
     * PURPOSE:
     * - Loads conversation history when user clicks a specific chat thread from sidebar.
     * - Checks if messages are already loaded in memory to avoid duplicate API calls.
     * 
     * WHERE IS IT CALLED?
     * - In `Dashboard.jsx` when clicking any chat item button: `openChat(chat._id)`.
     * 
     * PARAMETERS:
     * @param {string} chatId - The ID of the selected chat
     * @param {Object} [chats] - The current chats object from Redux store
     */
    const handleOpenChats = async (chatId, chats) => {
        // Line: Set the selected chat as the active current chat in Redux
        dispatch(setCurrentChatId(chatId))

        // Line: If messages are already present in Redux store for this chat, skip database API call
        if (chats && chats[chatId]?.messages?.length > 0) {
            return
        }

        try {
            // Line: Show loading state while messages load from MongoDB
            dispatch(setLoading(true))

            // Line: Make Axios GET request to /api/chats/:chatId/messages with the route parameter
            const data = await getMessages(chatId)
            // Line: Safely extract messages array from response
            const { messages } = data || { messages: [] }

            // Line: Save fetched message list under the specific chat ID in Redux store
            dispatch(setMessages({
                chatId,
                messages: messages || []
            }))
        } catch (err) {
            // Line: Log error and dispatch error message to Redux
            console.error("Failed to fetch chat messages:", err)
            dispatch(setError(err?.response?.data?.error || err.message))
        } finally {
            // Line: Turn off loading state so messages stream displays
            dispatch(setLoading(false))
        }
    }

    // Expose controller methods to View components (Dashboard.jsx)
    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChats
    }
}

export default useChat