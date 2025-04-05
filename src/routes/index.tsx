import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/Mainpage'
import RegisterPage from '../pages/RegisterPage'
import MainpageLogin from '../pages/MainpageLogin'
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
])
