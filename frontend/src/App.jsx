import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlayArena from './pages/PlayArena'
import MainPage from './pages/MainPage';
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
        <Route path="/game" element={<PlayArena />} />      
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
