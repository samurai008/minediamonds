import './styles.css';
import diamond from './diamond.svg';
import arrow from './arrow.svg';

// Create 8 x 8 board
// true - diamond , false - no diamond
// Randomly assign diamonds

const SIZE_X = 8;
const SIZE_Y = 8;

// global variables
let board;
let score;
let turnedSquares;
let totalDiamonds;
let replayBtn;
let boardEl;
let scoreboardEl;
let winMessage;

const appEl = document.getElementById('app');

// function initialises the board
function initializse() {
  turnedSquares = 0;
  totalDiamonds = 0;

  boardEl = document.createElement('div');
  appEl.appendChild(boardEl);

  // create scoreboard
  if (!scoreboardEl) {
    scoreboardEl = document.createElement('div');
    appEl.appendChild(scoreboardEl);
    scoreboardEl.classList.add('scoreboard');
  }

  // remove replay button on new game
  if (replayBtn) {
    appEl.removeChild(replayBtn);
  }

  // remove win message on new game
  if (winMessage) {
    appEl.removeChild(winMessage);
  }

  // setup the board
  board = {};
  let squareEl;
  let rowEl;
  let randomBool;
  for (let i = 0; i < SIZE_X; i++) {
    rowEl = document.createElement('div');
    boardEl.appendChild(rowEl);
    board[i] = [];
    for (let j = 0; j < SIZE_Y; j++) {
      squareEl = document.createElement('div');
      squareEl.setAttribute('data-col', +j);
      squareEl.setAttribute('data-row', +i);
      squareEl.classList.add('square');
      squareEl.innerHTML = '?';
      squareEl.addEventListener('click', handleSquareClick);
      rowEl.appendChild(squareEl);
      // will there be a diamond
      randomBool = Math.random() >= 0.5;
      board[i][j] = { diamond: randomBool, clicked: false };
      if (randomBool) {
        totalDiamonds = totalDiamonds + 1;
      }
    }
  }

  // update to initial score
  score = SIZE_X * SIZE_Y - turnedSquares;
  scoreboardEl.innerHTML = score;
}

// depth first search to return the angle at which the first diamond is undiscovered
function dfs(row, col) {
  let S = [];
  let Visited = [];
  S.push({ row, col, visited: false });
  let findNearest = false;
  let pointerDeg;

  while (S.length > 0) {
    let v = S.pop();
    let r = v.row;
    let c = v.col;
    if (Visited.filter(v => v === board[r][c]).length === 0) {
      Visited.push(board[r][c]);

      // direction to point to
      if (board[r][c].diamond && !board[r][c].clicked && !findNearest) {
        if (row > r && col === c) {
          // north
          pointerDeg = 0;
        } else if (row < r && col === c) {
          // south
          pointerDeg = 180;
        } else if (row > r && col > c) {
          // north west
          pointerDeg = 315;
        } else if (row < r && col > c) {
          // south west
          pointerDeg = 225;
        } else if (row < r && col < c) {
          // south east
          pointerDeg = 135;
        } else if (row > r && col < c) {
          // north east
          pointerDeg = 45;
        } else if (row === r && col < c) {
          // east
          pointerDeg = 90;
        } else {
          // west
          pointerDeg = 270;
        }

        findNearest = true;
        break;
      }

      // adjacent blocks in the board
      // up
      if (
        board[r - 1] &&
        Visited.filter(v => v === board[r - 1][c]).length === 0
      ) {
        S.push({ row: r - 1, col: c });
      }

      // down
      if (
        board[r + 1] &&
        Visited.filter(v => v === board[r + 1][c]).length === 0
      ) {
        S.push({ row: r + 1, col: c });
      }

      // left
      if (
        board[r][c - 1] &&
        Visited.filter(v => v === board[r][c - 1]).length === 0
      ) {
        S.push({ row: r, col: c - 1 });
      }

      // right
      if (
        board[r][c + 1] &&
        Visited.filter(v => v === board[r][c + 1]).length === 0
      ) {
        S.push({ row: r, col: c + 1 });
      }
    }
  }

  return pointerDeg;
}

function handleSquareClick(e) {
  const el = e.target;
  const row = parseInt(el.getAttribute('data-row'));
  const col = parseInt(el.getAttribute('data-col'));

  // update the score
  if ((!board[row][col].clicked || !board[row][col].diamond) && score > 0) {
    turnedSquares = turnedSquares + 1;
    score = SIZE_X * SIZE_Y - turnedSquares;
  }

  board[row][col].clicked = true;
  if (board[row][col].diamond) {
    // el.innerHTML = '<img src="' + diamond + '" class="diamond" />';
    el.style.backgroundImage = 'url(' + diamond + ')';
    el.style.backgroundSize = '70%';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
    el.innerHTML = '';
    if (!board[row][col].clicked) {
      totalDiamonds = totalDiamonds - 1;
    }
  } else {
    // show hint
    el.innerHTML =
      '<img src="' +
      arrow +
      '" style="width: 70%; transform: rotate(' +
      dfs(row, col) +
      'deg" />';

    // show the arrow for 800ms
    setTimeout(function() {
      el.removeChild(el.childNodes[0]);
      el.innerHTML = '?';
    }, 800);
  }

  // update the scoreboard
  scoreboardEl.innerHTML = score;

  // gameover
  if ((totalDiamonds === 0 || score === 0) && !replayBtn) {
    // if player wins the game
    if (totalDiamonds === 0) {
      winMessage = document.createElement('div');
      winMessage.classList.add('win-msg');
      winMessage.innerHTML = 'You won the game!';
    }

    replayBtn = document.createElement('button');
    replayBtn.setAttribute('id', 'remove_btn');
    replayBtn.setAttribute('class', 'replay-btn');
    replayBtn.innerHTML = 'Replay';
    appEl.appendChild(replayBtn);
    replayBtn.addEventListener('click', function() {
      // reset the game
      appEl.removeChild(boardEl);
      initializse();
    });
  }
}

// when the app loads!
initializse();
