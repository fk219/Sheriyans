import { useState } from "react"
import Icon from "./Icon.jsx"

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState("")

  const submit = (e) => {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value)
    setValue("")
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2 border-t border-zinc-800 p-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            submit(e)
          }
        }}
        rows={1}
        placeholder="Type a problem to start the battle..."
        className="min-w-0 max-h-32 flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-zinc-600"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Start battle"
        title="Start battle"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="send" size={17} />
      </button>
    </form>
  )
}

export default ChatInput
