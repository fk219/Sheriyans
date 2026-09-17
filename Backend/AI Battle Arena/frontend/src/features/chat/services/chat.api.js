export const sendToArena = async (problem) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/arena`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem }),
  })

  if (!res.ok) {
    throw new Error("Battle failed. Please try again.")
  }

  return res.json()
}
