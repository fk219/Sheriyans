import axios from axios

const baseURL = "https://scaling-waddle-q5v7p6gvxj73wrx-3000.app.github.dev/api/auth"

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

export const register = async ({username, email, password}) => {
    const response = await api.post('/register', {
        email, username, password
    })

    return response.data
}

export const login = async ({username, email, password}) => {
    const reposnse = await api.post('/login', {
        username, email, password
    })
    return response.data
}

export const getMe = async () => {
    const reposnse = await api.get('/get-me')

    return resposne.data
}

export const logOut = async  () => {
    const reponse = await api.get('/logout')
    
    return response.date
}