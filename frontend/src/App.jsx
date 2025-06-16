import React, { useEffect } from 'react'
import NavBar from './components/NavBar.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import Profile from './pages/Profile.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore.js'

function App() {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme])
  
  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className="w-10 h-10 animate-spin"/>
      </div>
    );
  }
  return (
    <div data-theme = {theme}>
      <NavBar/>
      <Routes>
        <Route path="/" element={authUser ? <Home/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser ? <SignUp/> : <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/"/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ?<Profile/>: <Navigate to="/login"/>}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
