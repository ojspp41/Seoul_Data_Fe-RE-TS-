import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/Mainpage'
import RegisterPage from '../pages/RegisterPage'
import MainpageLogin from '../pages/MainpageLogin'
import ParkingMap from '../pages/ParkingMap'
import Chat from '../pages/ChatList'
import ChatRoom from '../pages/ChatRoom'
import CreateGroupChat from '../pages/CreateGroupChat'
import AuthRedirect from '../pages/AuthRedirect'
import FestivalDetail from '../pages/FestivalDetail'
import ReviewPage from '../components/ReviewPage'
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
  },
  {
    path: '/chat/create-group',
    element: <CreateGroupChat />,
  },
  {
    path: '/login-success',
    element: <AuthRedirect />,
  },
  
  {
    path: '/fest/detail',
    element: <FestivalDetail />,
  },
  {
    path: '/fest/detail/review',
    element: <ReviewPage />,
  },
  
])
