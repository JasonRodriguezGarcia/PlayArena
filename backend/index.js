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
      });

      socket.on('chatRoomMessage', async ({room, message, nick, timestamp})=> {
        console.log("receiving");
    //     // try {

    //     //   const newDoc = {
    //     //     room: room,
    //     //     message: message,
    //     //     nick: nick,
    //     //     timestamp: timestamp
    //     //   }
    //     //   const resultado = await db.collection("chats").insertOne(newDoc);
       
    //     // } catch (error) {
    //     //   console.error("Error finding productos:", error);
    //     //   res.status(500).json({ error: 'Failed finding productos' });
    //     // }
    
    //     socket.to(room).emit('chatRoomMessage', {message, nick});

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