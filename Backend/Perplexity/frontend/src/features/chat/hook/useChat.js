import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { streamMessage, getChats, getMessages } from '../service/chat.api'

import {
    createNewChat,
    addNewMessage,
    setMessages,
    setChats,
    setCurrentChatId,
    setLoading,
    setError,
    appendAiChunk,
    finalizeAiMessage
} from '../chat.slice'

const useChat = () => {
    const dispatch = useDispatch()

    const handleSendMessage = async ({ message, chatId }) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const activeChatId = chatId || "temp"
            dispatch(addNewMessage({
                chatId: activeChatId,
                message: { role: "user", content: message }
            }))

            if (!chatId) dispatch(setCurrentChatId("temp"))

            await streamMessage({
                message,
                chatId,
                onEvent: (event) => {
                    if (event.type === 'start' && event.newChat) {
                        dispatch(createNewChat({
                            chatId: event.newChat._id,
                            title: event.title || event.newChat.title
                        }))
                        dispatch(setMessages({
                            chatId: event.newChat._id,
                            messages: [event.userMessage]
                        }))
                        dispatch(setCurrentChatId(event.newChat._id))
                    }

                    if (event.type === 'chunk') {
                        dispatch(appendAiChunk({
                            chatId: event.chatId || chatId,
                            chunk: event.chunk
                        }))
                    }

                    if (event.type === 'done') {
                        dispatch(finalizeAiMessage({
                            chatId: event.message.chat,
                            message: event.message
                        }))
                        dispatch(setLoading(false))
                    }

                    if (event.type === 'error') {
                        dispatch(setError(event.error || 'AI streaming failed'))
                        dispatch(setLoading(false))
                    }
                }
            })
        } catch (error) {
            console.error("Failed to send message:", error)
            dispatch(setError(error?.response?.data?.error || error.message))
            dispatch(setLoading(false))
        }
    }

    const handleGetChats = useCallback(async () => {
        try {
            dispatch(setLoading(true))
            const data = await getChats()
            const chatsMap = (data?.chats || []).reduce((acc, chat) => {
                acc[chat._id] = {
                    _id: chat._id,
                    title: chat.title,
                    messages: [],
                    updatedAt: chat.updatedAt
                }
                return acc
            }, {})
            dispatch(setChats(chatsMap))
        } catch (error) {
            console.error("Failed to fetch chats:", error)
            dispatch(setError(error?.response?.data?.error || error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    const handleOpenChats = async (chatId, chats) => {
        dispatch(setCurrentChatId(chatId))
        if (chats && chats[chatId]?.messages?.length > 0) return

        try {
            dispatch(setLoading(true))
            const data = await getMessages(chatId)
            dispatch(setMessages({
                chatId,
                messages: data?.messages || []
            }))
        } catch (error) {
            console.error("Failed to fetch chat messages:", error)
            dispatch(setError(error?.response?.data?.error || error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { handleSendMessage, handleGetChats, handleOpenChats }
}

export default useChat