import React, { Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import PrivateRoutes from './context/PrivateRoutes'
import { AudioPlayerProvider } from './context/AudioPlayerContext'
import AudioPlayer from './components/AudioPlayer'
import ErrorBoundary from './components/ErrorBoundary'

// Pages (Lazy Loaded)
const UserLogin = React.lazy(() => import('./pages/user/userLogin'));
const UserSignUp = React.lazy(() => import('./pages/user/userSignUp'));
const LandingPage = React.lazy(() => import('./pages/landingPage'));
const UserMusicDashboard = React.lazy(() => import('./pages/user/userMusicDashboard'));
const UserSearch = React.lazy(() => import('./pages/user/UserSearch'));
const LikedSongs = React.lazy(() => import('./pages/user/LikedSongs'));
const Podcasts = React.lazy(() => import('./pages/user/Podcasts'));
const PodcastDetail = React.lazy(() => import('./pages/user/PodcastDetail'));
const Playlists = React.lazy(() => import('./pages/user/Playlists'));
const PlaylistDetail = React.lazy(() => import('./pages/user/PlaylistDetail'));

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AudioPlayerProvider>
        <div className="relative min-h-screen bg-black">
          <Suspense fallback={<LoadingSpinner />}>
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
            </Routes>
          </Suspense>

          {/* Global Persistence Player */}
          <AudioPlayer />
        </div>
      </AudioPlayerProvider>
    </ErrorBoundary>
  )
}

export default App
