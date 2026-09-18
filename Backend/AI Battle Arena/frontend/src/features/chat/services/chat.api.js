import { useState } from "react"

// ----- MOCK DATA -----------------------------------------------------
// Normally this would live in its own file (mockData.js) and get
// imported. It's inlined here so this file has zero outside dependencies
// besides React itself — everything you need to read is in one place.

const mockChats = [
  {
    id: "chat-1",
    title: "Fetch data in React",
    messages: [
      {
        id: "msg-1-1",
        role: "user",
        content: "Give me a clean and readable function to do this",
      },
      {
        id: "msg-1-2",
        role: "battle",
        result: {
          problem: "Write a function to fetch data from an API",
          solution_1: `Here's a simple approach using synchronous logic:

\`\`\`javascript
async function fetchUserData(userId) {
  const response = await fetch("https://api.example.com/users/" + userId);
  const data = await response.text();

  let user;
  try {
    user = JSON.parse(data);
  } catch (err) {
    throw new Error("Invalid JSON response");
  }

  if (!response.ok) {
    return { success: false, status: response.status, user: null };
  }

  const { id, name, email } = user;

  if (id !== userId) {
    console.log("The id in the data does not match the id requested");
  }

  return { success: true, status: response.status, user: { id, name, email } };
}
\`\`\`

This keeps everything explicit: it validates the response, parses safely, and returns a consistent shape.`,
          solution_2: `Here's a clean, modern approach:

\`\`\`javascript
async function fetchUserData(userId) {
  const res = await fetch("https://api.example.com/users/" + userId);
  if (!res.ok) throw new Error("Request failed with status " + res.status);

  const user = await res.json();
  return { id: user.id, name: user.name, email: user.email };
}
\`\`\`

Uses \`res.json()\` so no manual parsing, throws early on failures, and returns only the fields you need.`,
          judge: {
            solution_1_score: 6,
            solution_2_score: 9,
            solution_1_feedback:
              "Solution 1 is verbose but reasonably safe. There is odd manual JSON parsing when res.json() exists, an id match check that is only logged rather than handled, and string concatenation instead of URL params. The logic works, but it is not clean and readable as asked.",
            solution_2_feedback:
              "Solution 2 is concise, handles errors early, avoids manual parsing, and returns only the fields needed. Fully meets the 'clean and readable' requirement.",
            winner: "solution_2",
          },
        },
      },
    ],
  },
  {
    id: "chat-2",
    title: "Is 17 a prime number?",
    messages: [
      { id: "msg-2-1", role: "user", content: "Is 17 a prime number?" },
      {
        id: "msg-2-2",
        role: "battle",
        result: {
          problem: "Is 17 a prime number?",
          solution_1:
            "17 is prime. Its only divisors are 1 and 17; checking numbers 2 through 4 (up to the square root of 17 ≈ 4.12) shows none divide it evenly.",
          solution_2:
            "Yes, 17 is a prime number. A prime number has exactly two factors. For 17, testing division by 2, 3, and 4 (since 4² = 16 < 17 < 25 = 5²) yields no clean divisions, so it has no factors besides 1 and itself.",
          judge: {
            solution_1_score: 9,
            solution_2_score: 9,
            solution_1_feedback:
              "Concise, correct, and mentions the square-root checking strategy, which is exactly how primality should be checked.",
            solution_2_feedback:
              "Also correct and explains how primality is verified. Slightly more wordy with the same depth of explanation.",
            winner: "tie",
          },
        },
      },
    ],
  },
  {
    id: "chat-3",
    title: "Two-sum problem",
    messages: [
      { id: "msg-3-1", role: "user", content: "Solve the two-sum problem efficiently" },
      {
        id: "msg-3-2",
        role: "battle",
        error: "Battle failed. Please try again.",
      },
    ],
  },
]

