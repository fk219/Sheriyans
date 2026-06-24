import axios from 'axios';

const api = axios.create({
    baseURL: "https://insta-clone-backend-n518.onrender.com/api/posts",
    withCredentials: true
})

export const getFeed = async () => {
    const response = await api.get('/feed')
    
    return response.data
}