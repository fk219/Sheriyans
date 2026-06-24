import {createBrowserRouter} from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Feed from './features/posts/pages/Feed'


export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Feed />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
])