/**
 * AI Battle Arena — Chat Page
 * ----------------------------------------------------
 * Beginner notes (two-way binding, the core idea):
 *
 * "Two-way binding" just means: the <textarea> shows whatever is in
 * `inputValue`, AND typing in the textarea updates `inputValue`.
 *
 *   value={inputValue}                 -> state -> UI   (1st direction)
 *   onChange={e => setInputValue(...)} -> UI -> state   (2nd direction)
 *
 * Every input in this file (the textarea) follows that exact pattern.
 * Once you're comfortable with this one, the same pattern works for
 * any form field: checkboxes, selects, other text inputs, etc.
 *
 * NOTE: `sendBattleRequest` below is a placeholder that fakes a delay
 * and returns a random mock result, so the UI is fully clickable
 * without your real service file. Swap its body for a call to your
 * own chat.api.js once it's ready — the shape it must resolve to is
 * shown in mockData.js (`{ problem, solution_1, solution_2, judge }`).
 */

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
    <div className="flex h-full bg-zinc-950 text-zinc-200">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-800">
        <div className="flex-1 overflow-y-auto p-3">
          <h1 className="px-2 py-2 text-sm font-semibold text-zinc-100">AI Battle Arena</h1>

          <p className="mb-2 mt-3 px-2 text-xs text-zinc-600">Battles</p>

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
            onClick={startNewChat}
            disabled={loading}
            className="w-full rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-40"
          >
            + New Battle
          </button>
        </div>
      </aside>

      {/* ---------------- Main chat area ---------------- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {activeChat === null ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-600">
              <span className="text-3xl">⚔️</span>
              <p className="text-sm">Send a problem below to start a battle.</p>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
              {activeChat.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>

        {/* ---------------- Input (two-way binding lives here) ---------------- */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-end gap-2 border-t border-zinc-800 p-4"
        >
          <textarea
            value={inputValue}                              // state -> UI
            onChange={(e) => setInputValue(e.target.value)}  // UI -> state
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a problem to start the battle..."
            className="max-h-32 flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="h-11 w-11 shrink-0 rounded-xl bg-zinc-100 text-sm font-medium text-zinc-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "…" : "Go"}
          </button>
        </form>
      </div>
    </div>
  )
}

/**
 * A single message bubble. Pulled out into its own component so
 * ChatPage stays readable — this component receives data via props
 * only, it holds no state of its own.
 */
const ChatMessage = ({ message }) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-xl rounded-br-sm bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100">
          {message.content}
        </div>
      </div>
    )
  }

  if (message.error) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-red-400">
        {message.error}
      </div>
    )
  }

  if (!message.result) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-500">
        Models are battling…
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
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <span className="text-xs text-zinc-500">Battle Result</span>
        <span className="rounded-md bg-amber-950/60 px-2.5 py-1 text-xs font-medium text-amber-300">
          {winnerLabel} — {judge.solution_1_score} vs {judge.solution_2_score}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4 md:flex-row">
        {solutions.map(({ name, text, score, isWinner }) => (
          <div
            key={name}
            className={`flex-1 rounded-xl border p-4 ${
              isWinner ? "border-zinc-500 bg-zinc-900" : "border-zinc-800 bg-zinc-900/50"
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
            <SolutionText text={text} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Splits a solution string on ```code``` fences and renders each part
 * appropriately — plain prose as text, fenced blocks in a <pre>.
 * No syntax-highlighting library on purpose, so it's easy to follow:
 * this is just a regex + array of pieces to render.
 */
const CODE_FENCE = /```(\w+)?\n([\s\S]*?)```/g

const SolutionText = ({ text }) => {
  const parts = []
  let lastIndex = 0
  let match

  while ((match = CODE_FENCE.exec(text)) !== null) {
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
    <div className="space-y-2">
      {parts.map((part, i) =>
        part.type === "code" ? (
          <pre
            key={i}
            className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs text-zinc-300"
          >
            {part.content}
          </pre>
        ) : (
          <p key={i} className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-400">
            {part.content}
          </p>
        )
      )}
    </div>
  )
}

export { ChatPage }