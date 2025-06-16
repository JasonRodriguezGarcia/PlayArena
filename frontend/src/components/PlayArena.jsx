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

    
    // const [board, setBoard] = useState([
    //     [{cellContent: '', disabled: false}, {cellContent: '', disabled: false}, {cellContent: '', disabled: false}],
    //     [{cellContent: '', disabled: false}, {cellContent: '', disabled: false}, {cellContent: '', disabled: false}],
    //     [{cellContent: '', disabled: false}, {cellContent: '', disabled: false}, {cellContent: '', disabled: false}]
    // ])
    const [board, setBoard] = useState([
        Array(3).fill({ cellContent: '', disabled: false }),
        Array(3).fill({ cellContent: '', disabled: false }),
        Array(3).fill({ cellContent: '', disabled: false })
    ])
    const [salas, setSalas] = useState(['Sala 1', 'Sala 2', 'Sala 3'])
    const [sala, setSala] = useState(salas[0])
    const [juegos, setJuegos] = useState(['3 en raya', 'Conecta 4', 'Hundir la flota'])
    const [juego, setJuego] = useState(juegos[0])
    const [jugadores, setJugadores] = useState(['Jugador vs computer', 'Jugador 1 vs Jugador 2'])
    const [jugador, setJugador] = useState(jugadores[0])
    const [textoInicio, setTextoInicio] = useState(['Comenzar !!', 'Cancelar !!'])
    const [textoComenzar, setTextoComenzar] = useState(textoInicio[0])
    const [panelDisabled, setPanelDisabled] = useState(true)
    const [mensajeTurno, setMensajeTurno] = useState(['Su turno (X)','Turno otro Jugador (O)'])
    const [turno, setTurno] = useState(0)
    const [endGame, setEndGame] = useState(false)
    const [mensajeFinal, setMensajeFinal] = useState('')

    const salasSelect =  salas.map((sala, index) => (
        <MenuItem key={index} value={sala}>{sala}</MenuItem>
    ))
    const juegosSelect =  juegos.map((juegos, index) => (
        <MenuItem key={index} value={juegos}>{juegos}</MenuItem>
    ))
    const jugadoresSelect =  jugadores.map((jugadores, index) => (
        <MenuItem key={index} value={jugadores}>{jugadores}</MenuItem>
    ))
    
    // const lineasDatosVotantes = votantes.map((votante, index) => (
    //     <MenuItem key={index} value={votante.idVotante}>({votante.idVotante}) {votante.nombre} - {votante.codigoPais}</MenuItem>
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

    const handleComenzar = () => {
        console.log("textoComenzar: ", textoComenzar)
        if(textoComenzar === 'Comenzar !!') {
            setBoard([
                [{cellContent: '', disabled: false}, {cellContent: '', disabled: false}, {cellContent: '', disabled: false}],
                [{cellContent: '', disabled: false}, {cellContent: '', disabled: false}, {cellContent: '', disabled: false}],
                [{cellContent: '', disabled: false}, {cellContent: '', disabled: false}, {cellContent: '', disabled: false}]
            ])
        // setTextoComenzar('Cancelar !!')
            setTextoComenzar(textoInicio[0])
            setPanelDisabled(false)
            setEndGame(false)
            setTurno(0)
        }
        else {
            // setTextoComenzar('Comenzar !!')
            setTextoComenzar(textoInicio[1])
            setPanelDisabled(true)
        }

    }

    const checkEndGame = (boardToCheck, turnoTocheck) => {
        debugger
        for (let index = 0; index < boardToCheck.length; index++) {
            if (boardToCheck[index][0].cellContent == turnoTocheck && boardToCheck[index][1].cellContent == turnoTocheck && boardToCheck[index][2].cellContent == turnoTocheck)
                return true
            if (boardToCheck[0][index].cellContent == turnoTocheck && boardToCheck[1][index].cellContent == turnoTocheck && boardToCheck[2][index].cellContent == turnoTocheck)
                return true
            
        }
        return false
    }

    const handleCellClick = (cell) => {
        if (panelDisabled)
            return
        console.log("Celda presionada: ", cell)
            // Convertimos índice plano a 2D [row, col]
        const row = Math.floor(cell / 3);
        const col = cell % 3;
        if (board[row][col].disabled) {
            console.log("celda desactivada")
            return
        }
        else
            console.log("CELDA ACTIVADA")
        const jugadorSign = turno == 0 ? "X": "O"
        const newBoard = [...board]
        newBoard[row][col] = {
            cellContent: jugadorSign,
            disabled: true
        }
        // setBoard(prev => {
        //     const tempBoard = [...newBoard]
        //     return tempBoard
        // })
        if (checkEndGame(newBoard, jugadorSign)) {
            setBoard(newBoard)
            setMensajeFinal(`Fin de Juego !!! Ganador: ${jugadorSign}`)
            setPanelDisabled(true)
            setEndGame(true)
            setTextoComenzar('Comenzar !!')

        }
        setTurno(turno == 1 ? 0 : 1)
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
                <Button variant="contained" onClick={handleComenzar}>
                    {textoComenzar}
                </Button>
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
                    {endGame ? mensajeFinal: null}
                </Typography>
                
            </Box>
        </Box>
        </>

        

    )

}

export default PlayArena