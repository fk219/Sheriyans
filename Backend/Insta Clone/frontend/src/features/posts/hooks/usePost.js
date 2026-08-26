import {useContext} from 'react'

import {PostContext} from '../post.context.jsx'
import {createPost, getFeed, likePost, unLikePost} from '../services/post.api.js'

export const usePost = () => {
    
    const context = useContext(PostContext)
    const {loading, setLoading, feed, setFeed, post, setPost} = context

    const handleGetFeed = async () => {
        setLoading(true)
        try {
            const data = await getFeed()
            setFeed(data.posts.reverse()) //Sorting feed: latest post first
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


    const handleLike = async (postId) => {
        await likePost(postId)
        setFeed(feed.map(p => p._id === postId ? {...p, isLiked: true} : p))
    }

    const handleUnlike = async (postId) => {
        await unLikePost(postId)
        setFeed(feed.map(p => p._id === postId ? {...p, isLiked: false} : p))
    }


    return{
        loading, feed, post, handleGetFeed, handleCreatePost, handleLike, handleUnlike
    }

}