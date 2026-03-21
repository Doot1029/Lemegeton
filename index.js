const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));
app.use("/lorejs", express.static(path.join(__dirname, "node_modules", "lorejs")));

// Session management
const sessions = new Map();

function generateSessionCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("create_session", (data) => {
    let code = generateSessionCode();
    while (sessions.has(code)) {
      code = generateSessionCode();
    }

    const session = {
      code,
      host: socket.id,
      players: new Map([[socket.id, { name: data.name || "Adventurer", id: socket.id }]]),
      isPublic: false,
      gameState: data.gameState || {}
    };

    sessions.set(code, session);
    socket.join(code);
    socket.emit("session_created", { code, isPublic: session.isPublic });
    console.log(`Session created: ${code}`);
  });

  socket.on("join_session", (data) => {
    const code = data.code?.toUpperCase();
    const session = sessions.get(code);

    if (session) {
      session.players.set(socket.id, { name: data.name || "Adventurer", id: socket.id });
      socket.join(code);
      socket.emit("session_joined", { 
        code, 
        isPublic: session.isPublic,
        players: Array.from(session.players.values())
      });
      socket.to(code).emit("player_joined", { name: data.name || "Adventurer", id: socket.id });
      console.log(`User ${socket.id} joined session ${code}`);
    } else {
      socket.emit("error", { message: "Session not found." });
    }
  });

  socket.on("join_random", (data) => {
    const publicSessions = Array.from(sessions.values()).filter(s => s.isPublic);
    if (publicSessions.length > 0) {
      const session = publicSessions[Math.floor(Math.random() * publicSessions.length)];
      const code = session.code;
      session.players.set(socket.id, { name: data.name || "Adventurer", id: socket.id });
      socket.join(code);
      socket.emit("session_joined", { 
        code, 
        isPublic: session.isPublic,
        players: Array.from(session.players.values())
      });
      socket.to(code).emit("player_joined", { name: data.name || "Adventurer", id: socket.id });
    } else {
      socket.emit("error", { message: "No public sessions available." });
    }
  });

  socket.on("toggle_privacy", (data) => {
    const session = Array.from(sessions.values()).find(s => s.host === socket.id);
    if (session) {
      session.isPublic = !session.isPublic;
      io.to(session.code).emit("privacy_toggled", { isPublic: session.isPublic });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const [code, session] of sessions.entries()) {
      if (session.players.has(socket.id)) {
        session.players.delete(socket.id);
        io.to(code).emit("player_left", { id: socket.id });
        
        if (session.players.size === 0) {
          sessions.delete(code);
          console.log(`Session ${code} closed.`);
        } else if (session.host === socket.id) {
          session.host = Array.from(session.players.keys())[0];
        }
      }
    }
  });

  // Relay game actions for MUD
  socket.on("game_action", (data) => {
    const session = Array.from(sessions.values()).find(s => s.players.has(socket.id));
    if (session) {
      socket.to(session.code).emit("player_action", {
        playerId: socket.id,
        playerName: session.players.get(socket.id).name,
        action: data.action
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
