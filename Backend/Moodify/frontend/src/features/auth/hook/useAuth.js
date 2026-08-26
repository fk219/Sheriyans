import { useContext, useEffect } from 'react'
import { login as loginApi, register as registerApi, getMe as getMeApi, logOut as logOutApi } from '../services/auth.api'
import { AuthContext } from '../auth.context'

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext)

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        const response = await registerApi({ username, email, password })
        setUser(response.user)
        setLoading(false)
    }

    const handleLogin = async ({ username, email, password }) => {
        setLoading(true)
        const response = await loginApi({ username, email, password })
        setUser(response.user)
        setLoading(false)
    }

    const handleGetMe = async () => {
        setLoading(true)
        const response = await getMeApi()
        setUser(response.user)
        setLoading(false)
    }

    const handleLogOut = async () => {
        setLoading(true)
        await logOutApi()
        setUser(null)
        setLoading(false)
    }

    useEffect(()=>{
        handleGetMe()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleGetMe, handleLogOut }
}
