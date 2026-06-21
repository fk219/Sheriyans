import {React, useState} from 'react'
import { Link } from 'react-router-dom'
import '../styles/form.scss'
import axios from 'axios'

// https://insta-clone-backend-n518.onrender.com/

const Register = () => {
  
  const [username, setUsername]= useState('')
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

  }

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input
                  onInput={(e) => setEmail(e.target.value)}
                  type="email" 
                  name="email" 
                  placeholder='Email'
                />
                <input
                  onInput={(e) => setUsername(e.target.value)} 
                  type="text" 
                  name="username" 
                  placeholder='Username'
                />
                <input 
                  onInput={(e) => setPassword(e.target.value)}
                  type="password" 
                  name="password" 
                  placeholder='Password'
                />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link className="toggleAuthForm" to="/login">Login</Link></p>
        </div>
    </main>
  )
}

export default Register