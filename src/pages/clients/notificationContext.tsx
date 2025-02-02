import { createContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const NotificationContext = createContext({})
export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const socket = io('http://localhost:3001')

  useEffect(() => {
    console.log('aqui')
    socket.on('statusUpdated', (data) => {
      console.log('Notificação recebida:', data)
      setNotifications((prevNotifications) => [...prevNotifications, data])
    })

    return () => {
      socket.disconnect()
    }
  }, [socket, notifications])

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  )
}
export default NotificationContext
