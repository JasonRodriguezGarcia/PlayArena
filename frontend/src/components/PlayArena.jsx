import { useState, useEffect } from "react";
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

const nicks = ["Pepe", "Manuel", "Lola", "Maria"]
const salas = ['Sala 1', 'Sala 2', 'Sala 3']
const juegos = ['3 en raya', 'Conecta 4', 'Hundir la flota']
const jugadores = ['Jugador vs computer', 'Jugador 1 vs Jugador 2']

const PlayArena = () => {
    // const [playerMark, setPlayerMark] = useState('')
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
            Array.from({ length: 3 }, () => ({ cellContent: '', disabled: false }))
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
    const [playerMark, setPlayerMark] = useState('')
    const [endGame, setEndGame] = useState(false)
    const [endGameMessage, setEndGameMessage] = useState('')
    const [gameRunning, setGameRunning] = useState(false)
    const [waitPlayerMessage, setWaitPlayerMessage] = useState(['', 'Esperando otro jugador ...'])
    const [waiting, setWaiting] = useState(false)
    const [connected, setConnected] = useState(true);
    const [nick, setNick] = useState(nicks[0])
    
    useEffect(() => {
        const handleConnect = () => {
            // console.log('Connected to socket');
            // setConnected(true);
            // socket.emit('joinRoom', sala);
        }
        
        const handleStartGame = (msg) => {
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
            if (msg.players[0] == nick) {
                setPlayerMark("X")
                setTurno(0)
                setPanelDisabled(false)
            } else {
                setPlayerMark("O")
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
                disabled: true
            }
            const endGame = checkEndGame(newBoard, playerMark)
            if (endGame) {
                setEndGame(true)
                setGameRunning(false) //
                setPanelDisabled(true)
                // setWaiting(false)
                setTextoComenzar(textoInicio[0])
                // handleReiniciarSala()
                setEndGameMessage(`Ganador Jugador ${playerMark}`)
                // setTimeout(()=> {
                //     setEndGameMessage('')
                // }, 2000)
            }
            return newBoard
        })
        // Ahora ajustamos turno y panel
        if (msg.repliedMessage.playedTurn === 1 && nick === msg.nick) {
            // si ya jugó en su turno y era el turno 1
            setTurno(0)
            setPanelDisabled(true)
        } else if (msg.repliedMessage.playedTurn === 0 && nick === msg.nick) {
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
                Array.from({ length: 3 }, () => ({ cellContent: '', disabled: false }))
            ))
        )
        setEndGame(true)
        setGameRunning(false)
        setPlayerMark('')
        setEndGameMessage(``)

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
}, [nick, sala]);

    const handleComenzar = () => {
        socket.emit('startGame', {
            room: sala,
            nick: nick
        })
        // si esta en comenzar
        if(textoComenzar === textoInicio[0]) { 
            setTextoComenzar(textoInicio[1])
        }
        else {
            handleReiniciarSala()
        }
    }

    const sendChatRoom = (cell) => {
        socket.emit('playerMovement', {
            room: sala,
            message: cell,
            turn: turno,
            nick: nick,
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
    
    const nicksSelect = nicks.map((nick, index) => (
        <MenuItem key={index} value={nick}>{nick}</MenuItem>
    ))
    
    const handleChangeSalas = (e) => {
        setSala(e.target.value)
    }
    const handleChangeJuegos = (e) => {   
        setJuego(e.target.value)
    }

    const handleChangeJugadores = (e) => {
        setJugador(e.target.value)

    }

    const handleChangeNicks = (e) => {
        setNick(e.target.value)
        console.log("nick: ", e.target.value)
    }

    const checkEndGame = (boardToCheck, turnoTocheck) => {
        for (let index = 0; index < boardToCheck.length; index++) {
            // horizontal check
            if (boardToCheck[index][0].cellContent == turnoTocheck && boardToCheck[index][1].cellContent == turnoTocheck && boardToCheck[index][2].cellContent == turnoTocheck)
                return true
            // vertical check
            if (boardToCheck[0][index].cellContent == turnoTocheck && boardToCheck[1][index].cellContent == turnoTocheck && boardToCheck[2][index].cellContent == turnoTocheck)
                return true
        }
        // diagonal1 check
            if (boardToCheck[0][0].cellContent == turnoTocheck && boardToCheck[1][1].cellContent == turnoTocheck && boardToCheck[2][2].cellContent == turnoTocheck)
                return true
        // diagonal2 check
            if (boardToCheck[2][0].cellContent == turnoTocheck && boardToCheck[1][1].cellContent == turnoTocheck && boardToCheck[0][2].cellContent == turnoTocheck)
                return true
        return false
    }

    
    return (
        <>
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
                <FormControl fullWidth sx={{ mb: 2, backgroundColor: "#ffffff"}}>
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
                </FormControl>
                <Button variant="contained" onClick={handleComenzar}>
                    {textoComenzar}
                </Button>
                <Button variant="contained" onClick={handleReiniciarSala}>
                    Reiniciar sala
                </Button>
                <Typography variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "blue"}}>
                    {waiting && waitPlayerMessage[1]}
                </Typography>

            </Box>
            {/* Board column */}
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                backgroundColor: "#339fff"
            }}>
                <Typography variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "blue"}}
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
                                    <p>{cell.cellContent}</p>
                            </Box>
                        ))}
                </Box>
                
                <Typography variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "white"}}
                >
                    Ficha Jugador: {playerMark}
                </Typography>
                
                <Typography variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "white"}}
                >
                    {gameRunning ?  "PARTIDA EN CURSO ..." : null}
                    {/* {!endGame? null :  "PARTIDA EN CURSO ..."} */}
                </Typography>
                
                <Typography variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "white"}}
                >
                    {!endGame ? mensajeTurno[turno] : null}
                    {endGame ? endGameMessage: null}
                </Typography>
                
            </Box>
        </Box>
        </>

        

    )

}

export default PlayArena