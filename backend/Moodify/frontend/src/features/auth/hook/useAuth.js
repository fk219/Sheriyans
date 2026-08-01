import { useContext } from 'react'
import { login as loginApi, register as registerApi, getMe as getMeApi, logOut as logOutApi } from '../services/auth.api'
import { AuthContext } from '../auth.context'

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext)

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const response = await registerApi({ username, email, password })
            setUser(response.user)
            return response
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const response = await loginApi({ username, email, password })
            setUser(response.user)
            return response
        } finally {
            setLoading(false)
        }
    }

    const handleGetMe = async () => {
        setLoading(true)
        try {
            const response = await getMeApi()
            setUser(response.user || null)
            return response
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const handleLogOut = async () => {
        setLoading(true)
        try {
            await logOutApi()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleRegister, handleLogin, handleGetMe, handleLogOut }
}