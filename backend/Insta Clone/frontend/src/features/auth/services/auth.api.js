import axios from "axios";

const api = axios.create({
    baseURL: "https://insta-clone-backend-n518.onrender.com/api/auth",
    withCredentials: true
})


export const login = async (username, password) => {

        const response = await api.post('/login', {
            username,
            password
        })
        return response.data

}

export const register = async (email, username, password) => {

        const response = await api.post("/register", {
            email,
            username,
            password
        })
        return response.data

}

export const getMe = async () => {

    const response = await api.get('/get-me')

    return response.data
    
}