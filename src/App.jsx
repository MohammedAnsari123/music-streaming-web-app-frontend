import { Link, Route, Routes } from 'react-router-dom'

import UserLogin from './pages/user/userLogin'
import UserSignUp from './pages/user/userSignUp'
import LandingPage from './pages/landingPage'
import UserMusicDashboard from './pages/user/userMusicDashboard'

import AdminLogin from './pages/admin/adminLogin'
import AdminDashboard from './pages/admin/adminDashboard'

import PrivateRoutes from './context/PrivateRoutes'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />}></Route>

        <Route path='/userLogin' element={<UserLogin />}></Route>
        <Route path='/userSignUp' element={<UserSignUp />}></Route>
        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<UserMusicDashboard />}></Route>
        </Route>

        <Route path='/adminLogin' element={<AdminLogin />}></Route>
        <Route element={<PrivateRoutes />}>
          <Route path='/adminDashboard' element={<AdminDashboard />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
