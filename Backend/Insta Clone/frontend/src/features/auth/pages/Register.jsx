import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import '../style/form.scss'
import {useAuth} from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const navigate = useNavigate()
  
  const {user, loading, handleRegister} = useAuth()
  
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault()

    await handleRegister(email, username, password);

    navigate('/')  
  }

  if(loading){
    return(
      <main>
        <h1>Loading...</h1>
      </main>
    )
  }
  
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => setEmail(e.target.value)} 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Enter Email Address"
            />
          <input
            onInput={(e) => setUsername(e.target.value)} 
            type="text" 
            name="username" 
            id="username" 
            placeholder="Enter Username"
            />
          <input
            onInput={(e) => {setPassword(e.target.value)}} 
            type="password" 
            name="password"
            id="password"
            placeholder='Enter Password'
          />
          <button className='button primary-button'>Register</button>
        </form>
        <p>Already have an account ? <Link to={"/login"}>Login to Account.</Link></p>
      </div>
    </main>
  )
}

export default Register
