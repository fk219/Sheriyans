import {createSlice} from '@reduxjs/toolkit'
import { setError, setLoading } from '../auth/auth.slice'

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        loading: false,
        error: null
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const {setChats, setCurrentChatId, setLoading, setError} = chatSlice.actions
export default chatSlice.reducer

// chats = {
//     "Chat Title": {
//         messages: [
//             {
//                 role: "user",
//                 content: "What is your name?"
//             },
//             {
//                 role: "ai",
//                 content: "My name is Kodey!"
//             },
//         ],
//         id: "Chat Id",
//         lastUpated: "Last Updated Date"
//     }
// }