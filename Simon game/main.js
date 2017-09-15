
const GAME = {
	LT: document.getElementById('lt'),
	RT: document.getElementById('rt'),
	RB: document.getElementById('rb'),
	LB: document.getElementById('lb'),

	sound1: new Audio('sounds/simonSound1.mp3'),
	sound2: new Audio('sounds/simonSound2.mp3'),
	sound3: new Audio('sounds/simonSound3.mp3'),
	sound4: new Audio('sounds/simonSound4.mp3'),

	START: document.getElementById('start'),
	STRICT: document.getElementById('strict'),
	DISPLAY: document.getElementById('display'),

	classNoInteract: "no-interact",
	classActive: "highlight",

	GAMEARRAY: [], // array of indices corresponding to color boxes & their respective sounds.
	WINSCORE: 20,
	SCORE: 0,
	STRICTMODE: false,

	isSequenceRunning: false,
	playerIndex: 0, // what box is player currently trying to guess.

	toPlay: null
}
GAME.COLORBOXES = [GAME.LT, GAME.RT, GAME.RB, GAME.LB];
GAME.SOUNDS = [GAME.sound1, GAME.sound2, GAME.sound3, GAME.sound4];

for (let i=0; i<GAME.COLORBOXES.length; i++) {
	GAME.COLORBOXES[i].addEventListener('mousedown', () => {GAME.playerInput(i)});
}

GAME.STRICT.addEventListener('click', (e) => {
	GAME.STRICTMODE = !(GAME.STRICTMODE);
	e.target.classList.toggle("highlight");
});
GAME.START.addEventListener('click', () => GAME.initialiseGame());
const globalDelay = 1000;

/*
tl;dr; add some better transition between game states. Especially notifications of win / lose.
	Other than that, it's done.
Add a delay when starting the notes, especially when getting them wrong.
Ideally add a wrong sound. Maybe add a highlight when the highlight changes to wrong or win.
ADD SOME HIGHLIGHT to win display.
*/


function timeout(delay, func, ...params) {
	return setTimeout(() => {func(...params)}, delay);
}

GAME.initialiseGame = () => {
	if (GAME.toPlay) {
		clearInterval(GAME.toPlay);
	}
	GAME.GAMEARRAY = [];
	GAME.SCORE = 0;
	timeout(globalDelay, GAME.gameLoop);
}

GAME.getBoxFromIndex = (i) => {
	return GAME.COLORBOXES[i];
}

GAME.getSoundFromIndex = (i) => {
	return GAME.SOUNDS[i];
}

GAME.randRange = (start=0, end=4) => {
	return Math.floor(Math.random() * (end-start) + start);
}

GAME.getScore = () => {
	if (this.SCORE === 0) {
		return "--";
	} else if (GAME.SCORE > GAME.WINSCORE) {
		return "WIN";
	} else {
		return GAME.SCORE.toString().padStart(2, '0');
	}
}

GAME.gameLoop = (repeat=false) => {
	if (!repeat) {
		// add a color
		GAME.GAMEARRAY.push(GAME.randRange());
		// update score
		GAME.SCORE++;
	}
	// reset player position.
	GAME.playerIndex = 0;
	// update display
	GAME.display();
	GAME.playSequence();
};

GAME.playSequence = (duration=500, delay=500, i=0) => {
	// play the current box
	let currentBox = GAME.GAMEARRAY[i];
	GAME.playBox(currentBox, duration);
	i++;

	// either keep going, or set the next event in motion.
	if (i<GAME.GAMEARRAY.length) {
		GAME.toPlay = timeout(duration+delay, GAME.playSequence, duration, delay, i);
	} else {
		GAME.acceptPlayerInput();
	}
};

GAME.playBox = (i, duration=500) => {
	// variable duration, start with 1s
	GAME.COLORBOXES[i].classList.add(GAME.classActive);
	GAME.SOUNDS[i].play();
	setTimeout(() => {
		GAME.COLORBOXES[i].classList.remove(GAME.classActive);
	}, duration);
	// timeout.bind(duration, GAME.COLORBOXES[i].classList.remove, GAME.classActive);
		// the problem is bind
};

GAME.display = () => {
	GAME.DISPLAY.textContent = GAME.getScore()
};

GAME.acceptPlayerInput = () => {
	for (let box of GAME.COLORBOXES) {
		box.classList.remove(GAME.classNoInteract);
	}
}

GAME.stopPlayerInput = () => {
	for (let box of GAME.COLORBOXES) {
		box.classList.add(GAME.classNoInteract);
	}
}

GAME.playerInput = (boxIndex) => {
	// if correct
	if (parseInt(boxIndex) === GAME.GAMEARRAY[GAME.playerIndex]) {
		GAME.playBox(boxIndex);
		GAME.playerIndex++;

		if (GAME.playerIndex > GAME.WINSCORE) {
			GAME.win();
		}

		if (GAME.playerIndex === GAME.SCORE) {
			GAME.stopPlayerInput();
			timeout(globalDelay, GAME.gameLoop);
		}

	} 
	// if wrong
	else {
		if (GAME.STRICTMODE) {
			timeout(globalDelay, GAME.initialiseGame);
		} else {
			timeout(globalDelay, GAME.gameLoop, true);
		}
	}
}

GAME.win = () => {};

