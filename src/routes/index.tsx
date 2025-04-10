import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/Mainpage'
import RegisterPage from '../pages/RegisterPage'
import MainpageLogin from '../pages/MainpageLogin'
import ParkingMap from '../pages/ParkingMap'
import Chat from '../pages/ChatList'
import ChatRoom from '../pages/ChatRoom'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/mainpage',
    element: <MainpageLogin />,
  },
  {
    path: '/map',
    element: <ParkingMap />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/chat/room/:id',
    element: <ChatRoom />,
  }
])
