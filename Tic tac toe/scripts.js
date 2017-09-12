/*
Still need to do:
	Score is kept and displayed - easy.
	AI turn.
 */

const board = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
const WINNINGCOMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];
const score = [0, 0]; // index 0 is player 1, index 1 is player 2 or computer player
const PLAYERS = ["X", "O"]; // index 0 is player 1, index 1 is player 2 or computer player
let isPcAPlayer;
let currentPlayer = Math.round(Math.random()); // 0 or 1, also initialises who goes first.
const GAMECONTAINERS = document.querySelectorAll(".game-container > section");
let isGameFinished = false;

// Play events:
const BOXES = document.querySelectorAll(".game-grid div");
for (let i=0; i<9; i++) {
	BOXES[i].addEventListener('click', playerMove);
}

// How many players
document.getElementById("one-player").addEventListener("click", () => setNumberOfPlayers(1));
document.getElementById("two-players").addEventListener("click", () => setNumberOfPlayers(2));

// Player 1 icon choice.
document.getElementById("X").addEventListener("click", () => setPlayerOneIcon("X"));
document.getElementById("O").addEventListener("click", () => setPlayerOneIcon("O"));
document.getElementById("back").addEventListener("click", () => animationFadeTo(GAMECONTAINERS[1], GAMECONTAINERS[0]));

// Turn
const turnSection = document.getElementById("turn-section");
const turn = document.getElementById("turn");

function setNumberOfPlayers(num) {
	if (num === 2) {
		document.getElementById("player-1-only").textContent = "Player 1: "; // prefix for icon choice screen
		isPcAPlayer = false;	
	} else {
		isPcAPlayer = true;
	}
	animationFadeTo(GAMECONTAINERS[0], GAMECONTAINERS[1]);
}

function setPlayerOneIcon(icon) {
	if (icon === "O") {
		[PLAYERS[0], PLAYERS[1]] = ["O", "X"];	
	}
	animationFadeTo(GAMECONTAINERS[1], GAMECONTAINERS[2]);
	animationFadeTo(null, turnSection);
	updateDisplay();
    ifStartPcTurn();
}

function animationFadeTo(tagHide, tagShow, delay=1000) {
	if (tagHide) {
		tagHide.classList.add("hide-opacity");
		setTimeout(() => tagHide.classList.add("hide-z-index"), delay);
	}
	if (tagShow) {
		setTimeout(() => tagShow.classList.remove("hide-z-index"), delay);
		setTimeout(() => tagShow.classList.remove("hide-opacity"), delay);
	}
}

function play() {
	displayBoard(); // update the board
	if (hasWon(currentPlayer)) { // check if win
		setTimeout(winAnimation, 1000);
		setTimeout(reset, 4000);
		isGameFinished = true;
		return;
	} else if (isGameOver()) { // check if game over
        setTimeout(gameOverAnimation, 1000);
		setTimeout(reset, 4000);
		isGameFinished = true;
		return;
	}
	changePlayerIndex(); // update player index
	displayPlayerTurn(); // update display with new player index
    ifStartPcTurn(1000); // if pc's turn, pc makes a move.
}

function winAnimation() {
	document.getElementById("player-win").textContent = getPlayerTurnText(); 
	animationFadeTo(GAMECONTAINERS[2], GAMECONTAINERS[4]);
	animationFadeTo(GAMECONTAINERS[3]);
}

function gameOverAnimation() {
	animationFadeTo(GAMECONTAINERS[2], GAMECONTAINERS[5]);
	animationFadeTo(GAMECONTAINERS[3]);
}

function changePlayerIndex() {
	currentPlayer = ++currentPlayer % 2;
}

function playerMove() {
    if ((isPcAPlayer && currentPlayer !== 1 || !isPcAPlayer) && move(parseInt(this.id[1]))) { // if not pc's turn and valid move
        play();
    }
}

function move(boxIndex) {
    if (isGameFinished || board[boxIndex]) {
        return false;
    }
    board[boxIndex] = PLAYERS[currentPlayer];
    return true;
}

function hasWon(playerIndex) {
	for (let winCombo of WINNINGCOMBINATIONS) {
		let hasWon = true;
		for (let i of winCombo) {
			if (board[i] !== PLAYERS[playerIndex]) {
				hasWon = false;
				break;
			}
		}
		if (hasWon) {
			for (let i of winCombo) {
				BOXES[i].classList.add("highlight");
			}
			return true;
		}
	}
	return false;
}

function isGameOver() {
	return board.every((el) => Boolean(el));
}

function updateDisplay() {
	displayBoard();
	displayPlayerTurn();
}

function displayBoard() {
	for (let i=0; i<9; i++) {
		BOXES[i].textContent = board[i] || "";
	}
}

function displayPlayerTurn() {
	animationFadeTo(turn, turn, 100);
	setTimeout(() => turn.textContent = getPlayerTurnText(), 100);
}

function getPlayerTurnText() {
	return currentPlayer === 1 && isPcAPlayer ? "PC" : `Player ${currentPlayer+1}`;
}

function reset(delay=1000) {
	setTimeout(() => {turn.textContent = getPlayerTurnText()}, delay / 2);
	animationFadeTo(GAMECONTAINERS[4], GAMECONTAINERS[2], delay);
	animationFadeTo(GAMECONTAINERS[5], GAMECONTAINERS[3], delay);
	setTimeout(resetBoard, delay);
	setTimeout(() => {isGameFinished = false}, delay * 2);
	currentPlayer = Math.round(Math.random());
    ifStartPcTurn(delay);
}

function resetBoard() {
	for (let i=0; i<9; i++) {
		BOXES[i].classList.remove("highlight");
		BOXES[i].textContent = "";
		board[i] = undefined;
	}
}

/* PC TURN */

function ifStartPcTurn(delay=2000) {
    if (isPcAPlayer && currentPlayer === 1) {
        setTimeout(pcTurn, delay);
    }
}

function pcTurn() {
	setTimeout(pcMove, 1000);
}

function pcMove() {
	pcRandomMove();
    play();
}

function pcRandomMove() {
	let boxIndex = randomBox();
	while (!move(boxIndex)) {
		boxIndex = randomBox();
	}
}

function randomBox() {
	return Math.floor(Math.random() * 9);
}