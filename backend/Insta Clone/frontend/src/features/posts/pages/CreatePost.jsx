import React, {useState, useRef} from 'react'
import {usePost} from '../hooks/usePost.js'
import {useNavigate} from 'react-router-dom' 

import '../style/createPost.scss'


const CreatePost = () => {
  
  const [caption, setCaption] = useState("")
  const postImageInputFieldRef = useRef(null)
  const {loading, handleCreatePost} = usePost()
  const navigate = useNavigate()

  const hanleSubmit = async (e) => {
    e.preventDefault()
    const file = postImageInputFieldRef.current.files[0]
    await handleCreatePost(file, caption)
    navigate('/')
  }

  if(loading){
    return(
      <main>Creating Post...</main>
    )
  }

  return (
    <main className="create-post-page">
      <div className="form-container">
        <h1>Create Post</h1>
        <form onSubmit={hanleSubmit}>
          <label 
            htmlFor="postImage" 
            className='post-image-label'>Select Image</label>
          <input
            hidden 
            type="file" 
            name="postImage" 
            id="postImage"
            ref={postImageInputFieldRef} 
            />
            <input 
              type="text" 
              id="caption"
              name="caption" 
              placeholder='Enter Caption'
              value={caption}
              onChange={e => setCaption(e.target.value)}
            />
            <button className="button primary-button" >Create Post!</button>
        </form>
      </div>
    </main>
  )
}

export default CreatePost