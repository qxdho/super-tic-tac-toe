class Game {
    constructor() {
      this.localBoards = Array.from({ length: 9 }, () => ({
        cells: Array(9).fill(''),
        winner: null,
        winPattern: null
      }));
      this.currentPlayer = 'X';
      this.nextActiveBoard = null;
      this.globalWinner = null;
    }
  
    // 处理玩家落子
    makeMove(boardIndex, cellIndex) {
      if (this.globalWinner) return false;
      if (this.nextActiveBoard !== null && this.nextActiveBoard !== boardIndex) return false;
      
      const board = this.localBoards[boardIndex];
      if (board.winner || board.cells[cellIndex] !== '') return false;
  
      // 更新棋盘状态
      board.cells[cellIndex] = this.currentPlayer;
      
      // 检查当前棋盘是否获胜
      const winPattern = this.checkWin(board.cells);
      if (winPattern) {
        board.winner = this.currentPlayer;
        board.winPattern = winPattern;
      }
  
      // 设置下一个活跃棋盘
      this.nextActiveBoard = this.localBoards[cellIndex]?.winner 
        ? null 
        : cellIndex;
  
      // 切换玩家
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  
      // 检查全局胜负
      this.checkGlobalWin();
      return true;
    }
  
    // 检查单个棋盘胜负
    checkWin(cells) {
      const lines = [
        [0,1,2], [3,4,5], [6,7,8],  // 行
        [0,3,6], [1,4,7], [2,5,8],  // 列
        [0,4,8], [2,4,6]            // 对角线
      ];
  
      for (const [index, pattern] of lines.entries()) {
        const [a, b, c] = pattern;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
          return { pattern: index, cells: [a, b, c] };
        }
      }
      return null;
    }
  
    // 检查全局胜负
    checkGlobalWin() {
      const globalCells = this.localBoards.map(b => b.winner || '');
      const winPattern = this.checkWin(globalCells);
      
      if (winPattern) {
        this.globalWinner = this.localBoards[winPattern.cells[0]].winner;
      } else if (this.localBoards.every(b => b.winner)) {
        this.globalWinner = '平局';
      }
    }
  
    // 重置游戏
    reset() {
      this.localBoards = Array.from({ length: 9 }, () => ({
        cells: Array(9).fill(''),
        winner: null,
        winPattern: null
      }));
      this.currentPlayer = 'X';
      this.nextActiveBoard = null;
      this.globalWinner = null;
    }
  
    // 获取当前游戏状态
    getGameState() {
      return {
        localBoards: this.localBoards.map(b => ({
          cells: [...b.cells],
          winner: b.winner,
          winPattern: b.winPattern
        })),
        currentPlayer: this.currentPlayer,
        nextActiveBoard: this.nextActiveBoard,
        globalWinner: this.globalWinner
      };
    }
  }
  
  module.exports = { Game };