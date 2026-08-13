import React from 'react'
import {createBrowserRouter} from 'react-router-dom'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'

const routes = createBrowserRouter([
    {
        path: '/',
        element: <h1 className="text-lg">HOME PAGE</h1>
    },
    {
        path: '/register',
        element: <Register /> 
    },
    {
        path: '/login',
        element: <Login />
    },
]) 

export {routes}