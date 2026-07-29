import {login, register, getMe, logOut} from '../services/auth.api'
import { AuthContext } from '../auth.context'

import { useContext } from 'react'


export const useAuth = () => {
    const context = useContext(AuthContext)
    const {login, register, getMe, logOut} = context

    const handleRegister = async ({username, email, password}) => {
        setLoading(true)
        const response = await register({username, email, password})
        setUser(response.user)
        setLoading(false)
    }

    const handleLogin = async ({username, email, password}) => {
        setLoading(true)
        const respone = await login({username, email, password})
        setUser(response.user)
        setLoading(false)
    }

    const handleGetMe = async () => {
        setLoading(true)
        const response = await getMe()
        setUser(response.user)
        setLoading(false)
    }

    const handleLogOut = async () => {
        setLoading(true)
        const response = await logOut()
        setUser(null)
        setLoading(false)
    }

    reutrn(
        {user, loading, handleRegister, handleLogin, handleGetMe, handleLogOut}
    )
}