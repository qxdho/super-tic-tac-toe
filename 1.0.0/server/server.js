const express = require('express');
const http = require('http');
const { Game } = require('./game');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",  // 允许跨域请求（生产环境请配置具体域名）
    methods: ["GET", "POST"]
  }
});

// 存储游戏实例
const game = new Game();

// 提供静态文件服务
app.use(express.static('../public'));  // 注意路径指向版本目录下的 public

// Socket.IO 事件处理
io.on('connection', (socket) => {
  console.log('新玩家连接:', socket.id);

  // 发送当前游戏状态
  socket.emit('update', game.getGameState());

  // 处理玩家落子
  socket.on('move', ({ boardIndex, cellIndex }) => {
    if (game.makeMove(boardIndex, cellIndex)) {
      io.emit('update', game.getGameState());
      
      // 检查全局胜负
      if (game.globalWinner) {
        io.emit('gameOver', {
          message: game.globalWinner === '平局' 
            ? '游戏平局！' 
            : `玩家 ${game.globalWinner} 获胜！`
        });
      }
    }
  });

  // 处理游戏重置
  socket.on('reset', () => {
    game.reset();
    io.emit('update', game.getGameState());
  });

  // 断开连接处理
  socket.on('disconnect', () => {
    console.log('玩家断开:', socket.id);
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});