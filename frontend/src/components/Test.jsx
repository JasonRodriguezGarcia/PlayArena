import React from 'react';
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const Test = () => {
  const [sala, setSala] = React.useState('');
  const [jugador, setJugador] = React.useState('');

  return (
    <Box sx={{display: "flex"}}>

    <Grid container spacing={2}>
      {/* Columna izquierda - 2fr */}
      <Grid item xs={3} sm={12}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="sala-label">Sala</InputLabel>
          <Select
            labelId="sala-label"
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            label="Sala"
            >
            <MenuItem value="sala1">Sala 1</MenuItem>
            <MenuItem value="sala2">Sala 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="jugador-label">Jugador</InputLabel>
          <Select
            labelId="jugador-label"
            value={jugador}
            onChange={(e) => setJugador(e.target.value)}
            label="Jugador"
            >
            <MenuItem value="jugador1">Jugador 1</MenuItem>
            <MenuItem value="jugador2">Jugador 2</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Columna derecha - 1fr */}
      <Grid item xs={9} sm={12} container alignItems="center" justifyContent="center">
        <Box>
            <Typography variant="h5">Tablero</Typography>

        </Box>
      </Grid>
    </Grid>
</Box>
  );
};

export default Test;
