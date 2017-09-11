/*
Still need to do:
	Score is kept and displayed - easy.
	AI turn.
	Win / draw animation.
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
	BOXES[i].addEventListener('click', play);
}

// How many players
document.getElementById("one-player").addEventListener("click", () => setNumberOfPlayers(1));
document.getElementById("two-players").addEventListener("click", () => setNumberOfPlayers(2));

// Player 1 icon choice.
document.getElementById("X").addEventListener("click", () => setPlayerOneIcon("X"));
document.getElementById("O").addEventListener("click", () => setPlayerOneIcon("O"));
document.getElementById("back").addEventListener("click", () => addRemoveHideClass(GAMECONTAINERS[1], GAMECONTAINERS[0]));

// Turn
const turnSection = document.getElementById("turn-section");
const turn = document.getElementById("turn");

function setNumberOfPlayers(num) {
	if (!isPcAPlayer) {
		document.getElementById("player-1-only").textContent = "Player 1: ";
		isPcAPlayer = false;	
	} else {
		isPcAPlayer = true;
	}
	addRemoveHideClass(GAMECONTAINERS[0], GAMECONTAINERS[1]);
}

function setPlayerOneIcon(icon) {
	if (icon === "O") {
		PLAYERS[0] = "O";
		PLAYERS[1] = "X";
	}
	addRemoveHideClass(GAMECONTAINERS[1], GAMECONTAINERS[2]);
	setTimeout(() => turnSection.classList.remove("hide-opacity"), 1000);
	updateDisplay();

}

function addRemoveHideClass(tagHide, tagShow, delay=1000) {
	tagHide.classList.add("hide-opacity");
	setTimeout(() => tagHide.classList.add("hide-z-index"), delay);
	setTimeout(() => tagShow.classList.remove("hide-z-index"), delay);
	setTimeout(() => tagShow.classList.remove("hide-opacity"), delay);
}

function play() {
	if (move(parseInt(this.id[1]))) { // make a move
		displayBoard(); // update the board
		if (hasWon(currentPlayer)) { // check if win
			setTimeout(reset, 1000);
			isGameFinished = true;
			return;
			// code to reset game and display nice stuff.
		} else if (isGameOver()) { // check if game over
			setTimeout(reset, 1000);
			isGameFinished = true;
			return;
		}
		changePlayerIndex(); // update player index
		displayPlayerTurn(); // update display with new player index
	}
}

function changePlayerIndex() {
	currentPlayer = ++currentPlayer % 2;
}

function move(boxIndex) {
	if (isGameFinished) {
		return false;
	}
	if (isPcAPlayer && currentPlayer !== 0) { // prevents player from playing during PC's turn.
		return false;
	}
	if (board[boxIndex]) {
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
	addRemoveHideClass(turn, turn, 100);
	let content = currentPlayer === 1 && isPcAPlayer ? "PC" : currentPlayer+1;
	setTimeout(() => turn.textContent = content, 100);
}

function reset(delay=1000) {
	setTimeout(() => {turn.textContent = currentPlayer === 1 && isPcAPlayer ? "PC" : currentPlayer+1}, delay / 2);
	addRemoveHideClass(GAMECONTAINERS[2], GAMECONTAINERS[2], delay);
	addRemoveHideClass(GAMECONTAINERS[3], GAMECONTAINERS[3], delay);
	setTimeout(resetBoard, delay);
	setTimeout(() => {isGameFinished = false}, delay * 2);
	currentPlayer = Math.round(Math.random());

}

function resetBoard() {
	for (let i=0; i<9; i++) {
		BOXES[i].classList.remove("highlight");
		BOXES[i].textContent = "";
		board[i] = undefined;
	}
}
