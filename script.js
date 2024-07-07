const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const restartBtn = document.querySelector('.restart');
const modeSelect = document.getElementById('mode');
const turnBoxes = document.querySelectorAll('.turn-box');
const turnBg = document.querySelector('.bg');

let currentPlayer = 'X';
let gameState = Array(9).fill("");
const aiPlayer = 'O'; // AI is 'O'
const humanPlayer = 'X'; // Human is 'X'
let gameMode = modeSelect.value;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

modeSelect.addEventListener('change', (e) => {
    gameMode = e.target.value;
    restartGame();
});

const handleCellClick = (e) => {
    const index = e.target.getAttribute('data-index');

    if (gameState[index] !== "" || checkWinner()) return;

    gameState[index] = currentPlayer;
    e.target.innerText = currentPlayer;
    changeTurn();

    if (checkWinner()) {
        statusText.innerText = `${currentPlayer} wins!`;
        highlightWinningCells();
    } else if (!gameState.includes("")) {
        statusText.innerText = "It's a draw!";
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (gameMode === 'ai' && currentPlayer === aiPlayer) {
            setTimeout(aiMove, 500); // Delay AI move for better UX
        } else {
            statusText.innerText = `Player ${currentPlayer}'s turn`;
        }
    }
};

const aiMove = () => {
    const bestMove = minimax(gameState, aiPlayer);
    gameState[bestMove.index] = aiPlayer;
    cells[bestMove.index].innerText = aiPlayer;
    changeTurn();

    if (checkWinner()) {
        statusText.innerText = `${aiPlayer} wins!`;
        highlightWinningCells();
    } else if (!gameState.includes("")) {
        statusText.innerText = "It's a draw!";
    } else {
        currentPlayer = humanPlayer;
        statusText.innerText = `Player ${currentPlayer}'s turn`;
    }
};

const minimax = (newGameState, player) => {
    const availableMoves = newGameState.reduce((acc, cell, index) => {
        if (cell === "") acc.push(index);
        return acc;
    }, []);

    if (checkWinnerState(newGameState, humanPlayer)) {
        return { score: -10 };
    } else if (checkWinnerState(newGameState, aiPlayer)) {
        return { score: 10 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};
        move.index = availableMoves[i];
        newGameState[availableMoves[i]] = player;

        if (player === aiPlayer) {
            const result = minimax(newGameState, humanPlayer);
            move.score = result.score;
        } else {
            const result = minimax(newGameState, aiPlayer);
            move.score = result.score;
        }

        newGameState[availableMoves[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
};

const checkWinnerState = (state, player) => {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (state[a] === player && state[b] === player && state[c] === player) {
            return true;
        }
    }
    return false;
};

const checkWinner = () => {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    return roundWon;
};

const highlightWinningCells = () => {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            cells[a].style.backgroundColor = '#08D9D6'; // Updated color for winning cells
            cells[b].style.backgroundColor = '#08D9D6'; 
            cells[c].style.backgroundColor = '#08D9D6'; 
            break;
        }
    }
};

const restartGame = () => {
    gameState = Array(9).fill("");
    currentPlayer = humanPlayer;
    statusText.innerText = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.innerText = "";
        cell.style.backgroundColor = ''; 
    });


    turnBoxes.forEach(box => box.classList.remove('active'));
    if (currentPlayer === "X") {
        turnBoxes[0].classList.add('active'); 
        turnBg.style.left = "0"; 
    } else {
        turnBoxes[1].classList.add('active');
        turnBg.style.left = "85px";
    }
};

const changeTurn = () => {
    turnBoxes.forEach(box => box.classList.toggle('active'));
    turnBg.style.left = turnBg.style.left === "85px" ? "0" : "85px";
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

statusText.innerText = `Player ${currentPlayer}'s turn`;