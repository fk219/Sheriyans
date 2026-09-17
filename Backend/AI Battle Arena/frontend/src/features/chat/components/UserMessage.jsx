const UserMessage = ({ content }) => (
  <div className="flex min-w-0 justify-end">
    <div className="max-w-[80%] break-words rounded-xl rounded-br-sm bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100">
      {content}
    </div>
  </div>
)

export default UserMessage
