import  {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (sate, action) => {
            state.user = action.loading
        },
        setError: (state, action) => {
            state.user = action.loading
        }
    }
})

export const {setUser, setLoading, setError} = authSlice.actions
export default authSlice.reducer