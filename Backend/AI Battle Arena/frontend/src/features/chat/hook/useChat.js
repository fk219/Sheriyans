import { useCallback, useState } from "react"
import { sendToArena } from "../services/chat.api.js"
import { mockChats } from "../mockData.js"

export const useChat = () => {
  const [chats, setChats] = useState(mockChats)
  const [activeChatId, setActiveChatId] = useState(mockChats[0]?.id ?? null)
  const [loading, setLoading] = useState(false)

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null

  const newChat = useCallback(() => {
    setActiveChatId(null)
  }, [])

  const selectChat = useCallback((id) => {
    setActiveChatId(id)
  }, [])

  const sendMessage = useCallback(
    async (problem) => {
      const trimmed = problem.trim()
      if (!trimmed || loading) return

      setLoading(true)

      const userMessage = { id: crypto.randomUUID(), role: "user", content: trimmed }

      let chatId = activeChatId
      if (!chatId) {
        chatId = crypto.randomUUID()
        setActiveChatId(chatId)
        setChats((prev) => [{ id: chatId, title: trimmed, messages: [] }, ...prev])
      }

      const battleMessage = { id: crypto.randomUUID(), role: "battle", result: null }
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, userMessage, battleMessage] }
            : chat
        )
      )

      try {
        const result = await sendToArena(trimmed)
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === battleMessage.id ? { ...msg, result } : msg
                  ),
                }
              : chat
          )
        )
      } catch (error) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === battleMessage.id ? { ...msg, error: error.message } : msg
                  ),
                }
              : chat
          )
        )
      } finally {
        setLoading(false)
      }
    },
    [activeChatId, loading]
  )

  return { chats, activeChat, activeChatId, loading, newChat, selectChat, sendMessage }
}
