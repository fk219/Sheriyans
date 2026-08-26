import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import '../styles/login.scss'
import FormGroup from '../components/FormGroup'
import {useAuth} from '../hook/useAuth'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const {loading, handleLogin} = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const reponse = await handleLogin({email, password})
    navigate('/')
  }


  return (
    <main className='login-page'>
      <div className='form-container'>
        <h2>Welcome Back</h2>
        <p>Login to continue</p>
        <form onSubmit={handleSubmit}>
          <FormGroup 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            label='Email' 
            type='email' 
            placeholder='Enter your email' 
          />
          <FormGroup 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            label='Password' 
            type='password' 
            placeholder='Enter your password' 
          />
          <button type='submit' className='button'>Login</button>
        </form>
        <p className='auth-footer'>Don't have an account? <Link to='/register'>Register</Link></p>
      </div>
    </main>
  )
}

export default Login