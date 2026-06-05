import React from 'react'

const Login = () => {
  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form action="">
                <input type="text" name="username" placeholder='Username' />
                <input type="password" name="password" placeholder='Password' />
                <button type="submit">Login</button>
            </form>
        </div>
    </main>
  )
}

export default Login