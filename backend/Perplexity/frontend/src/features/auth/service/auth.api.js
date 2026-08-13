import axios from 'axios'

const api = axios.create({
    baseUrl: "https://perplexity-clone-7nda.onrender.com",
    withCredentials: true
})

export const register = async ({email, username, password}) => {
    const response = await api.post('/api/auth/register', {username, email, password})
    return response.data
} 

export const login = async ({email, password}) => {
    const response = await api.post('/api/auth/login', {email, password})
    return response.data
}

export const getMe = async () => {
    const response = await api.get('/api/post/get-me')
    return response.data
} 