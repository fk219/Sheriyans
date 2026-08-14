import React, {useEffect} from 'react'
import { RouterProvider } from 'react-router-dom'
import { routes } from './app.routes'
import {useAuth} from '../features/auth/hook/useAuth'


const App = () => {
  const {handleGetMe} = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])
  
  return (
    <RouterProvider router={routes}/>
  )
}

export default App