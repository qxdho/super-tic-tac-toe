const { initGame, handleMove } = require('../game/board');
const rooms = new Map();

// Socket.IO 事件处理
module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log(`新连接: ${socket.id}`);

    // 创建房间
    socket.on('create_room', (rules, playerName) => {
      const room = initGame(rules);
      room.players.set(socket.id, playerName);
      rooms.set(room.id, room);
      socket.join(room.id);
      socket.emit('room_created', room.id);
      updateRoom(room);
    });

    // 加入房间
    socket.on('join_room', (roomId, playerName) => {
      const room = rooms.get(roomId);
      if (!room || room.players.size >= room.rules.playerLimit) {
        return socket.emit('error', '房间不可用');
      }
      room.players.set(socket.id, playerName);
      socket.join(roomId);
      updateRoom(room);
    });

    // 处理观战
    socket.on('spectate_room', (roomId) => {
      const room = rooms.get(roomId);
      if (!room || !room.rules.allowSpectators) {
        return socket.emit('error', '观战不可用');
      }
      room.spectators.add(socket.id);
      socket.join(roomId);
      socket.emit('spectate_start', room);
    });

    // 处理落子
    socket.on('make_move', (roomId, boardIndex, cellIndex) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const currentPlayer = Array.from(room.players.keys())[room.currentPlayerIndex];
      if (socket.id !== currentPlayer) {
        return socket.emit('error', '未轮到你下棋');
      }

      if (handleMove(room, boardIndex, cellIndex)) {
        updateRoom(room);
        checkGameOver(room);
      }
    });

    // 处理聊天
    socket.on('chat_message', (roomId, message) => {
      const room = rooms.get(roomId);
      if (!room) return;
      io.to(roomId).emit('new_message', {
        playerName: room.players.get(socket.id),
        message
      });
    });

    // 断开连接处理
    socket.on('disconnect', () => {
      rooms.forEach(room => {
        if (room.players.has(socket.id)) {
          room.players.delete(socket.id);
          if (room.players.size === 0) {
            rooms.delete(room.id);
          } else {
            updateRoom(room);
          }
        }
        if (room.spectators.has(socket.id)) {
          room.spectators.delete(socket.id);
        }
      });
    });

    // 辅助函数：更新房间状态
    function updateRoom(room) {
      io.to(room.id).emit('room_update', {
        players: Object.fromEntries(room.players),
        spectators: room.spectators.size,
        board: room.board,
        nextBoard: room.nextBoard,
        state: room.state
      });
    }

    // 辅助函数：检查游戏结束
    function checkGameOver(room) {
      // 实现全局胜利判断逻辑
      // 遍历所有小棋盘的胜利状态
      // 如果满足大棋盘胜利条件，则触发游戏结束事件
    }
  });
};