/*
Still need to do:
	Score is kept and displayed.
	AI turn.
	message for who goes first.
	player 1 prefix in icon choice for 2 players.
	reset the game after someone has won or game is over.
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


function setNumberOfPlayers(num) {
	isPcAPlayer = num === 1 ? true: false;
	addRemoveHideClass(GAMECONTAINERS[0], GAMECONTAINERS[1]);
}

function setPlayerOneIcon(icon) {
	if (icon === "X") {
		PLAYERS[0] = "X";
		PLAYERS[1] = "O";
	} else{
		PLAYERS[1] = "X";
		PLAYERS[0] = "O";
	}
	addRemoveHideClass(GAMECONTAINERS[1], GAMECONTAINERS[2]);
}

function addRemoveHideClass(tagHide, tagShow, delay=1000) {
	tagHide.classList.add("hide-opacity");
	setTimeout(() => tagHide.classList.add("hide-z-index"), delay);
	setTimeout(() => tagShow.classList.remove("hide-z-index"), delay);
	setTimeout(() => tagShow.classList.remove("hide-opacity"), delay);
}

function play() {
	if (move(parseInt(this.id))) { // player has moved.
		displayBoard();
		console.log('alerting');
		if (hasWon(currentPlayer)) {
			console.log('displaying');
			alert("win");
			// code to reset game and display nice stuff.
		} else if (isGameOver()) {
			alert('game over');
		}
		changePlayerIndex();
	}
}

function changePlayerIndex() {
	currentPlayer = ++currentPlayer % 2;
}

function move(boxIndex) {
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
			return true;
		}
	}
	return false;
}

function isGameOver() {
	return board.every((el) => Boolean(el));
}


function displayBoard() {
	for (let i=0; i<9; i++) {
		BOXES[i].textContent = board[i] || "";
	}
}

