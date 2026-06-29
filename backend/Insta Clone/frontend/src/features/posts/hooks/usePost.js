import {useContext} from 'react'

import {createPost, getFeed} from '../services/post.api.js'
import {PostContext} from '../post.context.jsx'

export const usePost = () => {
    
    const context = useContext(PostContext)
    const {loading, setLoading, feed, setFeed, post, setPost} = context

    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts)
        setLoading(false)
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)
        const data = await createPost(imageFile, caption)
        setFeed([data.post, ...feed])
        setLoading(false)

    }

    return{
        loading, feed, post, handleGetFeed, handleCreatePost
    }


}