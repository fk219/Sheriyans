import React from 'react'
import { initializeSocketConnection } from '../service/chat.socket'
import {useDispatch} from 'react-redux'
import {setChat, setCurrentChatId, setLoading, setError} from ''


const useChat = () => {
    const dispatch = useDispatch()

    const handleSendMessage = async ({}) => {
      try{
        dispatch(setLoading(true))
        dispatch(setChat)
      }catch(error){

      }finally{
        dispatch(setLoading(false))
      }
    }


    return {
        initializeSocketConnection
  }
}

export default useChat