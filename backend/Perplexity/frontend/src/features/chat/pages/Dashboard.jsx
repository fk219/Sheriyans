import React, {useEffect} from 'react'
import useChat from '../hook/useChat'
import { useSelector } from 'react-redux'


const Dashboard = () => {
  const {initializeSocketConnection} = useChat()

  const {user} = useSelector(state => state.auth || {})
    
  useEffect( () => {
    initializeSocketConnection()
  }, [])
    
  console.log(user)


  return (
    <div>Dashboard</div>
  )
}

export default Dashboard