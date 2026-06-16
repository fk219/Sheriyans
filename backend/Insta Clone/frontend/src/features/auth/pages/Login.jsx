import React, {useState} from 'react'
import '../styles/form.scss'
import { Link } from 'react-router-dom'
import axios from 'axios'

// https://insta-clone-backend-n518.onrender.com/

const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    axios.post('https://insta-clone-backend-n518.onrender.com/api/auth/login', {
      username,
      password
    }, {
      credentials: true
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }
  
  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  name="username" 
                  placeholder='Username'
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                  type="password" 
                  name="password" 
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link className="toggleAuthForm" to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login