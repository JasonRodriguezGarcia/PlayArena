import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PlayArena from './components/PlayArena'

function App() {
  const [count, setCount] = useState(0)
//   const [count, setCount] = useState([])

  return (
    <>
        <PlayArena />
    </>
  )
}

export default App
