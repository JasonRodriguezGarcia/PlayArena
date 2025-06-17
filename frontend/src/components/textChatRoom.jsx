import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect once

// const ROOM_NAME = 'myRoom';

const rooms = ["Sala 1", "Sala 2", "Sala3"]
const nicks = ["Pepe", "Manuel", "Lola", "Maria"]

function ChatRoom() {
    const [connected, setConnected] = useState(true);
    const [input, setInput]= useState('');
    const [messages, setMessages] = useState([]);
    const [selectRoom, setSelectRoom] = useState("Sala 1")
    const [selectNick, setSelectNick] = useState("Pepe")
    const [historial, setHistorial] = useState([])
    const [historialVisible, setHistorialVisible] = useState(false)
    const [historialButtonText, setHistorialButtonText] = useState("Ver historial")

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket');
      setConnected(true);
    //   socket.emit('joinRoom', ROOM_NAME);
      socket.emit('joinRoom', selectRoom);
    });

    socket.on('chatRoomMessage', (msg) => {
    //   setMessages(prev => [...prev, msg.nick + " dice " + msg.message]);
        setMessages(prev => {
            const updated = [...prev, {message: msg.message, nick: msg.nick}];
            console.log("Agregado mensaje:", updated);
            return updated;
        });
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
      setConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('joinRoom');
      socket.off('chatRoomMessage');
      
    };
  }, []);

  const handleDisconnect = () => {
    socket.disconnect();
    setConnected(false);
  };

  const selectRooms = () => {
    return rooms.map((room, index) => (
        <option key={index} id={room} value={room}>{room}</option>
    ))
  }

    const selectNicks = () => {
        return nicks.map((nick, index) => (
            <option key={index} id={nick} value={nick}>{nick}</option>
        ))
    }

    const sendChatRoom = () => {
        // socket.emit('chatRoomMessage', {room: ROOM_NAME, message: input}); // can pass in more data here
        socket.emit('chatRoomMessage', {
            room: selectRoom,
            message: input,
            nick: selectNick,
            timestamp: new Date()

        }); // can pass in more data here

        setMessages(prev => {
            const updated = [...prev, {message: input, nick: selectNick}];
            console.log("Agregado mensaje:", updated);
            return updated;
        });
        setInput('');
    }

    const handleHistorial = async () => {
        if (historialVisible){
            setHistorialVisible(false)
            setHistorialButtonText("Ver historial")
            return
        }
        try {
            setHistorial([])
            const response = await fetch('http://localhost:5000/api/v1/chats');
      
            if (!response.ok) throw new Error('Error en la respuesta');
            const data = await response.json();
            const filtrado = data.filter(history => history.room == selectRoom)
            console.log("filtrado: ", filtrado)
            setHistorial(prev => [ ...prev, ...filtrado]);
            setHistorialVisible(true)
            setHistorialButtonText("Cerrar historial")
        } catch (error) {
            console.error('Error al obtener los historial:', error);
        }
    }

  return (
    <div>

      <h2>💬 Chat Socket</h2>
      <label htmlFor="selectOptionRoom">Sala:</label>
      <select name="selectOptionRoom" id="selectOptionRoom" onChange={(e)=> setSelectRoom(e.target.value)}>
        {selectRooms()}
      </select>
        <label htmlFor="selectOptionNick">Nick:</label>
      <select name="selectOptionNick" id="selectOptionNick" onChange={(e)=> setSelectNick(e.target.value)}>
        {selectNicks()}
      </select>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>

      {connected && (
        <button onClick={handleDisconnect}>Disconnect</button>
      )}

      {messages.map((message) => (
            <div style={{margin: "0px", textAlign: message.nick == selectNick? "right" : "left"}}>
                <sup>{message.nick}</sup>{message.message}
            </div>
      ))}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />


      <button onClick={sendChatRoom}>
        Send to Chat Room
      </button>

      <button onClick={handleHistorial}>
        {/* Ver historial */}
        {historialButtonText}
      </button>
      {/* <ul> */}
        {historialVisible 
            ? historial.length == 0 ? <p>NO HAY DATOS</p> : (historial.map((history, index) => (
                // <li key={index} style={{textAlign: history.nick == selectNick? "right" : "left"}}>{history.room}- {history.message} - {history.nick}</li>
                <p key={index} style={{margin: "0px", textAlign: history.nick == selectNick? "right" : "left"}}>
                    <sup>({history.nick})</sup>- {history.message}
                </p>
                )))
            : null
        }
      {/* </ul> */}

    </div>
  );
}

export default ChatRoom;