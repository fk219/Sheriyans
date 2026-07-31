import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'

const Protected = ({ children }) => {
  const { loading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [loading, user, navigate])

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (!user) {
    return null
  }

  return children
}

export default Protected