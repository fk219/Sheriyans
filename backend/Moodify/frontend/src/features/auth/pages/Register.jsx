import React from 'react'
import '../styles/register.scss'
import FormGroup from '../components/FormGroup'

const Register = () => {
  return (
    <main className='register-page'>
      <div className='form-container'>
        <h2>Create account</h2>
        <p>Register with email and password</p>
        <form>
          <FormGroup label='Name' placeholder='Enter your name' />
          <FormGroup label='Email' type='email' placeholder='Enter your email' />
          <FormGroup label='Password' type='password' placeholder='Create a password' />
          <button type='submit' className='button'>Register</button>
        </form>
        <p className='auth-footer'>Already have an account? <a href='/login'>Login</a></p>
      </div>
    </main>
  )
}

export default Register