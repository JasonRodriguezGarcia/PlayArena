import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// Añadir appbar en MUI

function MainPage() {

    const navigate = useNavigate()

  return (
    <>
        <h1>Main Page</h1>

        <button onClick={()=> navigate('/game')}>Ir a Game</button>
    </>
  )
}

export default MainPage