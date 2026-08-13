import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";
import { data } from "react-router-dom";


export const useAuth = () => {

    const dispatch = useDispatch()

    const handleRegister = async ({username, email, password}) => {
        try{
            dispatch(setLoading(true))
            const date = await register({username, email, password})
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Registeration failed!"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async ({email, password}) => {
        try{
            dispath(setLoading(true))
            const date = await login({email, password})
            dispatch(setUser(data.user))
        }catch(error){
            dispatch(setError(error.response?.data?.message || "Login Failed!"))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleGetMe = async () => {
        try{
            dispatch(setLoadin(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        }catch(error){
            dispatch(setError(error.response?.data?.messgae || "Failed Fetching User Data!"))
        }finally{
            dispatch(setLoading(false))
        }
    }

    return{
        handleRegister,
        handleLogin,
        handleGetMe
    }

}