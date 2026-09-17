import { useMemo, useState } from "react"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"
import { sendMessage } from "../services/chat.api.js"
import { mockChats } from "../mockData.js"

// ---------- tiny svg icon helper (keeps the UI icons in one spot) ----------
const Icon = ({ name, size = 18, className = "" }) => {
  const paths = {
    sword: <path d="m14.5 4.5 5 5M13 6l5 5m-7.5-3.5L4 14l-1 4 4-1 6.5-6.5M14 3l3-1 2 2-1 3" />,
    trophy: <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Zm0 2H3v2a4 4 0 0 0 4 4m10-6h4v2a4 4 0 0 1-4 4" />,
    plus: <path d="M12 5v14M5 12h14" />,
    send: <path d="m22 2-7 20-4-9-9-4Z M22 2 11 13" />,
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {paths[name]}
      </g>
    </svg>
  )
}

// ---------- solution text: renders plain text + highlighted code blocks ----------
const CODE_BLOCK_REGEX = /```(\w+)?\n([\s\S]*?)```/g

// Split a solution string into [{type:"text"|"code", ...}] segments
const parseSolution = (text) => {
  const segments = []
  let lastIndex = 0
  let match

  while ((match = CODE_BLOCK_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) })
    }
    segments.push({ type: "code", language: match[1] || "", content: match[2] })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) })
  }

  return segments
}

const CodeBlock = ({ content, language }) => {
  const highlighted = useMemo(() => {
    try {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(content, { language }).value
      }
      return hljs.highlightAuto(content).value
    } catch {
      return content
    }
  }, [content, language])

  return (
    <pre className="my-2 min-w-0 max-w-full overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <code
        className="hljs font-mono text-xs leading-relaxed"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  )
}

const SolutionText = ({ text }) => {
  const segments = useMemo(() => parseSolution(text), [text])

  return (
    <div>
      {segments.map((segment, index) =>
        segment.type === "code" ? (
          <CodeBlock key={index} content={segment.content} language={segment.language} />
        ) : (
          <p key={index} className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-400">
            {segment.content}
          </p>
        )
      )}
    </div>
  )
}

// ---------- messages ----------

// message the USER sent (right aligned bubble)
const UserMessage = ({ content }) => (
  <div className="flex min-w-0 justify-end">
    <div className="max-w-[80%] break-words rounded-xl rounded-br-sm bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100">
      {content}
    </div>
  </div>
)

const SolutionCard = ({ name, solution, score, feedback, isWinner, loading }) => (
  <div
    className={`min-w-0 flex-1 rounded-xl border p-4 ${
      isWinner ? "border-zinc-500 bg-zinc-900" : "border-zinc-800 bg-zinc-900/50"
    }`}
  >
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isWinner && <Icon name="trophy" size={15} className="text-amber-300" />}
        <span className="text-sm font-medium text-zinc-300">{name}</span>
      </div>
      <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-300">
        {loading ? "–" : `${score}/10`}
      </span>
    </div>

    {loading ? (
      <p className="font-mono text-xs text-zinc-500">Generating...</p>
    ) : (
      <SolutionText text={solution} />
    )}

    {!loading && feedback && (
      <div className="mt-4 border-t border-zinc-800 pt-3">
        <span className="text-[10px] uppercase tracking-widest text-zinc-600">
          Gemini feedback
        </span>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{feedback}</p>
      </div>
    )}
  </div>
)

