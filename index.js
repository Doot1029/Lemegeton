const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// State tracking
const rooms = {}; // { roomId: { players: { socketId: { name, role } } } }

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', ({ roomId, name }) => {
        socket.join(roomId);
        
        if (!rooms[roomId]) {
            rooms[roomId] = { players: {} };
        }
        
        rooms[roomId].players[socket.id] = { 
            name: name || `Cultist-${socket.id.substring(0,4)}`,
            role: Object.keys(rooms[roomId].players).length === 0 ? 'Host' : 'Acolyte'
        };

        console.log(`User ${name} (${socket.id}) joined room: ${roomId}`);
        
        // Notify everyone in the room about the new player list
        io.to(roomId).emit('player-list-update', Object.values(rooms[roomId].players));
        
        // Store room info on socket for cleanup
        socket.currentRoom = roomId;
    });

    socket.on('broadcast-msg', (payload) => {
        const { roomId, type, data, from } = payload;
        // Re-broadcast to everyone in the room except sender (optionally)
        // Here we broadcast to everyone so the sender sees their own msg if handled that way, 
        // but index.html handles sender filtering locally.
        socket.to(roomId).emit('incoming-msg', { type, data, from, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const roomId = socket.currentRoom;
        if (roomId && rooms[roomId]) {
            delete rooms[roomId].players[socket.id];
            
            if (Object.keys(rooms[roomId].players).length === 0) {
                delete rooms[roomId];
            } else {
                io.to(roomId).emit('player-list-update', Object.values(rooms[roomId].players));
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
