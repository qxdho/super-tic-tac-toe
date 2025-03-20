const socket = io();
let currentRoom = null;
let playerSymbol = null;

// 初始化游戏
function initGame() {
  createBoard();
  setupEventListeners();
}

// 创建棋盘
function createBoard() {
  const container = document.getElementById('game-container');
  container.innerHTML = '';
  
  for (let i = 0; i < 9; i++) {
    const subBoard = document.createElement('div');
    subBoard.className = 'sub-board';
    
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = `${i}-${j}`;
      cell.addEventListener('click', handleCellClick);
      subBoard.appendChild(cell);
    }
    
    container.appendChild(subBoard);
  }
}

// 处理落子点击
function handleCellClick(e) {
  const [boardIndex, cellIndex] = e.target.dataset.index.split('-');
  socket.emit('make_move', currentRoom, boardIndex, cellIndex);
}

// 处理房间创建
document.getElementById('create-room').addEventListener('click', () => {
  const rules = {
    playerLimit: document.getElementById('player-count').value,
    timePerMove: document.getElementById('time-limit').value,
    allowSpectators: document.getElementById('allow-spectators').checked
  };
  socket.emit('create_room', rules, playerName);
});

// 监听游戏状态更新
socket.on('game_update', (data) => {
  updateBoard(data.board);
  updateStatus(data.status);
  updateTimer(data.timeLeft);
});

// 更新棋盘显示
function updateBoard(board) {
  board.forEach((value, index) => {
    const [boardIndex, cellIndex] = index.split('-');
    const cell = document.querySelector(
      `.sub-board:nth-child(${+boardIndex + 1}) .cell:nth-child(${+cellIndex + 1})`
    );
    cell.textContent = value || '';
  });
}

// 显示状态信息
function updateStatus(message) {
  document.getElementById('status').textContent = message;
}

// 更新倒计时
function updateTimer(timeLeft) {
  const timer = document.getElementById('timer');
  timer.textContent = `剩余时间: ${timeLeft}s`;
  timer.style.color = timeLeft < 5 ? '#ff4444' : '#333';
}