import {React, useState} from 'react'
import { Link } from 'react-router-dom'
import '../styles/form.scss'
import axios from 'axios'

const Register = () => {
  
  const [username, setUsername]= useState('')
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    axios.post('http://localhost:5000/api/auth/register', {
      username,
      email,
      password
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input
                  onInput={(e) => setEmail(e.target.value)}
                  type="email" 
                  name="email" placeholder='Email' 
                  value={email}
                />
                <input
                  onInput={(e) => setUsername(e.target.value)} 
                  type="text" 
                  name="username" placeholder='Username' 
                  value={username}
                />
                <input 
                  onInput={(e) => setPassword(e.target.value)}
                  type="password" 
                  name="password" placeholder='Password' 
                  value={password}
                />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link className="toggleAuthForm" to="/login">Login</Link></p>
        </div>
    </main>
  )
}

export default Register