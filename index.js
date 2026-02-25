const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;
const rooms = new Map();

app.use(express.json());
app.use(express.static(__dirname));

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'LEME-';
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const createRoom = () => {
  let roomCode = generateRoomCode();
  while (rooms.has(roomCode)) {
    roomCode = generateRoomCode();
  }

  rooms.set(roomCode, {
    hostId: null,
    players: new Map()
  });

  return roomCode;
};

const roomSummary = (room) => ({
  players: Array.from(room.players.entries()).map(([socketId, player]) => ({
    socketId,
    name: player.name,
    isHost: player.isHost
  }))
});

const leaveRoom = (socket) => {
  const joinedRoomCode = socket.data.roomCode;
  if (!joinedRoomCode || !rooms.has(joinedRoomCode)) return;

  const room = rooms.get(joinedRoomCode);
  const departingPlayer = room.players.get(socket.id);
  room.players.delete(socket.id);
  socket.leave(joinedRoomCode);

  if (!departingPlayer) return;

  if (socket.id === room.hostId) {
    io.to(joinedRoomCode).emit('room-closed', {
      message: 'The host ended this session. Please start or join another room.'
    });

    for (const socketId of room.players.keys()) {
      const client = io.sockets.sockets.get(socketId);
      if (client) {
        client.leave(joinedRoomCode);
        client.data.roomCode = null;
      }
    }

    rooms.delete(joinedRoomCode);
  } else {
    io.to(joinedRoomCode).emit('system-message', {
      text: `${departingPlayer.name} left the realm.`
    });
    io.to(joinedRoomCode).emit('player-list', roomSummary(room));

    if (room.players.size === 0) {
      rooms.delete(joinedRoomCode);
    }
  }

  socket.data.roomCode = null;
};

app.post('/api/rooms', (_req, res) => {
  const roomCode = createRoom();
  res.json({
    roomCode,
    minPlayers: MIN_PLAYERS,
    maxPlayers: MAX_PLAYERS,
    inviteLink: `/index.html?room=${encodeURIComponent(roomCode)}`
  });
});

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomCode, playerName }) => {
    const normalizedRoomCode = String(roomCode || '').trim().toUpperCase();
    const cleanName = String(playerName || '').trim().slice(0, 24) || 'Adept';

    if (!normalizedRoomCode || !rooms.has(normalizedRoomCode)) {
      socket.emit('room-error', { message: 'Room not found. Check your invite link or code.' });
      return;
    }

    const room = rooms.get(normalizedRoomCode);

    if (room.players.size >= MAX_PLAYERS) {
      socket.emit('room-error', { message: 'This room is full (max 4 players).' });
      return;
    }

    socket.join(normalizedRoomCode);
    socket.data.roomCode = normalizedRoomCode;

    const isFirstPlayer = room.players.size === 0;
    room.players.set(socket.id, { name: cleanName, isHost: isFirstPlayer });

    if (isFirstPlayer) {
      room.hostId = socket.id;
    }

    io.to(normalizedRoomCode).emit('system-message', {
      text: `${cleanName} joined room ${normalizedRoomCode}. (${room.players.size}/${MAX_PLAYERS})`
    });
    io.to(normalizedRoomCode).emit('player-list', roomSummary(room));
  });

  socket.on('game-message', (payload) => {
    const roomCode = socket.data.roomCode;
    if (!roomCode || !rooms.has(roomCode)) return;

    const room = rooms.get(roomCode);
    const sender = room.players.get(socket.id);
    if (!sender) return;

    socket.to(roomCode).emit('game-message', {
      ...payload,
      from: sender.name
    });
  });

  socket.on('leave-room', () => {
    leaveRoom(socket);
  });

  socket.on('disconnect', () => {
    leaveRoom(socket);
  });
});

server.listen(PORT, () => {
  console.log(`LEMEGETON server running at http://localhost:${PORT}`);
});
