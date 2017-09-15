
const GAME = {
	LT: document.getElementById('lt'),
	RT: document.getElementById('rt'),
	RB: document.getElementById('rb'),
	LB: document.getElementById('lb'),

	sound1: new Audio('sounds/simonSound1.mp3'),
	sound2: new Audio('sounds/simonSound2.mp3'),
	sound3: new Audio('sounds/simonSound3.mp3'),
	sound4: new Audio('sounds/simonSound4.mp3'),
	soundWrong: new Audio('sounds/glimmer.mp3'),

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

	toPlay: null,
	flash: null
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
	} else if (GAME.checkWin()) {
		return "WIN";
	} else {
		return GAME.SCORE.toString().padStart(2, '0');
	}
}

GAME.gameLoop = (repeat=false) => {
	let delay = globalDelay;
	if (!repeat) {
		delay = 2000;

		// add a color
		GAME.GAMEARRAY.push(GAME.randRange());

		// update score
		GAME.SCORE++;

		if (GAME.checkWin()) {
			delay = 3000;
			GAME.display();
			GAME.displayFlash(globalDelay/2, delay);
			timeout(delay, GAME.initialiseGame);
			return;
		}

		// flash display
		GAME.displayFlash(globalDelay/2, delay);
	}
	// reset player position.
	GAME.playerIndex = 0;

	// update display
	GAME.display();

	// play game sequence.
	timeout(delay, GAME.playSequence);
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
};

GAME.display = () => {
	GAME.DISPLAY.textContent = GAME.getScore();
};

GAME.displayFlash = (duration=500, totalDuration=2000) => {
	GAME.DISPLAY.classList.toggle(GAME.classActive);

	GAME.flash = setInterval( () => {
		GAME.DISPLAY.classList.toggle(GAME.classActive);
	}, duration);

	setTimeout( () => {
		clearInterval(GAME.flash);
		GAME.DISPLAY.classList.remove(GAME.classActive);
	}, totalDuration);
}

GAME.checkWin = () => {
	return GAME.SCORE > GAME.WINSCORE;
}

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
	let duration = 500;
	// stop player input while last input is being handled.
	GAME.stopPlayerInput();

	// if correct
	if (parseInt(boxIndex) === GAME.GAMEARRAY[GAME.playerIndex]) {
		GAME.playBox(boxIndex, duration);
		GAME.playerIndex++;

		if (GAME.playerIndex === GAME.SCORE) { // if player won this round, continue gameLoop
			timeout(globalDelay*2, GAME.gameLoop);
		} else {
			setTimeout(GAME.acceptPlayerInput, duration); // if there are still boxes to go, acceptPlayerInput.
		}

	} 
	// if wrong
	else {
		GAME.soundWrong.play();
		if (GAME.STRICTMODE) {
			timeout(globalDelay*2, GAME.initialiseGame);
		} else {
			timeout(globalDelay*2, GAME.gameLoop, true);
		}
		GAME.stopPlayerInput();
	}
}
