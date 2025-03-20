const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('create_room', (rules, playerName) => {
    const roomId = require('uuid').v4().slice(0, 6);
    const room = {
      id: roomId,
      players: new Map([[socket.id, playerName]]),
      spectators: new Set(),
      board: Array(81).fill(null),
      rules: {
        playerLimit: rules.playerLimit || config.MAX_PLAYERS,
        timePerMove: rules.timePerMove || config.DEFAULT_TIME_LIMIT
      },
      currentPlayer: 0,
      state: 'waiting'
    };
    rooms.set(roomId, room);
    socket.join(roomId);
    socket.emit('room_created', roomId);
  });

  socket.on('join_room', (roomId, playerName) => {
    const room = rooms.get(roomId);
    if (!room || room.players.size >= room.rules.playerLimit) {
      return socket.emit('error', '房间不可用');
    }
    room.players.set(socket.id, playerName);
    socket.join(roomId);
    io.to(roomId).emit('room_update', Object.fromEntries(room.players));
  });

  socket.on('make_move', (roomId, index) => {
    const room = rooms.get(roomId);
    if (!room || room.board[index] !== null) return;

    const players = Array.from(room.players.keys());
    const currentPlayer = players[room.currentPlayer % players.length];
    
    room.board[index] = currentPlayer;
    room.currentPlayer += 1;
    
    io.to(roomId).emit('game_update', {
      board: room.board,
      currentPlayer: room.currentPlayer
    });
  });
});

server.listen(config.PORT, () => {
  console.log(`服务器运行在端口 ${config.PORT}`);
});