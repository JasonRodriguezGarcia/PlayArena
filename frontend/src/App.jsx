import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlayArenaPage from './pages/PlayArenaPage'
import MainPage from './pages/MainPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
// import Test from './components/test'
// import Test2 from './components/Test2'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        {/* <PlayArena /> */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/game" element={<PlayArenaPage />} />      
        <Route path="/signup" element={<SignUpPage />} />      
        <Route path="/login" element={<LoginPage />} />      
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
