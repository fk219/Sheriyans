import {RouterProvider} from "react-router-dom"
import {routes} from "./app.routes"
import "./features/shared/global.scss"

import { AuthProvider } from "./features/auth/auth.context"
import { PostContextProvider } from "./features/posts/post.context"

function App() {

  return (
    <>
      <AuthProvider>
        <PostContextProvider>
          <RouterProvider router={routes} />
        </PostContextProvider>
      </AuthProvider>
    </>
  )
}

export default App
