import { useDispatch } from 'react-redux'
import { sendMessage } from '../service/chat.api'
import { initializeSocketConnection } from '../service/chat.socket'
import {
    createNewChat,
    addNewMessage,
    setCurrentChatId,
    setLoading,
    setError
} from '../chat.slice'

const useChat = () => {
    const dispatch = useDispatch()

    const handleSendMessage = async ({ message, chatId }) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            // 1. Call backend API
            const data = await sendMessage({ message, chatId })
            // data returned from backend: { title, newChat, userMessage, aiMessage }

            const activeChatId = chatId || (data.newChat && data.newChat._id)

            // 2. If it's a newly created chat, register it in redux
            if (data.newChat) {
                dispatch(createNewChat({
                    chatId: activeChatId,
                    title: data.title || data.newChat.title
                }))
                dispatch(setCurrentChatId(activeChatId))
            }

            // 3. Add user message to state
            if (data.userMessage) {
                dispatch(addNewMessage({
                    chatId: activeChatId,
                    message: data.userMessage
                }))
            }

            // 4. Add AI response to state
            if (data.aiMessage) {
                dispatch(addNewMessage({
                    chatId: activeChatId,
                    message: data.aiMessage
                }))
            }
        } catch (err) {
            console.error("Failed to send message:", err)
            dispatch(setError(err?.response?.data?.error || err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage
    }
}

export default useChat