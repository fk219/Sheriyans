import {useContext} from 'react'

import {createPost, getFeed} from '../services/post.api.js'
import {PostContext} from '../post.context.jsx'

export const usePost = () => {
    
    const context = useContext(PostContext)
    const {loading, setLoading, feed, setFeed, post, setPost} = context

    const handleGetFeed = async () => {
        setLoading(true)
        try {
            const data = await getFeed()
            setFeed(data.posts)
        } catch (err) {
            console.error("Failed to load feed:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)
        try {
            const data = await createPost(imageFile, caption)
            setFeed([data.post, ...feed])
        } catch (err) {
            console.error("Failed to create post:", err)
        } finally {
            setLoading(false)
        }
    }

    return{
        loading, feed, post, handleGetFeed, handleCreatePost
    }


}