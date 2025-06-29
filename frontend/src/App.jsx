import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlayArenaPage from './pages/PlayArenaPage'
import MainPage from './pages/MainPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import LoginContext from './context/LoginContext';

function App() {
    const [logged, setLogged] = useState(false);
    const [userNick, setUserNick] = useState('')
  return (
    <>
    <LoginContext.Provider value={{logged, setLogged, userNick, setUserNick}} >
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/games" element={<PlayArenaPage />} />      
                <Route path="/signup" element={<SignUpPage />} />      
                <Route path="/login" element={<LoginPage />} />      
            </Routes>
        </BrowserRouter>
    </LoginContext.Provider>
    </>
  )
}

export default App
