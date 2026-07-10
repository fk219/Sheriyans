import React from 'react'
import '../styles/login.scss'

import FormGroup from '../components/FormGroup'

const Login = () => {
  return (
    <main className='login-page'>
      <div className='form-container'>
        <h2>Welcome Back</h2>
        <p>Login to continue</p>
        <form>
          <FormGroup label='Email' type='email' placeholder='Enter your email' />
          <FormGroup label='Password' type='password' placeholder='Enter your password' />
          <button type='submit' className='button'>Login</button>
        </form>
        <p className='auth-footer'>Don't have an account? <a href='/register'>Register</a></p>
      </div>
    </main>
  )
}

export default Login