// the battle card: loading spinner, error, or the two solutions + judge verdict
const BattleMessage = ({ result, error }) => {
  if (error) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-red-400">
        {error}
      </div>
    )
  }
  if (!result) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-500">
        <span className="flex items-center gap-2"><Icon name="sword" size={16} className="animate-pulse" /> Models are battling...</span>
      </div>
    )
  }

  const { solution_1, solution_2, judge } = result

  // model display names + winner banner text
  const WINNER_LABELS = {
    solution_1: "Cohere wins",
    solution_2: "Groq wins",
    tie: "It's a tie",
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
        <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500">
          <Icon name="sword" size={14} /> Battle Result
        </span>
        <span className="rounded-md bg-amber-950/60 px-2.5 py-1 text-xs font-medium text-amber-300">
          {WINNER_LABELS[judge.winner] || "It's a tie"} — {judge.solution_1_score} vs{" "}
          {judge.solution_2_score}
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-3 p-4 md:flex-row">
        <SolutionCard
          name="Cohere"
          solution={solution_1}
          score={judge.solution_1_score}
          feedback={judge.solution_1_feedback}
          isWinner={judge.winner === "solution_1"}
        />
        <SolutionCard
          name="Groq"
          solution={solution_2}
          score={judge.solution_2_score}
          feedback={judge.solution_2_feedback}
          isWinner={judge.winner === "solution_2"}
        />
      </div>
    </div>
  )
}

// ---------- one single component owns the state now, data flows top -> bottom ----------

const ChatPage = () => {
  // ===== 1. STATE (everything lives here, nothing in child components) =====

  // every chat looks like: { id, title, messages: [...], }
  // every message looks like:
  //   { id, role: "user",   content }              -> what the user typed
  //   { id, role: "battle", result | error }       -> what the models + judge replied
  const [chats, setChats] = useState(mockChats) // sidebar list (mock data for now)
  const [activeChatId, setActiveChatId] = useState(mockChats[0]?.id ?? null) // selected chat
  const [loading, setLoading] = useState(false) // true while the models are battling
  const [inputValue, setInputValue] = useState("") // text in the input box (two-way bound)

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null

  // ===== 2. EVENT HANDLERS =====

  // open an existing chat from the sidebar
  const selectChat = (id) => setActiveChatId(id)

  // start a new (empty) chat
  const newChat = () => setActiveChatId(null)

  const handleSend = async () => {
    const problem = inputValue.trim()
    if (!problem || loading) return

    const chatId = activeChatId || crypto.randomUUID()

    // the "user" message goes in immediately, the "battle" message is an
    // empty placeholder that shows "Models are battling..." until the API answers
    const userMessage = { id: crypto.randomUUID(), role: "user", content: problem }
    const battleMessage = { id: crypto.randomUUID(), role: "battle", result: null }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, userMessage, battleMessage] }
          : chat
      )
    )
    if (!activeChatId) {
      // new chat: create it in the sidebar with the title from the first message
      setChats((prev) => [{ id: chatId, title: problem, messages: [] }, ...prev])
    }

    // two-way binding: clear the input after sending
    setInputValue("")
    setLoading(true)

    // ===== 3. FLOW: user input -> backend API -> state update -> re-render =====

    try {
      // backend runs the graph: 2 models answer in parallel, judge scores both
      const result = await sendMessage({ input: problem })

      // fill the placeholder battle message with the real result
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
      // show the error card for the placeholder message
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

  // ===== 4. RENDER (UI = pure jsx, no state inside children) =====
  return (
    <div className="flex h-full">
      {/* ---- sidebar: project name + all chats + new battle + profile ---- */}
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
                    onClick={() => selectChat(chat.id)}
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
            onClick={newChat}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-40"
          >
            <Icon name="plus" size={16} /> New Battle
          </button>
          {/* profile placeholder (real data comes with auth + mongo later) */}
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

      {/* ---- main chat area ---- */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {/* messages list */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {activeChat === null ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-600">
              <span className="text-4xl">⚔️</span>
              <span className="text-lg font-medium">AI Battle Arena</span>
              <span className="text-sm">Two models compete. A judge decides. Send a problem to begin.</span>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
              {activeChat.messages.map((message) =>
                message.role === "user" ? (
                  <UserMessage key={message.id} content={message.content} />
                ) : (
                  <BattleMessage key={message.id} result={message.result} error={message.error} />
                )
              )}
            </div>
          )}
        </div>

        {/* input box: value + onChange = two-way binding */}
        <div className="w-full px-4 pb-4">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-end gap-2 border-t border-zinc-800 p-4"
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={1}
                placeholder="Type a problem to start the battle..."
                className="min-w-0 max-h-32 flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-zinc-600"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                aria-label="Start battle"
                title="Start battle"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="send" size={17} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ChatPage }
