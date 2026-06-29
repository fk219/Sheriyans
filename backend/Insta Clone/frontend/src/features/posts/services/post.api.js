import axios from 'axios';

const api = axios.create({
    baseURL: "https://insta-clone-backend-n518.onrender.com/api/posts",
    withCredentials: true
})

export const getFeed = async () => {
    const response = await api.get('/feed')
    return response.data
}

export const createPost = async (imageFile, caption) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('caption', caption)

    const response = await api.post('/', formData)
    return response.data
}      