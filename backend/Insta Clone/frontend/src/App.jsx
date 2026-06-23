import {RouterProvider} from "react-router-dom"
import {routes} from "./app.routes"
import { AuthProvider } from "./features/auth/auth.context"
import "./features/shared/global.scss"

function App() {

  return (
    <>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </>
  )
}

export default App
