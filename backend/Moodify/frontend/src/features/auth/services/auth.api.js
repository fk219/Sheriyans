import axios from 'axios'

const baseURL = "https://moodify-backend-8rn5.onrender.com/api/auth"

const api = axios.create({
    baseURL,
    withCredentials: true
})

export const register = async ({ username, email, password }) => {
    const response = await api.post('/register', {
        email, username, password
    })

    return response.data
}

export const login = async ({ username, email, password }) => {
    const response = await api.post('/login', {
        username, email, password
    })
    return response.data
}

export const getMe = async () => {
    const response = await api.get('/get-me')

    return response.data
}

export const logOut = async () => {
    const response = await api.get('/logout')

    return response.data
}