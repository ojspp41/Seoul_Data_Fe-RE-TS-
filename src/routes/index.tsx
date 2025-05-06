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
import ReviewWritePage from '../pages/ReviewWritePage'
import FestivalAllPage from '../pages/FestivalAllPage'
import MyPage from '../pages/MyPage'
import EditProfilePage from '../pages/EditProfilePage'
import PopularPage from '../pages/PopularPage'
import AIRecommendPage from '../pages/AIRecommendPage'
import ScrapEventsPage from '../pages/ScrapEventsPage'
import MyReviewPage from '../pages/MyReviewPage'
import TermsPage from '../pages/TermsPage'
import BackgroundLayout from '../Layout/BackgroundLayout'
import CustomerSupportPage from '../pages/CustomerSupportPage'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <BackgroundLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/chat', element: <Chat /> },
      { path: '/chat/create-group', element: <CreateGroupChat /> },
      
      { path: '/profile', element: <EditProfilePage /> },
      { path: '/popular', element: <PopularPage /> },
      { path: '/scrap', element: <ScrapEventsPage /> },
      { path: '/term', element: <TermsPage /> },
      {
        path: '/support',
        element: <CustomerSupportPage />,
      }
      
    ],
    
  },
  { path: '/mypage', element: <MyPage /> },
  { path: '/myreview', element: <MyReviewPage /> },
  { path: '/fest/detail', element: <FestivalDetail /> },
  { path: '/mainpage', element: <MainpageLogin /> },
  { path: '/fest/all', element: <FestivalAllPage /> },
  { path: '/ai', element: <AIRecommendPage /> },
  { path: '/login-success', element: <AuthRedirect /> },
  { path: '/fest/detail/review', element: <ReviewPage /> },
  { path: '/fest/detail/review/write', element: <ReviewWritePage /> },
  { path: '/map', element: <ParkingMap /> },
  { path: '/chat/room/:roomId', element: <ChatRoom /> },
])