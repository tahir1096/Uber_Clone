import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignUp from './pages/UserSignUp.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignUp from './pages/CaptainSignUp.jsx'
import CaptainDashboard from './pages/CaptainDashboard.jsx'
import { UserProvider } from './context/UserContext'
import { CaptainProvider } from './context/CaptainContext'

const App = () => {
  return (
    <UserProvider>
      <CaptainProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/captain-signup" element={<CaptainSignUp />} />
          <Route path="/captain-dashboard" element={<CaptainDashboard />} />
        </Routes>
      </CaptainProvider>
    </UserProvider>
  )
}

export default App