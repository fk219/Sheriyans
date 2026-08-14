import React from 'react'
import {createBrowserRouter} from 'react-router-dom'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import Dashboard from '../features/chat/pages/Dashboard'
import Protected from '../features/auth/components/Protected'

const routes = createBrowserRouter([
    {
        path: '/',
        element: <Protected><Dashboard /></Protected>
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