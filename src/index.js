import "./styles.css";
import diamond from './diamond.svg';
import arrow from './arrow.svg';

// Create 8 x 8 board
// true - diamond , false - no diamond
// Randomly assign diamonds

const SIZE_X = 8;
const SIZE_Y = 8;

let board;
let score;
let turnedSquares;
let totalDiamonds;
let replayBtn;
const appEl = document.getElementById('app');
let boardEl;
let scoreboardEl;

function initializse() {
  turnedSquares = 0;
  totalDiamonds = 0;

  boardEl = document.createElement('div');
  scoreboardEl = document.createElement('div');

  scoreboardEl.classList.add('scoreboard');

  appEl.appendChild(boardEl);
  appEl.appendChild(scoreboardEl);

  if (replayBtn) {
    appEl.removeChild(replayBtn);
  }

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
      squareEl.setAttribute('data-col', + j);
      squareEl.setAttribute('data-row', + i);
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

  score = (SIZE_X * SIZE_Y) - turnedSquares;
  scoreboardEl.innerHTML = score;
}

// implement gameover
function dfs(row, col, paths = []) {
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

      // up
      if (board[r - 1] && Visited.filter(v => v === board[r - 1][c]).length === 0) {
        S.push({ row: r - 1, col: c});
      }

      // down
      if (board[r + 1] && Visited.filter(v => v === board[r + 1][c]).length === 0) {
        S.push({ row: r + 1, col: c });
      }

      // left
      if (board[r][c - 1] && Visited.filter(v => v === board[r][c - 1]).length === 0) {
        S.push({ row: r, col: c - 1 });
      }

      // right
      if (board[r][c + 1] && Visited.filter(v => v === board[r][c + 1]).length === 0) {
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
  if (!board[row][col].clicked) {
    turnedSquares = turnedSquares + 1;
    score = (SIZE_X * SIZE_Y) - turnedSquares;
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
    el.innerHTML = '<img src="' + arrow + '" style="width: 70%; transform: rotate(' + dfs(row, col) + 'deg" />';
    setTimeout(function () {
      el.removeChild(el.childNodes[0]);
      el.innerHTML = '?';
    }, 800);
  }

  scoreboardEl.innerHTML = score;

  if (totalDiamonds === 0 || score === 0) {
    replayBtn = document.createElement('button');
    replayBtn.setAttribute('id', 'remove_btn');
    replayBtn.setAttribute('class', 'replay-btn')
    replayBtn.innerHTML = 'Replay';
    appEl.appendChild(replayBtn);
    appEl.removeChild(boardEl);
    replayBtn.addEventListener('click', function () {
      appEl.removeChild(scoreboardEl);
      initializse();
    })
  }
}

// when the app loads!
initializse();