// App.js
const boardElement = document.getElementById("gameBoard");
const boardSizeSelect = document.getElementById("boardSize");
const modeSelect = document.getElementById("mode");

const startBtn = document.getElementById("start");
const undoBtn = document.getElementById("undo");
const resetBtn = document.getElementById("reset");

const statusText = document.getElementById("status");

const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");
const drawScoreText = document.getElementById("drawScore");

let board = [];
let history = [];

let boardSize = 3;
let currentPlayer = "X";
let gameMode = "pvp";

let gameActive = true;

let xScore = 0;
let oScore = 0;
let drawScore = 0;

startBtn.addEventListener("click", startGame);
undoBtn.addEventListener("click", undoMove);
resetBtn.addEventListener("click", startGame);

function startGame(){

boardSize = parseInt(boardSizeSelect.value);
gameMode = modeSelect.value;

board = Array(boardSize * boardSize).fill("");
history = [];

currentPlayer = "X";
gameActive = true;

createBoard();

statusText.innerText = "Player X Turn";

}

function createBoard(){

boardElement.innerHTML = "";

boardElement.style.gridTemplateColumns =
`repeat(${boardSize}, 75px)`;

for(let i = 0; i < board.length; i++){

const cell = document.createElement("button");
cell.classList.add("cell");

cell.addEventListener("click", () => playerMove(i));

boardElement.appendChild(cell);

}

}

function playerMove(index){

if(!gameActive) return;

if(board[index] !== "") return;

history.push([...board]);

board[index] = currentPlayer;

renderBoard();

let winner = checkWinner(currentPlayer);

if(winner){
endGame(currentPlayer, winner);
return;
}

if(board.every(cell => cell !== "")){
endDraw();
return;
}

currentPlayer = currentPlayer === "X" ? "O" : "X";

statusText.innerText = `Player ${currentPlayer} Turn`;

if(gameMode === "ai" && currentPlayer === "O"){
setTimeout(aiMove, 400);
}

}

function aiMove(){

if(!gameActive) return;

let move;

if(boardSize === 3){

move = bestMove();

}else{

let empty = board
.map((v,i) => v === "" ? i : null)
.filter(v => v !== null);

move = empty[Math.floor(Math.random()*empty.length)];

}

history.push([...board]);

board[move] = "O";

renderBoard();

let winner = checkWinner("O");

if(winner){
endGame("O", winner);
return;
}

if(board.every(cell => cell !== "")){
endDraw();
return;
}

currentPlayer = "X";

statusText.innerText = "Player X Turn";

}

function renderBoard(){

const cells = document.querySelectorAll(".cell");

cells.forEach((cell,i)=>{
cell.innerText = board[i];
});

}

function checkWinner(player){

// rows
for(let r=0;r<boardSize;r++){

let pattern = [];

for(let c=0;c<boardSize;c++){
pattern.push(r*boardSize + c);
}

if(pattern.every(i => board[i] === player)){
return pattern;
}

}

// columns
for(let c=0;c<boardSize;c++){

let pattern = [];

for(let r=0;r<boardSize;r++){
pattern.push(r*boardSize + c);
}

if(pattern.every(i => board[i] === player)){
return pattern;
}

}

// diagonal
let diag1 = [];
for(let i=0;i<boardSize;i++){
diag1.push(i*boardSize + i);
}

if(diag1.every(i => board[i] === player)){
return diag1;
}

// anti diagonal
let diag2 = [];
for(let i=0;i<boardSize;i++){
diag2.push(i*boardSize + (boardSize-i-1));
}

if(diag2.every(i => board[i] === player)){
return diag2;
}

return null;

}

function endGame(player, winningPattern){

gameActive = false;

statusText.innerText = `Player ${player} Wins!`;

if(player === "X"){
xScore++;
xScoreText.innerText = xScore;
}else{
oScore++;
oScoreText.innerText = oScore;
}

const cells = document.querySelectorAll(".cell");

winningPattern.forEach(index=>{
cells[index].classList.add("win");
});

}

function endDraw(){

gameActive = false;

statusText.innerText = "It's a Draw";

drawScore++;
drawScoreText.innerText = drawScore;

}

function undoMove(){

if(history.length === 0 || !gameActive) return;

board = history.pop();

currentPlayer = currentPlayer === "X" ? "O" : "X";

renderBoard();

statusText.innerText = `Player ${currentPlayer} Turn`;

}

/* ---------- MINIMAX AI (UNBEATABLE) ---------- */

function bestMove(){

let bestScore = -Infinity;
let move;

for(let i=0;i<board.length;i++){

if(board[i] === ""){

board[i] = "O";

let score = minimax(board,false);

board[i] = "";

if(score > bestScore){

bestScore = score;
move = i;

}

}

}

return move;

}

function minimax(newBoard,isMaximizing){

let result = evaluateWinner(newBoard);

if(result !== null) return result;

if(isMaximizing){

let bestScore = -Infinity;

for(let i=0;i<newBoard.length;i++){

if(newBoard[i] === ""){

newBoard[i] = "O";

let score = minimax(newBoard,false);

newBoard[i] = "";

bestScore = Math.max(score,bestScore);

}

}

return bestScore;

}else{

let bestScore = Infinity;

for(let i=0;i<newBoard.length;i++){

if(newBoard[i] === ""){

newBoard[i] = "X";

let score = minimax(newBoard,true);

newBoard[i] = "";

bestScore = Math.min(score,bestScore);

}

}

return bestScore;

}

}

function evaluateWinner(b){

// rows
for(let r=0;r<3;r++){

if(b[r*3] &&
b[r*3] === b[r*3+1] &&
b[r*3] === b[r*3+2]){

return b[r*3] === "O" ? 1 : -1;

}

}

// columns
for(let c=0;c<3;c++){

if(b[c] &&
b[c] === b[c+3] &&
b[c] === b[c+6]){

return b[c] === "O" ? 1 : -1;

}

}

// diagonals
if(b[0] && b[0]===b[4] && b[0]===b[8])
return b[0]==="O"?1:-1;

if(b[2] && b[2]===b[4] && b[2]===b[6])
return b[2]==="O"?1:-1;

if(!b.includes("")) return 0;

return null;

}