import {createContext, useState, useEffect} from "react"
import {login, register, getMe} from "./services/auth.api"


export const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [loading , setLoading] = useState('')

    const handleLogin = async (email, password) => {
        
        setLoading(true)
        
        try{
            const response = await login(email, password)
            setUser(response.user)

        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    const handleRegister = async (email, username, password) => {
        setLoading(true)
        try{
            const response = await register(username, email, password)
            setUser(response.user)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }

    }

    return(
        <AuthContext.Provider value={{user, loading, handleLogin, handleRegister}}> 
            {children}
        </AuthContext.Provider>
    )
}