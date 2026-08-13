import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { routes } from './app.routes'
import {store} from '../app/app.store'

const App = () => {
  return (
    <RouterProvider router={routes}/>
  )
}

export default App