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
    const [salas, setSalas] = useState(['Sala 1', 'Sala 2', 'Sala 3'])
    const [sala, setSala] = useState('Sala 1')
    const [juegos, setJuegos] = useState(['3 en raya', 'Conecta 4', 'Hundir la flota'])
    const [juego, setJuego] = useState('3 en raya')
    const [jugadores, setJugadores] = useState(['Jugador 1', 'Jugador 2', 'Jugador 3'])
    const [jugador, setJugador] = useState('Jugaor 1')

    const salasSelect =  salas.map((sala, index) => (
        <MenuItem key={index} value={sala}>{sala}</MenuItem>
    ))
    const salasJuegos =  juegos.map((juegos, index) => (
        <MenuItem key={index} value={juegos}>{juegos}</MenuItem>
    ))
    const salasJugadores =  jugadores.map((jugadores, index) => (
        <MenuItem key={index} value={jugadores}>{jugadores}</MenuItem>
    ))
    
    // const lineasDatosVotantes = votantes.map((votante, index) => (
    //     <MenuItem key={index} value={votante.idVotante}>({votante.idVotante}) {votante.nombre} - {votante.codigoPais}</MenuItem>
    // ))

    
    const handleChangeSalas = () => {}
    const handleJuego = () => {}
    const handleJugadores = () => {}

    return (
        <>
        <Box sx={{height: "100vh", width: "95vw", marginX: "20px"}}>
            {/* <Box sx={{ flexGrow: 1 }}> */}
                <Grid container sx={{height: "100vh", width: "95vw"}}>
                    <Grid size={2}>
                        {/* <Box sx={{display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "white"}}> */}
                            <FormControl fullWidth>
                                <InputLabel id="labelsalas">Salas</InputLabel>
                                <Select
                                    labelId="selectSalas"
                                    id="selectSalas"
                                    value={salas}
                                    label="salas"
                                    onChange={handleChangeSalas}
                                >
                                    {salasSelect}
                                </Select>                            
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="labelJuegos">Juegos</InputLabel>
                                <Select
                                    labelId="selectJuegos"
                                    id="selectJuegos"
                                    value={juegos}
                                    label="juegos"
                                    onChange={handleChangeJuegos}
                                >
                                    {juegosSelect}
                                </Select>                            
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="labelJugador">Jugador</InputLabel>
                                <Select
                                    labelId="selectJugadores"
                                    id="selectJugadores"
                                    value={jugadores}
                                    label="jugadores"
                                    onChange={handleChangeJugadores}
                                >
                                    {jugadoresSelect}
                                </Select>                            
                            </FormControl>
                        {/* </Box> */}
                    </Grid>
                    <Grid item xs={10}>

                        <Box component="div"
                                    sx={{
                                    width: "100vw",
                                    borderRadius: 1,
                                    display: "flex",
                                    // justifyContent: "center",
                                    // alignContent: "baseline",
                                    flexDirection: "column",
                                    m: 0,
                                    // gap: 1,
                                    p: 2
                                    }}
                        >
                            <Typography variant="h5" component="div" 
                                sx={{margin: "0 0 1 0",  color: "blue"}}
                            >
                                Juego 3 en raya
                            </Typography>

                            {/* <Fab type="submit" variant="extended" size="medium" color="primary" 
                                sx={{width: "15%", position: "fixed", left: "50%", transform: "translateX(-50%)" , bottom: "0", mb: 2}}
                            >
                                Reservar Taxi
                            </Fab> */}
                        </Box>
                    </Grid>
                </Grid>
            {/* </Box> */}
        </Box>
        </>

        

    )

}

export default PlayArena