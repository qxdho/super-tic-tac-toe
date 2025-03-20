const { checkWin } = require('./rules');

// 初始化房间
function initGame(rules) {
  return {
    id: generateRoomId(),
    players: new Map(),
    spectators: new Set(),
    board: Array(81).fill(null),
    rules: {
      playerLimit: rules.playerLimit || 2,
      timePerMove: rules.timePerMove || 20,
      allowSpectators: rules.allowSpectators || false
    },
    currentPlayerIndex: 0,
    nextBoard: null,
    timer: null,
    state: 'waiting'
  };
}

// 生成房间ID
function generateRoomId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// 处理玩家移动
function handleMove(room, boardIndex, cellIndex) {
  // 检查移动是否合法
  if (room.nextBoard !== null && boardIndex !== room.nextBoard) return false;
  if (room.board[boardIndex * 9 + cellIndex] !== null) return false;

  // 更新棋盘
  const symbol = Array.from(room.players.values())[room.currentPlayerIndex];
  room.board[boardIndex * 9 + cellIndex] = symbol;

  // 检查小棋盘胜利
  const subBoard = room.board.slice(boardIndex*9, (boardIndex+1)*9);
  if (checkWin(subBoard, symbol)) {
    // 标记小棋盘胜利
  }

  // 切换玩家
  room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.size;
  room.nextBoard = cellIndex; // 限制下一个棋盘

  return true;
}

module.exports = { initGame, handleMove };