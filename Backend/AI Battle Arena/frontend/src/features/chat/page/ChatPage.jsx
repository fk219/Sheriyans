import { useChat } from "../hook/useChat.js"
import ChatSidebar from "../components/ChatSidebar.jsx"
import ChatPanel from "../components/ChatPanel.jsx"

const ChatPage = () => {
  const { chats, activeChat, activeChatId, loading, newChat, selectChat, sendMessage } =
    useChat()

  return (
    <div className="flex h-full">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        loading={loading}
        onNewChat={newChat}
        onSelect={selectChat}
      />
      <ChatPanel chat={activeChat} loading={loading} onSend={sendMessage} />
    </div>
  )
}

export { ChatPage }
