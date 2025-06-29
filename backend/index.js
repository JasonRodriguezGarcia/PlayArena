import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";
import connectDB from './db-mongodb.js';  // Import your MongoDB connection module
import playarenaRouter from './routes/playarena.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// const allowedOrigins = ['http://localhost:5173'];
// const allowedOrigins = ['https://render-project-frontend.onrender.com'];
// const allowedOrigins = [`${process.env.FRONTEND_URL_RENDER}`];
// app.use(cors({
//   origin: function(origin, callback){
//     // allow requests with no origin (like curl, postman)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true, // if you need to send cookies/auth headers
// }));


// Middleware
app.use(cors());
app.use(express.json());

async function startServer() {
    try {
        // Connect to MongoDB and store the DB instance in app.locals
        const db = await connectDB();
        app.locals.db = db; // saving database globally

        app.use('/api/v1/playarena', playarenaRouter)  // to show in the future any chat, game statistics, ...

        // Create HTTP server from express app
        const httpServer = app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        });

        try {
            
            // Estado por sala
            const games = []
            function tablero3enRaya(sala) {
                return (
                    {
                        sala: sala,
                        board: Array.from({ length: 3 }, () => Array(3).fill('')),
                        turno: 0,
                        players: [] // igual hay que cambiar en el futuro a array con nick de players
                    }
                )
            }

            // Setup Socket.IO server on the same HTTP server
            const io = new SocketIOServer(httpServer, {
            cors: {
                origin: "*", // adjust for your frontend origin
            },
            });

            io.on("connection", (socket) => {

            socket.on ("joinRoom", (room) => {
                // console.log(`Socket ${socket.id} has joined ${room}`);
                // socket.join(room);
            });

            socket.on('clearRoom', async ({room})=> {
                const buscarSala = games.findIndex(game => game.sala == room)
                if (games.findIndex(game => game.sala == room) != -1) {

                    games.splice(buscarSala, 1)
                    console.log("Room en backend clearRoom: ", room)
                    console.log("Games: ", games)
                    console.log("Room cleared: ", room)
                    // enviar a todos los de sala el comienzo del juego y también playerMark para el 2º jugador
                    io.to(room).emit('clearRoom')

                } else {
                    console.log("Room already empty")
                }
            })

            socket.on('startGame', async ({room, nick})=> {
                console.log(`Socket ${socket.id} has joined ${room}`);
                socket.join(room);
                let startGame = false // creado startgame para cuando se juege contra el ordenador
                let waiting
                let playerMark
                const buscarSala = games.find(game => game.sala == room)
                console.log("buscarsala: ", buscarSala)
                if ( buscarSala === undefined) { // Sala no existente
                    const nuevaSala = tablero3enRaya(room)
                    nuevaSala.sala = room
                    console.log("Creada objeto nuevaSala: ", nuevaSala)
                    nuevaSala.players.push(nick)
                    games.push(nuevaSala)
                    waiting = true
                    playerMark = "X" // Es el primer jugado de la sala recien creada
                    socket.emit('startGame', {waiting: waiting, playerMark: playerMark});

                } else 
                // hay ya una sala con jugador y el nuevo no esta repetido
                if (buscarSala.players.length < 2 && !buscarSala.players.includes(nick)) { // hay ya una sala con jugador y el nuevo no esta repetido
                    buscarSala.players.push(nick)
                    console.log("imprimo objeto nuevaSala ya existente: ", buscarSala)
                    waiting = false
                    playerMark = "O"
                    startGame = true
                    io.to(room).emit('startGame', {startGame: startGame, players: buscarSala.players})
                } 
                else {
                    console.log("paso por aqui")
                    socket.emit('startGame', {startGame: false, abortGame: true, playerMark: playerMark});
                }

                console.log("games: ", games)
            })

            socket.on('playerMovement', async ({room, message, turn, nick, timestamp})=> {
                console.log("receiving: ", room, " - Celda ", message, nick);
                const row = Math.floor(message / 3)
                const col = message % 3
                const tableroJuego = games.find(game => game.sala === room)
                const {turno, board} = tableroJuego
                if (board[row][col] !== '') {
                    return; // celda ocupada
                }
                const mark = turno === 0 ? {mark: "X", color: "green"}: {mark: "O", color: "red"}
                board[row][col] = mark.mark
                tableroJuego.turno = 1 - tableroJuego.turno
                console.log("imprimo tableroJuego: ", JSON.stringify(tableroJuego))
                const repliedMessage = { cell: message, mark, playedTurn: turn}
                console.log("sending: ", repliedMessage)
                // envia a todos los de la sala a excepcion del emisor
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

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); // Exit the process with failure code
    }
}

startServer();