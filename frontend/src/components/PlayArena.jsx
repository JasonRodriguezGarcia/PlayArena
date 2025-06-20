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

const socket = io('http://localhost:5000'); // Connect once

// const rooms = ["Sala 1", "Sala 2", "Sala3"]
const nicks = ["Pepe", "Manuel", "Lola", "Maria"]
const salas = ['Sala 1', 'Sala 2', 'Sala 3']
const juegos = ['3 en raya', 'Conecta 4', 'Hundir la flota']
const jugadores = ['Jugador vs computer', 'Jugador 1 vs Jugador 2']

const PlayArena = () => {
    const [playerMark, setPlayerMark] = useState('X')
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
    const [mensajeTurno, setMensajeTurno] = useState(['Su turno (X)','Turno otro Jugador (O)'])
    const [turno, setTurno] = useState(0)
    const [endGame, setEndGame] = useState(false)
    const [endGameMessage, setEndGameMessage] = useState('')
    const [waitPlayerMessage, setWaitPlayerMessage] = useState(['', 'Esperando otro jugador ...'])
    const [waiting, setWaiting] = useState(false)
    const [connected, setConnected] = useState(true);
    const [nick, setNick] = useState(nicks[0])
    
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket');
            setConnected(true);
            socket.emit('joinRoom', sala);
        });

        socket.on('startGame', (msg) => {
            debugger
            console.log("imprimo msg: ", msg)
            setTurno(msg.turn)
            console.log("imprimo msg.turn: ", msg.turn)
            const nuevoTurno = msg.turn === 0 ? 1 : 0
            setTurno(nuevoTurno)
            // setWaitPlayerMessage(waitPlayerMessage[nuevoTurno])
            console.log("setTurno: ", turno)
            const nuevoWaiting = msg.waiting ? msg.waiting : false
            // if (nuevoWaiting)
                setTextoComenzar(textoInicio[1]) 
            setWaiting(nuevoWaiting)
            if (msg.startGame == true) {
                // setTextoComenzar(textoInicio[1])
                setEndGame(false)
                setTurno(msg.turn)
            }
            // setWaitPlayerMessage([0])
            if (turno == nuevoTurno)
                setPanelDisabled(false)
            else
                setPanelDisabled(true)
            // else
                // setTextoComenzar
                // setWaitPlayerMessage(waitPlayerMessage[1])
        })

        socket.on('playerMovement', (msg) => {
            // setWaitPlayerMessage(waitPlayerMessage[0])
            const { row, col } = traductorCelda(msg.repliedMessage.cell)
            const playerMark = msg.repliedMessage.mark
            if (playerMark === turno)
                setPanelDisabled(true)
            else
                setPanelDisabled(false)

            // const newBoard = [...board] // Y LUEGO MANIPULAR Y setBoard NO ES VALIDO !!!
            setBoard(prevBoard => {
                setTurno(playerMark == "X" ? 0 : 1)
                const newBoard = prevBoard.map(row => row.map(cell => ({ ...cell })));
                newBoard[row][col] = {
                    cellContent: playerMark,
                    disabled: true
                }
                const result = checkEndGame(newBoard, playerMark)
                if (result) {
                    setEndGame(true)
                    setEndGameMessage(`Ganador Jugador ${playerMark}`)
                    setPanelDisabled(true)
                }
                return newBoard
            })
        })

        socket.on('disconnect', () => {
            console.log('Disconnected from socket');
            setConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('joinRoom');
            socket.off('startGame');
            socket.off('playerMovement');
        };
    }, []);
    
    const nicksSelect = nicks.map((nick, index) => (
            <MenuItem key={index} value={nick}>{nick}</MenuItem>
    ))
    
    const sendChatRoom = (cell) => {
        socket.emit('playerMovement', {
            // room: selectRoom,
            room: sala,
            message: cell,
            nick: nick,
            timestamp: new Date()

        }); // can pass in more data here
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
    
    const handleChangeSalas = (e) => {
        setSala(e.target.value)
    }
    const handleChangeJuegos = (e) => {   
        setJuego(e.target.value)
    }

    const handleChangeJugadores = (e) => {
        setJugador(e.target.value)

    }

    const handleComenzar = () => {
        debugger
        if(textoComenzar === textoInicio[0]) { // comenzar
            socket.emit('startGame', {
                room: sala,
                nick: nick
            })

            setTextoComenzar(textoInicio[1])
            // setPanelDisabled(false)
            // setEndGame(false)
            // setTurno(0)
        }
        else {
            setWaiting(false)
            setTextoComenzar(textoInicio[0]) // cancelar
            setPanelDisabled(true)
        }
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

    const handleCellClick = (cell) => {
        if (panelDisabled)
            return
        sendChatRoom(cell)
    }
    
    const handleReiniciarSala = () => {
        socket.emit('clearRoom', {
            room: sala
        })
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
                        onChange={(e)=> setNick(e.target.value)}
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
                {/* // <Typography variant="h6" color="primary" gutterBottom> */}
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
                    {panelDisabled ? null : mensajeTurno[turno]}
                    {endGame ? endGameMessage: null}
                </Typography>
                
            </Box>
        </Box>
        </>

        

    )

}

export default PlayArena