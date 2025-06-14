import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PlayArena from './components/PlayArena'
// import Test from './components/test'
// import Test2 from './components/Test2'

function App() {
  const [count, setCount] = useState(0)
//   const [count, setCount] = useState([])

  return (
    <>
        <PlayArena />
        {/* <Test /> */}
        {/* <Test2 /> */}
    </>
  )
}

export default App
