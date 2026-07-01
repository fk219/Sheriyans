import {createBrowserRouter, Outlet} from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import CreatePost from './features/posts/pages/CreatePost'
import Feed from './features/posts/pages/Feed'
import Navbar from './features/shared/components/Navbar'

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
)

export const routes = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/', element: <Feed /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '/create-post', element: <CreatePost /> },
        ]
    }
])