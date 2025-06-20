import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";
// import connectDB from './db-mongodb.js';  // Import your MongoDB connection module
import playarenaRouter from './routes/playarena.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

async function startServer() {

  // Connect to MongoDB and store the DB instance in app.locals
  // const db = await connectDB();
  // app.locals.db = db; // saving database globally

  app.use('/api/v1/playarena', playarenaRouter)  // to show in the future any chat, game statistics, ...

  try {
    
    // Create HTTP server from express app
    const httpServer = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Estado por sala
    const games = {}

    // Setup Socket.IO server on the same HTTP server
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*", // adjust for your frontend origin
      },
    });

    io.on("connection", (socket) => {
      
      socket.on ("joinRoom", (room) => {
        console.log(`Socket ${socket.id} has joined ${room}`);
        socket.join(room);
        if (!games[room]) {
            games[room] = {
                board: Array.from({ length: 3 }, () => Array(3).fill('')),
                turno: 0,
                players: 0 // igual hay que cambiar en el futuro a array con nick de players
            }
        }
        console.log("Creada sala: ", room)
      });
      socket.on('clearRoom', async ({room})=> {
        if (games[room]) {
            games[room] = {
                board: Array.from({ length: 3 }, () => Array(3).fill('')),
                turno: 0,
                players: 0 // igual hay que cambiar en el futuro a array con nick de players
            }
        }
      })

      socket.on('startGame', async ({room, nick})=> {
        let startGame = false // creado startgame para cuando se juege contra el ordenador
        let turn
        if (games[room].players == 0) {
          games[room].players +=1
          turn = 0
          console.log("turn: ", turn)
        } else if (games[room].players == 1) {
          games[room].players +=1
          turn = 1
        }
        console.log("games: ", games)
        console.log("turn: ", turn)
        // enviamos al nick el turno
        socket.emit('startGame', {turn: turn});
        if (games[room].players == 2) {
          startGame = true
          // enviar a todos los de sala el comienzo del juego
          io.to(room).emit('startGame', {startGame: startGame})
          return
        }
        // io.to(room).emit('waitPlayer', {startGame: startGame});
        // Enviar mensaje de vuelta SOLO al remitente
      })

      socket.on('playerMovement', async ({room, message, nick, timestamp})=> {
        console.log("receiving: ", room, " - Celda ", message, nick);
        const game = games[room]
        if (!game)
            return
        const row = Math.floor(message / 3)
        const col = message % 3

        const {turno, board} = game
        if (board[row][col] !== '') {
            return; // celda ocupada
        }
        const mark = turno === 0 ? "X": "O"
        board[row][col] = mark
        game.turno = 1 - turno

        const repliedMessage = { cell: message, mark: mark}
        console.log("sending: ", repliedMessage)
    
        // envia a todos los de la sala a excepcion del emisor
        // socket.to(room).emit('playerMovement', {message, nick});
        // socket.to(room).emit('playerMovement', {repliedMessage, nick});
        // envia a todos los de la sala incluido el emisor
        io.to(room).emit('playerMovement', {repliedMessage, nick});

      }
    );

      socket.on("disconnect", (reason) => {
          console.log(`User disconnected ${socket.id} and ${reason}`)
      })
    })
  }

  catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
}

startServer();