import { useState } from "react"

const mockChats = [
  {
    id: "chat-1",
    title: "Fetch data in React",
    messages: [
      { id: "msg-1-1", role: "user", content: "Give me a clean and readable function to do this" },
      {
        id: "msg-1-2",
        role: "battle",
        result: {
          solution_1: "```javascript\nasync function fetchUserData(userId) {\n  const response = await fetch(`/users/${userId}`)\n  return response.json()\n}\n```",
          solution_2: "```javascript\nconst fetchUserData = (userId) =>\n  fetch(`/users/${userId}`).then((response) => response.json())\n```",
          judge: {
            solution_1_score: 9,
            solution_2_score: 8,
            solution_1_feedback: "Clear and easy to read.",
            solution_2_feedback: "Short, but less explicit about errors.",
            winner: "solution_2",
          },
        },
      },
    ],
  },
  {
    id: "chat-2",
    title: "Is 17 a prime number?",
    messages: [{ id: "msg-2-1", role: "user", content: "Is 17 a prime number?" }],
  },
  {
    id: "chat-3",
    title: "Two-sum problem",
    messages: [{ id: "msg-3-1", role: "user", content: "Solve the two-sum problem efficiently" }],
  },
]

const sendBattleRequest = async ({ input }) => {
  await new Promise((resolve) => setTimeout(resolve, 1200)) // fake network delay

  // pick a random existing mock result just so the UI has something to show
  const sample = mockChats
    .flatMap((chat) => chat.messages)
    .find((msg) => msg.role === "battle" && msg.result)

  if (!sample) throw new Error("No mock result available")
  return { ...sample.result, problem: input }
}

const ChatPage = () => {
  // ----- 1. STATE ------------------------------------------------
  // All state lives here at the top. Nothing is duplicated in children.

  const [chats, setChats] = useState(mockChats)          // list shown in the sidebar
  const [activeChatId, setActiveChatId] = useState(mockChats[0]?.id ?? null)
  const [inputValue, setInputValue] = useState("")        // <- bound to the textarea
  const [loading, setLoading] = useState(false)           // true while waiting for the API

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null

  // ----- 2. HANDLERS -----------------------------------------------

  const selectChat = (id) => setActiveChatId(id)
  const startNewChat = () => setActiveChatId(null)

  const handleSend = async () => {
    const question = inputValue.trim()
    if (!question || loading) return

    const chatId = activeChatId ?? crypto.randomUUID()

    const userMessage = { id: crypto.randomUUID(), role: "user", content: question }
    const battleMessage = { id: crypto.randomUUID(), role: "battle", result: null, error: null }

    // If this is a brand-new chat, create it in the sidebar first.
    if (!activeChatId) {
      setChats((prev) => [{ id: chatId, title: question, messages: [] }, ...prev])
      setActiveChatId(chatId)
    }

    // Add the user's message + a "loading" placeholder for the battle result.
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, userMessage, battleMessage] }
          : chat
      )
    )

    setInputValue("") // clear the textarea (this is the "UI -> state -> UI" loop in action)
    setLoading(true)

    try {
      const result = await sendBattleRequest({ input: question })

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
  }

  const handleKeyDown = (e) => {
    // Enter sends, Shift+Enter makes a new line — standard chat-app behavior.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ----- 3. RENDER ---------------------------------------------------

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-900 text-zinc-100">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-none p-3">
          <h1 className="px-2 py-3 text-sm font-semibold tracking-tight text-zinc-100">AI Battle Arena</h1>

          <p className="mb-2 mt-6 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">Battles</p>

          {chats.length === 0 ? (
            <p className="px-2 text-xs text-zinc-700">No battles yet</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <button
                    onClick={() => selectChat(chat.id)}
                    className={`w-full truncate rounded-md px-3 py-2 text-left text-sm transition-colors ${
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
            onClick={startNewChat}
            disabled={loading}
            className="w-full rounded-md border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900 disabled:opacity-40"
          >
            + New Battle
          </button>
        </div>
      </aside>

      {/* ---------------- Main chat area ---------------- */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-zinc-900">
        {/* Messages */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-none px-4 py-8">
          {activeChat === null ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-600">
              <span className="text-3xl">⚔️</span>
              <p className="text-sm">Send a problem below to start a battle.</p>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
              {activeChat.messages.map((message) => {
                if (message.role === "user") {
                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-zinc-800 px-4 py-3 text-sm leading-6 text-zinc-100">
                        {message.content}
                      </div>
                    </div>
                  )
                }

                if (message.error) {
                  return (
                    <div key={message.id} className="rounded-xl border border-red-950 bg-red-950/30 p-4 text-sm text-red-300">
                      {message.error}
                    </div>
                  )
                }

                if (!message.result) {
                  return (
                    <div key={message.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
                      Models are battling...
                    </div>
                  )
                }

                const { solution_1, solution_2, judge } = message.result
                const solutions = [
                  { name: "Cohere", text: solution_1, score: judge.solution_1_score, isWinner: judge.winner === "solution_1" },
                  { name: "Groq", text: solution_2, score: judge.solution_2_score, isWinner: judge.winner === "solution_2" },
                ]
                const winnerLabel =
                  judge.winner === "solution_1" ? "Cohere wins" : judge.winner === "solution_2" ? "Groq wins" : "It's a tie"

                return (
                  <div key={message.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-5 py-4">
                      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Battle result</span>
                      <span className="text-xs font-medium text-amber-300">
                        {winnerLabel} — {judge.solution_1_score} vs {judge.solution_2_score}
                      </span>
                    </div>

                    <div className="grid min-w-0 gap-4 p-4 md:grid-cols-2">
                      {solutions.map(({ name, text, score, isWinner }) => {
                        const parts = []
                        const codeFence = /```(\w+)?\n([\s\S]*?)```/g
                        let lastIndex = 0
                        let match

                        while ((match = codeFence.exec(text)) !== null) {
                          if (match.index > lastIndex) {
                            parts.push({ type: "text", content: text.slice(lastIndex, match.index) })
                          }
                          parts.push({ type: "code", content: match[2] })
                          lastIndex = match.index + match[0].length
                        }
                        if (lastIndex < text.length) {
                          parts.push({ type: "text", content: text.slice(lastIndex) })
                        }

                        return (
                          <div
                            key={name}
                            className={`min-w-0 rounded-xl border p-4 ${
                              isWinner ? "border-zinc-600 bg-zinc-900" : "border-zinc-800 bg-zinc-950"
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-zinc-300">
                                {isWinner ? "🏆 " : ""}
                                {name}
                              </span>
                              <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-300">
                                {score}/10
                              </span>
                            </div>
                            <div className="space-y-2">
                              {parts.map((part, index) =>
                                part.type === "code" ? (
                                  <pre
                                    key={index}
                                    className="overflow-x-auto rounded-lg bg-zinc-900 p-3 font-mono text-xs leading-5 text-zinc-300"
                                  >
                                    {part.content}
                                  </pre>
                                ) : (
                                  <p key={index} className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-400">
                                    {part.content}
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ---------------- Input (two-way binding lives here) ---------------- */}
        <div className="shrink-0 bg-zinc-900 px-4 pb-5 pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 p-2 shadow-lg shadow-black/10"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type a problem to start the battle..."
              className="max-h-32 min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-zinc-100 placeholder-zinc-600 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="h-9 w-9 shrink-0 rounded-xl bg-zinc-100 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "…" : "Go"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export { ChatPage }