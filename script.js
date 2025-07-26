const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const modeToggle = document.querySelectorAll('input[name="mode"]');

let cells = [];
let currentPlayer = 'X';
let gameActive = true;
let vsAI = false;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

modeToggle.forEach(radio => {
  radio.addEventListener('change', () => {
    vsAI = document.querySelector('input[name="mode"]:checked').value === 'ai';
    startGame();
  });
});

function startGame() {
  board.innerHTML = '';
  statusText.textContent = "Player X's turn";
  currentPlayer = 'X';
  gameActive = true;
  cells = Array(9).fill('');

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || cells[index] !== '') return;

  makeMove(index, currentPlayer);
  if (checkWin(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  } else if (cells.every(cell => cell !== '')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (vsAI && currentPlayer === 'O') {
    setTimeout(() => {
      aiMove();
    }, 500);
  }
}

function makeMove(index, player) {
  cells[index] = player;
  board.children[index].textContent = player;
}

function aiMove() {
  if (!gameActive) return;

  const emptyIndices = cells
    .map((val, i) => (val === '' ? i : null))
    .filter(i => i !== null);

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, 'O');

  if (checkWin('O')) {
    statusText.textContent = 'AI wins!';
    gameActive = false;
  } else if (cells.every(cell => cell !== '')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
  } else {
    currentPlayer = 'X';
    statusText.textContent = "Player X's turn";
  }
}

function checkWin(player) {
  return winPatterns.some(pattern => 
    pattern.every(index => cells[index] === player)
  );
}

restartBtn.addEventListener('click', startGame);

startGame();
