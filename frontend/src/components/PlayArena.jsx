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
    const [board, setBoard] = useState(['', '', '', '', '', '', '', '', ''])
    const [salas, setSalas] = useState(['Sala 1', 'Sala 2', 'Sala 3'])
    const [sala, setSala] = useState(salas[0])
    const [juegos, setJuegos] = useState(['3 en raya', 'Conecta 4', 'Hundir la flota'])
    const [juego, setJuego] = useState(juegos[0])
    const [jugadores, setJugadores] = useState(['Jugador vs computer', 'Jugador 1 vs Jugador 2'])
    const [jugador, setJugador] = useState(jugadores[0])
    const [textoInicio, setTextoInicio] = useState(['Comenzar !!', 'Cancelar !!'])
    const [textoComenzar, setTextoComenzar] = useState(textoInicio[0])

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
        if(textoComenzar === 'Comenzar !!')
            setTextoComenzar('Cancelar !!')
        else
            setTextoComenzar('Comenzar !!')
        debugger
    }
    return (
        <>
        <Box sx={{display: 'grid', height: '100vh', gridTemplateColumns: 'minmax(250px, 2fr) 10fr', gap: 2,
            userSelect: "none"
         }}>
            <Box sx={{ width: "100%", padding: 2, backgroundColor: "#f5f5f5" }}>
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
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <Typography variant="h5" component="div" 
                    sx={{margin: "0 0 1 0",  color: "blue"}}
                >
                    Juego {juego}
                </Typography>
                <Box sx={{display: "grid", gridTemplateColumns: "repeat(3, 150px)", gridTemplateRows: "repeat(3, 150px)",
                    gap: 1, p: 1, m: 1, border: "1px solid", borderRadius: "5px"
                }}>
                        {board && board.map((cell, index) => (
                    <Box key={index} sx={{border: "1px solid", borderRadius: "5px", alignContent: "center",
                        backgroundColor: "#e6f4ff"}}
                    >
                            <p>{cell}</p>
                    </Box>
                        ))}
                </Box>
                
                
            </Box>
        </Box>
        </>

        

    )

}

export default PlayArena