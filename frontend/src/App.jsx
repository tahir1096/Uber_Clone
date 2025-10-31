import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignUp from './pages/UserSignUp.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import BookRide from './pages/BookRide.jsx'
import RideHistory from './pages/RideHistory.jsx'
import Support from './pages/Support.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignUp from './pages/CaptainSignUp.jsx'
import CaptainDashboard from './pages/CaptainDashboard.jsx'
import RideTracking from './pages/RideTracking.jsx'
import { UserProvider } from './context/UserContext'
import { CaptainProvider } from './context/CaptainContext'
import { SupabaseAuthProvider } from './context/SupabaseAuthContext'

const App = () => {
  return (
    <SupabaseAuthProvider>
      <UserProvider>
        <CaptainProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignUp />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/book-ride" element={<BookRide />} />
            <Route path="/ride-history" element={<RideHistory />} />
            <Route path="/support" element={<Support />} />
            <Route path="/captain-login" element={<CaptainLogin />} />
            <Route path="/captain-signup" element={<CaptainSignUp />} />
            <Route path="/captain-dashboard" element={<CaptainDashboard />} />
            <Route path="/ride-tracking" element={<RideTracking />} />
          </Routes>
        </CaptainProvider>
      </UserProvider>
    </SupabaseAuthProvider>
  )
}

export default App