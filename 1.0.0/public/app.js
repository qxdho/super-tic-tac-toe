const socket = io();
const globalBoard = document.getElementById('global-board');
const turnDisplay = document.getElementById('turn-display');
const resetBtn = document.getElementById('reset-btn');

let activeBoardIndex = null;

// 初始化全局棋盘
function initGlobalBoard() {
    globalBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const localBoard = document.createElement('div');
        localBoard.className = 'local-board';
        localBoard.dataset.boardIndex = i;
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.cellIndex = j;
            cell.addEventListener('click', () => handleCellClick(i, j));
            localBoard.appendChild(cell);
        }
        globalBoard.appendChild(localBoard);
    }
}

// 处理落子事件
function handleCellClick(boardIndex, cellIndex) {
    if (activeBoardIndex !== null && activeBoardIndex !== boardIndex) return;
    socket.emit('move', { boardIndex, cellIndex });
}

// 更新游戏状态
socket.on('update', (gameState) => {
    gameState.localBoards.forEach((board, boardIndex) => {
        const localBoard = document.querySelector(`.local-board[data-board-index="${boardIndex}"]`);
        localBoard.querySelectorAll('.cell').forEach((cell, cellIndex) => {
            cell.textContent = board.cells[cellIndex];
            cell.classList.remove('x', 'o', 'disabled');
            if (board.cells[cellIndex]) {
                cell.classList.add(board.cells[cellIndex].toLowerCase());
            }
        });

        // 处理棋盘胜利状态
        if (board.winner) {
            localBoard.style.borderColor = board.winner === 'X' ? '#e74c3c' : '#2ecc71';
            drawWinLine(localBoard, board.winPattern);
            localBoard.querySelectorAll('.cell').forEach(cell => {
                cell.classList.add('disabled');
            });
        }
    });

    // 更新全局状态
    turnDisplay.textContent = `轮到 ${gameState.currentPlayer}`;
    activeBoardIndex = gameState.nextActiveBoard;

    // 高亮可点击区域
    document.querySelectorAll('.local-board').forEach(board => {
        board.classList.remove('active');
    });
    if (activeBoardIndex !== null) {
        document.querySelector(`.local-board[data-board-index="${activeBoardIndex}"]`)
            .classList.add('active');
    }
});

// 处理游戏结束
socket.on('gameOver', (result) => {
    alert(result.message);
    initGlobalBoard();
});

// 重置游戏
resetBtn.addEventListener('click', () => {
    socket.emit('reset');
});

// 绘制胜利连线
function drawWinLine(boardElement, pattern) {
    const line = document.createElement('div');
    line.className = 'win-line';
    
    // 根据不同的胜利模式调整连线位置
    switch(pattern) {
        case 0: // 横线顶部
            line.style.width = '100%';
            line.style.top = '33%';
            break;
        case 1: // 横线中部
            line.style.width = '100%';
            line.style.top = '33%';
            break;
        case 2: // 横线底部
            line.style.width = '100%';
            line.style.top = '66%';
            break;
        case 3: // 垂直左侧
            line.style.height = '100%';
            line.style.left = '33%';
            line.style.transform = 'rotate(90deg)';
            break;
        case 4: // 垂直中间
            line.style.height = '100%';
            line.style.left = '33%';
            line.style.transform = 'rotate(90deg)';
            break;
        case 5: // 垂直右侧
            line.style.height = '100%';
            line.style.left = '66%';
            line.style.transform = 'rotate(90deg)';
            break;
        case 6: // 主对角线
            line.style.width = '141%';
            line.style.top = '50%';
            line.style.left = '-20%';
            line.style.transform = 'rotate(45deg)';
            break;
        case 7: // 副对角线
            line.style.width = '141%';
            line.style.top = '50%';
            line.style.left = '120%';
            line.style.transform = 'rotate(-45deg)';
            break;
    }
    
    boardElement.appendChild(line);
}

// 初始化
initGlobalBoard();