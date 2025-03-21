const express = require('express');
const http = require('http');
const path = require('path');
const { Game } = require('./game');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",  // 生产环境请替换为实际域名
    methods: ["GET", "POST"]
  }
});

// 初始化游戏实例
const game = new Game();

// 静态文件服务配置
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath, {
  extensions: ['html'],
  redirect: false
}));

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log('新连接:', socket.id);

  // 发送初始游戏状态
  socket.emit('update', game.getGameState());

  // 处理玩家落子
  socket.on('move', ({ boardIndex, cellIndex }) => {
    if (game.makeMove(boardIndex, cellIndex)) {
      io.emit('update', game.getGameState());
      if (game.globalWinner) {
        io.emit('gameOver', {
          message: game.globalWinner === '平局' 
            ? '平局！' 
            : `玩家 ${game.globalWinner} 获胜！`
        });
      }
    }
  });

  // 处理重置请求
  socket.on('reset', () => {
    game.reset();
    io.emit('update', game.getGameState());
  });

  // 断开连接处理
  socket.on('disconnect', () => {
    console.log('断开连接:', socket.id);
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器内部错误');
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`静态文件路径: ${publicPath}`);
});