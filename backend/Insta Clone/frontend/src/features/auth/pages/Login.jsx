import React, {useState} from 'react'
import '../styles/form.scss'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth.js'

const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const {handleLogin, loading} = useAuth()

  if(loading){
    return <div>Loading...</div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
   
    handleLogin(username, password)
    .then(res => {
      console.log(res)
      navigate('/')
    })
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