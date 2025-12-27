import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import PrivateRoutes from './context/PrivateRoutes'
import { AudioPlayerProvider } from './context/AudioPlayerContext'
import AudioPlayer from './components/AudioPlayer'
import ErrorBoundary from './components/ErrorBoundary'

// Pages
import UserLogin from './pages/user/userLogin'
import UserSignUp from './pages/user/userSignUp'
import LandingPage from './pages/landingPage'
import UserMusicDashboard from './pages/user/userMusicDashboard'
import UserSearch from './pages/user/UserSearch'
import LikedSongs from './pages/user/LikedSongs'
import Podcasts from './pages/user/Podcasts'
import PodcastDetail from './pages/user/PodcastDetail'
import Playlists from './pages/user/Playlists'
import PlaylistDetail from './pages/user/PlaylistDetail'

// Admin Pages
import AdminLogin from './pages/admin/adminLogin'
import AdminDashboard from './pages/admin/adminDashboard'
import UploadTrack from './pages/admin/UploadTrack'
import UploadPodcast from './pages/admin/UploadPodcast'
import UploadEpisode from './pages/admin/UploadEpisode'
import AdminLibrary from './pages/admin/AdminLibrary'
import AdminUsers from './pages/admin/AdminUsers'

function App() {
  return (
    <ErrorBoundary>
      <AudioPlayerProvider>
        <div className="relative min-h-screen bg-black">
          <Routes>
            <Route path='/' element={<LandingPage />}></Route>

            <Route path='/user/login' element={<UserLogin />}></Route>
            <Route path='/user/signup' element={<UserSignUp />}></Route>
            <Route element={<PrivateRoutes />}>
              <Route path='/user/dashboard' element={<UserMusicDashboard />}></Route>
              <Route path='/user/search' element={<UserSearch />}></Route>
              <Route path='/user/podcasts' element={<Podcasts />}></Route>
              <Route path='/user/podcast/:id' element={<PodcastDetail />}></Route>
              <Route path='/user/library' element={<Playlists />}></Route>
              <Route path='/user/playlist/:id' element={<PlaylistDetail />}></Route>
              <Route path='/user/liked' element={<LikedSongs />}></Route>
            </Route>

            <Route path='/admin/login' element={<AdminLogin />}></Route>
            <Route element={<PrivateRoutes />}>
              <Route path='/admin/dashboard' element={<AdminDashboard />}></Route>
              <Route path='/admin/upload' element={<UploadTrack />}></Route>
              <Route path='/admin/upload-podcast' element={<UploadPodcast />}></Route>
              <Route path='/admin/upload-episode' element={<UploadEpisode />}></Route>
              <Route path='/admin/library' element={<AdminLibrary />}></Route>
              <Route path='/admin/users' element={<AdminUsers />}></Route>
            </Route>
          </Routes>

          {/* Global Persistence Player */}
          <AudioPlayer />
        </div>
      </AudioPlayerProvider>
    </ErrorBoundary>
  )
}

export default App
