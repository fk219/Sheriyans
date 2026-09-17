import Icon from "./Icon.jsx"

const ChatSidebar = ({ chats, activeChatId, loading, onNewChat, onSelect }) => (
  <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/50">
    <div className="flex-1 overflow-y-auto p-3">
      <h1 className="flex items-center gap-2 px-2 py-2 text-sm font-semibold tracking-wide text-zinc-100">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
          <Icon name="sword" size={15} />
        </span>
        AI Battle Arena
      </h1>
      <div className="mb-2 mt-3 px-2 text-[10px] uppercase tracking-widest text-zinc-600">
        Battles
      </div>
      {chats.length === 0 ? (
        <p className="px-2 text-xs text-zinc-700">No battles yet</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => onSelect(chat.id)}
                className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm ${
                  chat.id === activeChatId
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50"
                }`}
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="border-t border-zinc-800 p-3">
      <button
        onClick={onNewChat}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-40"
      >
        <Icon name="plus" size={16} /> New Battle
      </button>
      <div className="mt-3 flex items-center gap-2 px-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-zinc-200">
          G
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-zinc-200">Guest User</p>
          <p className="text-[10px] text-zinc-600">Free plan</p>
        </div>
      </div>
    </div>
  </aside>
)

export default ChatSidebar
