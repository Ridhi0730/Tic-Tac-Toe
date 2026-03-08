let boxes = document.querySelectorAll(".box");
let btn = document.querySelector("#btn");
let newcontainer = document.querySelector(".new-container");
let newbtn = document.querySelector("#newbtn");
let win = document.querySelector("#win");

let turnO = true;
count = 0;
let winPatterns  = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]];

let resetGame =() => {
    turnO = true;
    count = 0;
    enableboxes();
    newcontainer.classList.add("hide");    
}


boxes.forEach((box) => {
    box.addEventListener("click",() => {
console.log("box is being clicked");
if(turnO){
    box.innerText = "O";
    turnO = false;
}
else{    
    box.innerText = "X";
    turnO = true;
}

box.disabled = true;
count++;
let isWinner = checkWinner();

if(count === 9 && !isWinner)
{
    gameDraw();
}
    })
});

let gameDraw = () =>
    {
            {
                win.innerText="It's a Draw!";
                newcontainer.classList.remove("hide");
                disableboxes();
            
        }
    }

let disableboxes =() => {
    for(let box of boxes){
     box.disabled = true;
    }
 }
 
 let enableboxes =() => {
     for(let box of boxes){
      box.disabled = false;
      box.innerText = "";
     }
  }

 
const showWinner = (winner) => {
    win.innerText = `Congratulations, the winner is ${winner}`;
    newcontainer.classList.remove("hide");
};

const checkWinner = () => {
    for(let pattern of winPatterns){
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val != "" && pos2val != "" && pos3val != ""){
            if(pos1val === pos2val && pos2val === pos3val){
                console.log(`winner is ${pos1val}`);
                disableboxes();
                showWinner(pos1val);
                return true;
                
            }
        }
    }
}

// function bestMove() {
//     let bestScore = -Infinity;
// let bestMove;

// for(let i = 0; i<3; i++) {
//     for(let j = 0; j<3; j++) {
//         // is the spot available

//         if(board[i] [j] == '') {
//             board[i] [j] = ai;
//             let score = minimax(board);
//             board[i] [j] = '';
//             if(score > bestScore) {
//                 bestScore = score;
//                 bestMove = {i, j};
//             }
//         }
//     }
// }
// board[bestMove.i][bestMove.j] = ai;
// currentPlayer = human;
// }

// function minimax(board) {
//     return 1;
// }


btn.addEventListener("click",resetGame);
newbtn.addEventListener("click",resetGame);