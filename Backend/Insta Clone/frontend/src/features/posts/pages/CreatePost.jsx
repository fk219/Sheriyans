import React, {useState, useRef} from 'react'
import {usePost} from '../hooks/usePost.js'
import {useNavigate} from 'react-router-dom'

import '../style/createPost.scss'

const CreatePost = () => {
  const [caption, setCaption] = useState("")
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)
  const {loading, handleCreatePost} = usePost()
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const hanleSubmit = async (e) => {
    e.preventDefault()
    const file = fileInputRef.current.files[0]
    await handleCreatePost(file, caption)
    navigate('/')
  }

  return (
    <main className="create-post-page">
      <div className="create-card">
        <h2>New Post</h2>

        <form onSubmit={hanleSubmit}>
          <div
            className={`upload-area ${preview ? 'has-preview' : ''}`}
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="preview" />
            ) : (
              <div className="placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                <span>Select a photo</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>

          <input
            type="text"
            className="caption-input"
            placeholder="Write a caption..."
            value={caption}
            onChange={e => setCaption(e.target.value)}
          />

          <button
            type="submit"
            className="share-btn"
            disabled={!preview || loading}
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default CreatePost