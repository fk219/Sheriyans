import axios from "axios"

const api = axios.create({
    baseURL: "https://insta-clone-backend-n518.onrender.com/api/auth",
    withCredentails: true
})

export const register = async (username, email, password) => {
    try{
        const response = await axios.post('/register', {
            username, 
            email,
            password
        })

        return response.data
    }catch(err){
        throw err
    }
}


export const login = (username, email, password) => {
    try{
        const response = axios.post("/login", {
            username, 
            email,
            password
        })
    }catch(err){
        throw err
    }
}