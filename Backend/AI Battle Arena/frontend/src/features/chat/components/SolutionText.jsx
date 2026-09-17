import { useMemo } from "react"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"

const CODE_BLOCK_REGEX = /```(\w+)?\n([\s\S]*?)```/g

// Split a solution into text and code segments
const parseSolution = (text) => {
  const segments = []
  let lastIndex = 0
  let match

  while ((match = CODE_BLOCK_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) })
    }
    segments.push({
      type: "code",
      language: match[1] || "",
      content: match[2],
    })
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

export default SolutionText
