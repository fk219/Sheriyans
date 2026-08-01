import { createContext, useState, useEffect } from 'react'
import { getMe as getMeApi } from './services/auth.api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await getMeApi()
                setUser(response.user || null)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        initAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}