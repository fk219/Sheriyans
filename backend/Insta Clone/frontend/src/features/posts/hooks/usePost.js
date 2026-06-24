import {getFeed} from '../services/post.api.js'
import {useContext} from 'react'
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

    return{
        loading, feed, post, handleGetFeed
    }


}