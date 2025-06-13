// App.jsx
import { useState, useEffect } from 'react';
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
} from '@mui/material';

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
  [0, 4, 8], [2, 4, 6],           // diagonales
];

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [gameActive, setGameActive] = useState(true);
  const [message, setMessage] = useState('Haz clic para comenzar');
  const [room, setRoom] = useState('Sala 1');
  const [game, setGame] = useState('3 en Raya');
  const [players, setPlayers] = useState('Player1 vs Computer');

  useEffect(() => {
    if (!gameActive) return;
    const winner = checkWinner('X') ? 'Player1' :
                   checkWinner('O') ? 'Computer' : null;

    if (winner) {
      setMessage(winner === 'Player1' ? '🎉 ¡Player1 ha ganado!' : '🤖 ¡Computer ha ganado!');
      setGameActive(false);
    } else if (board.every(cell => cell !== '')) {
      setMessage('🤝 ¡Empate!');
      setGameActive(false);
    } else if (board.includes('X')) {
      // Delay para que se sienta más natural
      setTimeout(() => {
        const newBoard = [...board];
        const emptyIndices = newBoard.map((v, i) => v === '' ? i : null).filter(i => i !== null);
        const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        if (move !== undefined) {
          newBoard[move] = 'O';
          setBoard(newBoard);
        }
      }, 400);
    }
  }, [board, gameActive]);

  const checkWinner = (player) =>
    winningCombinations.some(comb => comb.every(i => board[i] === player));

  const handleCellClick = (index) => {
    if (!gameActive || board[index] !== '') return;
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setGameActive(true);
    setMessage('Tu turno (X)');
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Sidebar */}
      <Grid item xs={2} sx={{ bgcolor: '#f5f5f5', p: 3, borderRight: '1px solid #ccc' }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Configuración
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Sala</InputLabel>
          <Select value={room} onChange={(e) => setRoom(e.target.value)}>
            <MenuItem value="Sala 1">Sala 1</MenuItem>
            <MenuItem value="Sala 2">Sala 2</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Juego</InputLabel>
          <Select value={game} onChange={(e) => setGame(e.target.value)}>
            <MenuItem value="3 en Raya">3 en Raya</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Jugador</InputLabel>
          <Select value={players} onChange={(e) => setPlayers(e.target.value)}>
            <MenuItem value="Player1 vs Computer">Player1 vs Computer</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={resetGame}>
          Comenzar
        </Button>
      </Grid>

      {/* Main area */}
      <Grid
        item
        xs={10}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 100px)',
            gap: 1,
            mb: 3,
          }}
        >
          {board.map((cell, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                width: 100,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                cursor: cell || !gameActive ? 'default' : 'pointer',
                bgcolor: cell ? '#e0e0e0' : '#e6f4ff',
                transition: 'background 0.2s',
                '&:hover': {
                  backgroundColor: cell || !gameActive ? undefined : '#d0ecff',
                },
              }}
              onClick={() => handleCellClick(index)}
            >
              {cell}
            </Paper>
          ))}
        </Box>

        <Typography
          variant="h6"
          sx={{
            px: 2,
            py: 1,
            borderLeft: '5px solid #1976d2',
            backgroundColor: '#eef7ff',
            borderRadius: 1,
            minWidth: '300px',
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default App;