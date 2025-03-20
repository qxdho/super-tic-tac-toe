const socket = io();

// 处理房间创建
socket.on('room_created', (roomId) => {
  currentRoom = roomId;
  window.history.pushState({}, '', `/${roomId}`);
  document.getElementById('lobby').style.display = 'none';
  document.getElementById('game').style.display = 'block';
});

// 处理房间加入
socket.on('room_update', (players) => {
  const playerList = document.getElementById('player-list');
  playerList.innerHTML = Object.values(players)
    .map(name => `<div class="player-item">${name}</div>`)
    .join('');
});

// 处理错误提示
socket.on('error', (message) => {
  alert(message);
});

// 处理游戏胜利
socket.on('game_win', (winner) => {
  alert(`玩家 ${winner} 获胜！`);
  resetGame();
});

// 处理观战消息
socket.on('spectator_message', (message) => {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML += `<div>${message}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
});