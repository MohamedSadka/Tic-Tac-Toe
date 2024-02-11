
let currentPlayer = "X";
let numOfRows = 3;
let turns = numOfRows ** 2;
let turnsCounter = 0;

const createBoardArray = () => {
  let board = [];

  for (let row = 0; row < numOfRows; row++) {
    board.push(Array.from({ length: numOfRows }, () => "_"));
  }
  return board;
};

let board = createBoardArray();

const resetButton = document.getElementById("reset");

const getCellPlacement = (index, numberOfRows) => {
  const row = Math.floor(index / numberOfRows);
  const col = index % numberOfRows;

  return [row, col];
};

const checkRows = (currentPlayer) => {
  let column = 0;

  for (let row = 0; row < numOfRows; row++) {
    while (column < numOfRows) {
      if (board[row][column] !== currentPlayer) {
        column = 0;
        break;
      }
      column++;
    }

    if (column === numOfRows) {
      return true;
    }
  }
};

const checkColumns = () => {
  let row = 0;

  for (let column = 0; column < numOfRows; column++) {
    while (row < numOfRows) {
      if (board[row][column] !== currentPlayer) {
        row = 0;
        break;
      }
      row++;
    }

    if (row === numOfRows) {
      return true;
    }
  }
};

const checkDiagonals = () => {
  let count = 0;

  while (count < numOfRows) {
    if (board[count][count] !== currentPlayer) {
      count = 0;
      break;
    }
    count++;
  }

  if (count === numOfRows) {
    return true;
  }
};

const checkReverseDiagonals = () => {
  let count = 0;

  while (count < numOfRows) {
    if (board[count][numOfRows - 1 - count] !== currentPlayer) {
      count = 0;
      break;
    }
    count++;
  }

  if (count === numOfRows) {
    return true;
  }
};

const checkWins = (currentPlayer) => {
  if (checkRows(currentPlayer)) return true;

  if (checkColumns(currentPlayer)) return true;

  if (checkDiagonals(currentPlayer)) return true;

  if (checkReverseDiagonals(currentPlayer)) return true;
};

const resetBoard = () => {
  const boardElement = document.querySelector(".board");
  if (boardElement) {
    boardElement.remove(); // Remove the board element if it exists
  }
  turns = numOfRows ** 2; // Update turns based on the new board size
  createBoard(numOfRows); // Create a new board with the updated size
  board = createBoardArray(); // Update the board array with the new size
  currentPlayer = "X";
  turnsCounter = 0;
};



const runWinEvent = (currentPlayer) => {
  setTimeout(() => {
    alert(`player ${currentPlayer} won!`);
    resetBoard();
  }, 100);
};

const runDrawEvent = () => {
  setTimeout(() => {
    alert("Draw");
    resetBoard();
  }, 100);
};

const drawCurrentPlayer = (cell, currentPlayer) => {
  cell.querySelector(".value").innerText = currentPlayer;
  cell.classList.add(`cell--${currentPlayer}`);
};

const clickHandlerClick = (event, index) => {
  const cell = event.target;

  const [row, col] = getCellPlacement(index, numOfRows);

  if (board[row][col] === "_") {
    turnsCounter++;
    board[row][col] = currentPlayer;

    drawCurrentPlayer(cell, currentPlayer);

    if (checkWins(currentPlayer)) {
      runWinEvent(currentPlayer);
    } else {
      (turnsCounter === turns) && runDrawEvent();
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  }
};

let submitButton = document.querySelector(".submit");

submitButton.addEventListener("click", () => {
  const boardType = document.querySelector(".board-type").value;
  const newNumOfRows = parseInt(boardType, 10);
  if (!isNaN(newNumOfRows) && newNumOfRows > 2) {
    numOfRows = newNumOfRows; // Update the global variable
    document.documentElement.style.setProperty("--grid-rows", numOfRows);
    resetBoard(); // Reset the board with the new size
  } else {
    alert("Please enter a valid number of rows.");
  }
});

const createBoard = (numOfRows) => {
  const container = document.querySelector(".container");

  // Remove previous board
  const existingBoard = container.querySelector(".board");
  if (existingBoard) {
    container.removeChild(existingBoard);
  }

  let board = document.createElement("div");
  board.classList.add("board");

  for (let i = 0; i < numOfRows ** 2; i++) {
    const cellElementString = `<div class="cell" role="button" tabindex="${i+1}"><span class="value"></span></div>`;
    let cellElement = document.createRange().createContextualFragment(cellElementString);
    cellElement.querySelector(".cell").onclick = event => clickHandlerClick(event, i);
    cellElement.querySelector(".cell").onkeydown = event => event.key === "Enter" ?  clickHandlerClick(event, i): true ;

    board.appendChild(cellElement);
  }

  container.insertAdjacentElement("afterbegin", board);

  // Clear input field
  document.querySelector(".board-type").value = "";
};

resetButton.addEventListener("click", resetBoard);

createBoard(numOfRows);
