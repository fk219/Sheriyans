import axios from 'axios'

const api = axios.create({
    baseURL: "https://moodify-backend-8rn5.onrender.com/",
    withCredentials: true
})

export const getSong = async ({ mood }) => {
    const response = await api.get('/api/song?mood=' + mood)
    return response.data
}

