import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/Mainpage'
import NotFound from '../pages/NotFound'
import RegisterPage from '../pages/RegisterPage'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
])
