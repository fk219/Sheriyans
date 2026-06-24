import {createContext, useState} from 'react'

export const PostContext = createContext()


export const PostContextProvider = ({children}) => {
    const [loading, setLoading] = useState()
    const [post, setPost] = useState()
    const [feed, setFeed] = useState()

    return(
        <PostContext.Provider value={{loading, setLoading, post, setPost, feed, setFeed}}>
            {children}
        </PostContext.Provider>
    )

    
 }