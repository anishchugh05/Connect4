// script.js
const board = document.getElementById("game-board");
const restartButton = document.getElementById("restart-button");
const startGameButton = document.getElementById("start-game");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const turnMessage = document.getElementById("turn-message");

const rows = 6;
const columns = 7;
let currentPlayer = "red";
let currentPlayerName = "";
let gameBoard = Array(rows).fill().map(() => Array(columns).fill(null));

function createBoard() {
  board.innerHTML = "";
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => handleClick(row, col));
      board.appendChild(cell);
    }
  }
}

function handleClick(row, col) {
  // Find the first empty row in the column
  for (let r = rows - 1; r >= 0; r--) {
    if (!gameBoard[r][col]) {
      gameBoard[r][col] = currentPlayer;
      updateBoard();
      if (checkWin(r, col)) {
        alert(`${currentPlayerName} wins!`);
        restartButton.style.display = "inline-block";
        return;
      }
      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      currentPlayerName = currentPlayer === "red" ? player1Input.value : player2Input.value;
      turnMessage.textContent = `${currentPlayerName}'s Turn`;
      break;
    }
  }
}

function updateBoard() {
  const cells = board.querySelectorAll(".cell");
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = cells[index++];
      if (gameBoard[row][col]) {
        cell.classList.add(gameBoard[row][col]);
      }
    }
  }
}

function checkWin(row, col) {
  const directions = [
    [[-1, 0], [1, 0]], // Vertical
    [[0, -1], [0, 1]], // Horizontal
    [[-1, -1], [1, 1]], // Diagonal /
    [[-1, 1], [1, -1]]  // Diagonal \
  ];

  for (let [[r1, c1], [r2, c2]] of directions) {
    let count = 1;
    count += checkDirection(row, col, r1, c1);
    count += checkDirection(row, col, r2, c2);
    if (count >= 4) {
      return true;
    }
  }
  return false;
}

function checkDirection(row, col, rOffset, cOffset) {
  let count = 0;
  let r = row + rOffset;
  let c = col + cOffset;
  while (r >= 0 && r < rows && c >= 0 && c < columns && gameBoard[r][c] === currentPlayer) {
    count++;
    r += rOffset;
    c += cOffset;
  }
  return count;
}

function resetGame() {
  gameBoard = Array(rows).fill().map(() => Array(columns).fill(null));
  currentPlayer = "red";
  currentPlayerName = player1Input.value || "Player 1";
  turnMessage.textContent = `${currentPlayerName}'s Turn`;
  restartButton.style.display = "none";
  updateBoard();
}

startGameButton.addEventListener("click", () => {
  if (player1Input.value && player2Input.value) {
    document.getElementById("player-names").style.display = "none";
    createBoard();
    currentPlayerName = player1Input.value;
    turnMessage.textContent = `${currentPlayerName}'s Turn`;
  } else {
    alert("Please enter both player names!");
  }
});

restartButton.addEventListener("click", resetGame);
