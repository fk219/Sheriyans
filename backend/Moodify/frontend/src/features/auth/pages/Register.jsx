import React, {useState} from 'react'
import '../styles/register.scss'
import FormGroup from '../components/FormGroup'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'


const Register = () => {
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const {loading, handleRegister} = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await handleRegister({username, email, password})
    navigate('/')
  }

  return (
    <main className='register-page'>
      <div className='form-container'>
        <h2>Create account</h2>
        <p>Register with email and password</p>
        <form onSubmit={handleSubmit}>
          <FormGroup
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label='Username' 
            placeholder='Enter a Username' 
          />
          <FormGroup
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            label='Email' 
            type='email' 
            placeholder='Enter your email' 
          />
          <FormGroup
            value={password}
            onChange={e => setPassword(e.target.value)} 
            label='Password' 
            type='password' 
            placeholder='Create a password' 
          />
          <button type='submit' className='button'>Register</button>
        </form>
        <p className='auth-footer'>Already have an account? <a href='/login'>Login</a></p>
      </div>
    </main>
  )
}

export default Register