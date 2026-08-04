import { Navigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'

const Protected = ({ children }) => {
  const { loading, user } = useAuth()

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (!loading && !user) {
    return <Navigate to="/login" />
  }

  return children
}

export default Protected
