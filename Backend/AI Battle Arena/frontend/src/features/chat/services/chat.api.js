  import axios from 'axios';

  const api = axios.create({
    baseURL: "https://ai-battle-arena-4jxh.onrender.com/",
    withCredentials: true,
  })

  const startBattle = async (problem) => {
    const response = await api.post('/api/invoke', {
      problem: problem
    })

    return response.data
  }

export default startBattle
