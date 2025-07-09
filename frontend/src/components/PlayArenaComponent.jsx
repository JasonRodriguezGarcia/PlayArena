import { useState, useEffect } from "react";
import {createContext, useContext} from 'react';
import LoginContext from '../context/LoginContext';
import { useNavigate , Link } from 'react-router-dom';
import {
    Box,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Grid,
    Paper,
    Input,
    
} from '@mui/material';
import { io } from 'socket.io-client';
const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
// const socket = io('http://localhost:5000'); // Connect once
// const socket = io('https://playarena-lyi6.onrender.com'); // Connect once
const socket = io(`${VITE_BACKEND_URL_RENDER}`); // Connect once

// const nicks = ["Pepe", "Manuel", "Lola", "Maria"]
const salas = ['Sala 1', 'Sala 2', 'Sala 3']
const juegos = ['3 en raya', 'Conecta 4', 'Hundir la flota']
const jugadores = ['Jugador vs computer', 'Jugador 1 vs Jugador 2']

const PlayArenaComponent = () => {
    const navigate = useNavigate()
    const [variables, setVariables] = useState([
        {
            element: "Config Column",
            backgroundcolor: "#f5f5f5"
        }, 
        {
            element: "Board Column",
            backgroundcolor: "##339fff",
            cellBackgroundcolor: "#e6f4ff",
            opacity: 0.3
        }  
    ])
// Tonos más oscuros similares a #e6f4ff:
// Nombre	Hex	Descripción
// Ligero	#cce8ff	Un poco más oscuro
// Medio	#99d1ff	Azul cielo claro
// Oscuro	#66baff	Azul moderado, más notorio
// Más oscuro	#339fff	Azul brillante pero más intenso
// Muy oscuro	#007acc	Azul profundo, aún legible

    const [board, setBoard] = useState(
        Array.from({ length: 3 }, () => (
            Array.from({ length: 3 }, () => ({ cellContent: {mark: '', color: ''}, disabled: false }))
        ))
    );
    const [sala, setSala] = useState(salas[0])
    const [juego, setJuego] = useState(juegos[0])
    const [jugador, setJugador] = useState(jugadores[0])
    const [textoInicio, setTextoInicio] = useState(['Comenzar !!', 'Cancelar !!'])
    const [textoComenzar, setTextoComenzar] = useState(textoInicio[0])
    const [panelDisabled, setPanelDisabled] = useState(true)
    const [mensajeTurno, setMensajeTurno] = useState(['Su turno','Turno otro Jugador', ''])
    const [turno, setTurno] = useState(2)
    const [playerMark, setPlayerMark] = useState({})
    const [endGame, setEndGame] = useState(false)
    const [endGameMessage, setEndGameMessage] = useState('')
    const [gameRunning, setGameRunning] = useState(false)
    const [waitPlayerMessage, setWaitPlayerMessage] = useState(['', 'Esperando otro jugador ...'])
    const [waiting, setWaiting] = useState(false)
    const [connected, setConnected] = useState(true);
    // const [nick, setNick] = useState(nicks[0])
    const {logged, setLogged, userNick, setUserNick} = useContext(LoginContext)

    useEffect(()=> {
        if (!logged)
            navigate("/")
    }, [])

    useEffect(() => {
        const handleConnect = () => {
            // console.log('Connected to socket');
            // setConnected(true);
            // socket.emit('joinRoom', sala);
        }
        
        const handleStartGame = (msg) => {
            // aborting game if new player already in room (repeated player)
            if (msg.abortGame) {
                setTextoComenzar(textoInicio[0])
                setEndGameMessage('JUGADOR YA EN SALA !!')
                setTimeout(() => {
                    setEndGameMessage('')
                }, 5000);
                return
            }
            console.log('Connected to socket');
            setConnected(true);
            socket.emit('joinRoom', sala);

            console.log("imprimo msg: ", msg)
            const nuevoWaiting = msg.waiting ? msg.waiting : false
            setTextoComenzar(textoInicio[1]) 
            setWaiting(nuevoWaiting)
            if (msg.startGame == true) {
                setGameRunning(true)
                setEndGame(false)
            } else {
                return
            }
            // if (msg.players[0] == nick) {
            if (msg.players[0].nick == userNick) {
                setPlayerMark({mark: "X", color: "green"})
                setTurno(0)
                setPanelDisabled(false)
            } else {
                setPlayerMark({mark: "O", color: "red"})
                setTurno(1)
                setPanelDisabled(true)
            }
    }
    
    const handlePlayerMovement = (msg) => {
        const playerMark = msg.repliedMessage.mark
        const { row, col } = traductorCelda(msg.repliedMessage.cell)
        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => row.map(cell => ({ ...cell })));
            newBoard[row][col] = {
                cellContent: playerMark,
                // queda el color
                disabled: true
            }
            const theEndGame = checkEndGame(newBoard, playerMark.mark)
            if (theEndGame) {
                debugger
                // setEndGameMessage(`Ganador Jugador ${playerMark.mark}`)
                setEndGameMessage(`Ganador Jugador ${playerMark.mark}`)
                setEndGame(true)
                setPanelDisabled(true)
                setTextoComenzar(textoInicio[0])
                setGameRunning(false)
                setTimeout(()=> {
                    setEndGameMessage('')
                    handleReiniciarSala()
                }, 5000)

            }
            return newBoard
        })
        // Ahora ajustamos turno y panel
        if (msg.repliedMessage.playedTurn === 1 && userNick === msg.nick) {
            // si ya jugó en su turno y era el turno 1
            setTurno(0)
            setPanelDisabled(true)
        } else if (msg.repliedMessage.playedTurn === 0 && userNick === msg.nick) {
            // si ya jugo en su turno y era el turno 0
            setTurno(1)
            setPanelDisabled(true)
        } else {
            setTurno(msg.repliedMessage.playedTurn)
            setPanelDisabled(false) // te toca
        }
    }

    const handleClearRoom = () => {
        console.log('Clearing Room');
        setBoard(
            Array.from({ length: 3 }, () => (
                Array.from({ length: 3 }, () => ({ cellContent: {mark: '', color: ''}, disabled: false }))
            ))
        )
        setEndGame(true)
        setGameRunning(false)
        setPlayerMark({})

        setPanelDisabled(true)
        setWaiting(false)
        setTextoComenzar(textoInicio[0])
    }

    const handleDisconnect = () => {
        console.log('Disconnected from socket')
        setConnected(false);
    }
    socket.on('connect', handleConnect)
    socket.on('startGame', handleStartGame)
    socket.on('playerMovement', handlePlayerMovement)
    socket.on('clearRoom', handleClearRoom)
    socket.on('disconnect', handleDisconnect)
    
    return () => {
        socket.off('connect')
        socket.off('joinRoom')
        socket.off('startGame')
        socket.off('disconnect')
        socket.off('playerMovement')
    }
}, [userNick, sala]);

    const handleComenzar = () => {
        socket.emit('startGame', {
            room: sala,
            nick: userNick
        })
        // si esta en comenzar
        if(textoComenzar === textoInicio[0]) { 
            setTextoComenzar(textoInicio[1])
        }
        else {
            setTextoComenzar(textoInicio[0])
            handleReiniciarSala()
        }
    }

    const sendChatRoom = (cell) => {
        socket.emit('playerMovement', {
            room: sala,
            message: cell,
            turn: turno,
            nick: userNick,
            timestamp: new Date()

        }) // can pass in more data here
    }

    const handleCellClick = (cell) => {
        if (panelDisabled)
            return
        sendChatRoom(cell)
    }
    
    const handleReiniciarSala = () => {
        socket.emit('clearRoom', { room: sala })
    }

    const traductorCelda = (celda) => {
        // Convertimos índice plano a 2D [row, col]
        const row = Math.floor(celda / 3)
        const col = celda % 3
        return { row, col }
    }
    
    const salasSelect =  salas.map((sala, index) => (
        <MenuItem key={index} value={sala}>{sala}</MenuItem>
    ))
    const juegosSelect =  juegos.map((juegos, index) => (
        <MenuItem key={index} value={juegos}>{juegos}</MenuItem>
    ))
    const jugadoresSelect =  jugadores.map((jugadores, index) => (
        <MenuItem key={index} value={jugadores}>{jugadores}</MenuItem>
    ))
    
    // const nicksSelect = nicks.map((nick, index) => (
    //     <MenuItem key={index} value={nick}>{nick}</MenuItem>
    // ))
    
    const handleChangeSalas = (e) => {
        setSala(e.target.value)
    }
    const handleChangeJuegos = (e) => {   
        setJuego(e.target.value)
    }

    const handleChangeJugadores = (e) => {
        setJugador(e.target.value)

    }

    // const handleChangeNicks = (e) => {
    //     setNick(e.target.value)
    //     console.log("nick: ", e.target.value)
    // }

    const checkEndGame = (boardToCheck, turnoTocheck) => {
        for (let index = 0; index < boardToCheck.length; index++) {
            // horizontal check
            if (boardToCheck[index][0].cellContent.mark == turnoTocheck && boardToCheck[index][1].cellContent.mark== turnoTocheck && boardToCheck[index][2].cellContent.mark== turnoTocheck) {
                return true
            }
            // vertical check
            if (boardToCheck[0][index].cellContent.mark== turnoTocheck && boardToCheck[1][index].cellContent.mark== turnoTocheck && boardToCheck[2][index].cellContent.mark== turnoTocheck)
                return true
        }
        // diagonal1 check
            if (boardToCheck[0][0].cellContent.mark== turnoTocheck && boardToCheck[1][1].cellContent.mark== turnoTocheck && boardToCheck[2][2].cellContent.mark== turnoTocheck)
                return true
        // diagonal2 check
            if (boardToCheck[2][0].cellContent.mark== turnoTocheck && boardToCheck[1][1].cellContent.mark== turnoTocheck && boardToCheck[0][2].cellContent.mark== turnoTocheck)
                return true
        return false
    }

    
    return (
        <>
        {/* <Box sx={{display: 'grid', height: '100vh', gridTemplateColumns: 'minmax(250px, 2fr) 10fr', gap: "30px", */}
        <Box sx={{display: 'grid', height: '100vh', gridTemplateColumns: 'minmax(250px, 2fr) 10fr', gap: "30px",
            userSelect: "none"
        }}>
            {/* Config column */}
            <Box sx={{ width: "100%", padding: 2, backgroundColor: variables[0].backgroundcolor }}>
                <Typography variant="h5" color="primary" gutterBottom>
                    Configuración
                </Typography>
                <FormControl variant= "outlined" fullWidth sx={{ mb: 2, backgroundColor: "#ffffff"}}>
                    <InputLabel id="labelSalas">Salas</InputLabel>
                    <Select
                        labelId="labelSalas"
                        id="selectSalas"
                        value={sala}
                        label="salas"
                        disabled={textoComenzar === textoInicio[1]? true: false}
                        onChange={(e)=> setSala(e.target.value)}
                    >
                        {salasSelect}
                    </Select>                            
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2, backgroundColor: "#ffffff"}}>
                    <InputLabel id="labelJuegos">Juegos</InputLabel>
                    <Select
                        labelId="labelJuegos"
                        id="selectJuegos"
                        value={juego}
                        label="juegos"
                        disabled={textoComenzar === textoInicio[1]? true: false}
                        onChange={(e)=> handleChangeJuegos(e)}
                    >
                        {juegosSelect}
                    </Select>                            
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2, backgroundColor: "#ffffff"}}>
                    <InputLabel id="labelJugadores">Jugador</InputLabel>
                    <Select
                        labelId="labelJugadores"
                        id="selectJugadores"
                        value={jugador}
                        label="jugadores"
                        disabled={textoComenzar === textoInicio[1]? true: false}
                        onChange={(e)=> handleChangeJugadores(e)}
                        >
                        {jugadoresSelect}
                    </Select>                            
                </FormControl>
                {/* <FormControl fullWidth sx={{ mb: 2, backgroundColor: "#ffffff"}}>
                    <InputLabel id="labelNicks">Nick</InputLabel>
                    <Select
                        labelId="labelNicks"
                        id="selectNicks"
                        value={nick}
                        label="nicks"
                        disabled={textoComenzar === textoInicio[1]? true: false}
                        // onChange={(e)=> setNick(e.target.value)}
                        onChange={(e)=> handleChangeNicks(e)}
                        >
                        {nicksSelect}
                    </Select>                            
                </FormControl> */}

                <Typography data-testid="waitMessage-h5" variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "grey"}}>
                    Nick: {userNick}
                </Typography>


                <Button data-testid="start-btn" variant="contained" onClick={handleComenzar}>
                    {textoComenzar}
                </Button>
                {/* <Button variant="contained" onClick={handleReiniciarSala}>
                    Reiniciar sala
                </Button> */}
                <Typography data-testid="waitMessage-h5" variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "blue"}}>
                    {waiting && waitPlayerMessage[1]}
                </Typography>

            </Box>
            {/* Board column */}
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                backgroundColor: "#339fff"
            }}>
                <Typography variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "black", backgroundColor: "white", px: 2, py: 1,
                        borderRadius: "10px"
                    }}
                >
                    Juego {juego}
                </Typography>

                <Box sx={{display: "grid", gridTemplateColumns: "repeat(3, 150px)", gridTemplateRows: "repeat(3, 150px)",
                    gap: 1, p: 1, m: 1, border: "1px solid", borderRadius: "5px",
                    backgroundColor: "#66baff", opacity: panelDisabled ? 0.3 : null
                }}>
                        {board && board.flat().map((cell, index) => (
                            <Box key={index} sx={{border: "1px solid", borderRadius: "5px", alignContent: "center",
                                    backgroundColor: variables[1].cellBackgroundcolor,
                                    opacity: cell.disabled ? variables[1].opacity : null,
                                    fontSize: "60px", lineHeight: "30px", fontWeight: "bold"
                                }}
                                onClick={()=> handleCellClick(index)}
                            >
                                    <p style={{color: cell.cellContent.color}}>{cell.cellContent.mark}</p>
                            </Box>
                        ))}
                </Box>
                
                <Typography variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "white"}}
                >
                    Ficha Jugador: <span style={{color: playerMark.color}}>{playerMark.mark}</span>
                </Typography>
                
                <Typography data-testid="gameRunning-h5" variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "white"}}
                >
                    {gameRunning ?  "PARTIDA EN CURSO ..." : null}
                </Typography>
                
                <Typography data-testid="gameTurn-h5" variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "white"}}
                >
                    {/* {!endGame ? mensajeTurno[turno] : null}
                    {endGame ? endGameMessage: null} */}
                    {!endGame ? mensajeTurno[turno] : endGameMessage}
                </Typography>
            </Box>
        </Box>
        </>
    )
}

export default PlayArenaComponent