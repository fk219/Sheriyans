import axios from "axios"

const api = axios.create({
  baseURL: "https://ai-battle-arena-4jxh.onrender.com",
  withCredentials: true,
})

const sendMessage = ({ input }) => {
  // backend expects { problem } in the body
  const response = api.post('/api/arena', {
    problem: input
  })

  return response.data
}

export { sendMessage }
