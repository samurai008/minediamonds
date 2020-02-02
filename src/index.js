import "./styles.css";
import diamond from './diamond.svg';

// Create 8 x 8 board
// true - diamond , false - no diamond
// Randomly assign diamonds

const SIZE_X = 8;
const SIZE_Y = 8;

let board = [];
const appEl = document.getElementById('app');
const boardEl = document.createElement('div');

appEl.appendChild(boardEl);

let squareEl;
let rowEl;
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
    board[i][j] = Math.random() >= 0.5;
  }
}

console.log(diamond);

function handleSquareClick(e) {
  const el = e.target;
  const row = el.getAttribute('data-row');
  const col = el.getAttribute('data-col')
  if (board[row][col]) {
    el.innerHTML = '<img src="' + diamond + '" class="diamond" />'
  } else {
    el.innerHTML = '';
  }
}
