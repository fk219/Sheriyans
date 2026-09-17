import UserMessage from "./UserMessage.jsx"
import BattleMessage from "./BattleMessage.jsx"
import ChatInput from "./ChatInput.jsx"
import Icon from "./Icon.jsx"

const ChatPanel = ({ chat, loading, onSend }) => (
  <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
    <div className="min-w-0 flex-1 overflow-y-auto px-4 py-6">
      {chat === null ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-zinc-600">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-300 shadow-lg shadow-black/20">
            <Icon name="sword" size={28} />
          </span>
          <span className="text-lg font-semibold text-zinc-300">AI Battle Arena</span>
          <span className="max-w-md text-sm leading-relaxed">Two models compete. A judge decides. Send a problem to begin.</span>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          {chat.messages.map((message) =>
            message.role === "user" ? (
              <UserMessage key={message.id} content={message.content} />
            ) : (
              <BattleMessage key={message.id} result={message.result} error={message.error} />
            )
          )}
        </div>
      )}
    </div>
    <div className="w-full px-4 pb-4">
      <div className="mx-auto max-w-4xl">
        <ChatInput onSend={onSend} disabled={loading} />
      </div>
    </div>
  </div>
)

export default ChatPanel
