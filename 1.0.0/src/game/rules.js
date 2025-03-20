// 检查胜利条件（3x3棋盘）
function checkWin(board, symbol) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // 行
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // 列
      [0, 4, 8], [2, 4, 6]             // 对角线
    ];
  
    return lines.some(line => 
      line.every(index => board[index] === symbol)
    );
  }
  
  // 检查移动合法性
  function isValidMove(room, boardIndex, cellIndex) {
    if (room.nextBoard !== null && boardIndex !== room.nextBoard) return false;
    if (room.board[boardIndex * 9 + cellIndex] !== null) return false;
    return true;
  }
  
  module.exports = { checkWin, isValidMove };