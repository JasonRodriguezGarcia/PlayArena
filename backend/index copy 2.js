import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";
// import connectDB from './db-mongodb.js';  // Import your MongoDB connection module
import playarenaRouter from './routes/playarena.js';
// import getInitialData from './utils/backendFunctions.js'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
let turno = undefined
let playerSign

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
        const board = Array.from({ length: 3 }, () => (
                Array.from({ length: 3 }, () => ({ cellContent: '', disabled: false }))
                )
              )
        console.log("turno: ", turno, "typeof: ", typeof(turno))
        if (typeof(turno) === "undefined")
        {

          turno = true
          playerSign = "X"
        }
        else {
          turno = false
          playerSign = "O"
        }
        const initialData = {
          board: board,
          turno: turno,
          playerSign: playerSign
        }
        // enviar a ese socket datos iniciales??
        socket.emit("initialData", initialData)
      });

      socket.on('playerMovement', async ({room, message, nick, timestamp})=> {
        console.log("receiving: ", room, " - ", message, nick);

        //         // if (panelDisabled || turno == 1)
        // if (panelDisabled)
        //     return
        // console.log("Celda presionada: ", cell)
        //     // Convertimos índice plano a 2D [row, col]
        // const row = Math.floor(cell / 3);
        // const col = cell % 3;
        // if (board[row][col].disabled) {
        //     console.log("celda desactivada")
        //     return
        // }
        // else
        //     console.log("CELDA ACTIVADA")
        // const jugadorSign = turno == 0 ? "X": "O"
        // const newBoard = [...board]
        // newBoard[row][col] = {
        //     cellContent: jugadorSign,
        //     disabled: true
        // }
        // setBoard(newBoard)
        // sendChatRoom(cell)

        // if (checkEndGame(newBoard, jugadorSign)) {
        //     setMensajeFinal(`Fin de Juego !!! Ganador: ${jugadorSign}`)
        //     setPanelDisabled(true)
        //     setEndGame(true)
        //     // setTextoComenzar('Comenzar !!')
        //     setTextoComenzar(textoInicio[0])

        // }
        // setTurno(turno == 1 ? 0 : 1)


        // Convertimos índice plano a 2D [row, col]
        const row = Math.floor(message / 3);
        const col = message % 3;

        const repliedMessage = { row: row, col: col}
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