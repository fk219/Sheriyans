import React, {useEffect} from 'react'
import '../style/feed.scss'
import Post from '../components/Post'

import { usePost } from '../hooks/usePost'

const Feed = () => {

  const { feed, handleGetFeed, loading } = usePost()

  useEffect(()=>{
    handleGetFeed()
  }, []) 

  if(loading || !feed){
    return(
      <main>
        <h1>Feed is Loading!!</h1>
      </main>
    )
  }

  return (
    <main className='feed-page'>
      <div className="feed">
        <div className="posts">

        </div>
      </div>
    </main>
  )
}

export default Feed