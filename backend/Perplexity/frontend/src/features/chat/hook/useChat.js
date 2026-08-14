import React from 'react'
import { initializeSocketConnection } from '../service/chat.socket'


const useChat = () => {
  return {
    initializeSocketConnection
  }
}

export default useChat