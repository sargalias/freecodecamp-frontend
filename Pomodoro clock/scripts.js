
// add sound at the end of the timer.
// need code for holding down mouse button change at reasonable speed.
// try and refactor code a bit?
// Examine solution code. Does it use objects? If yes, examine it and see how I could do mine with objects.

let timerRunning = false;
const lengths = [25, 5]; // sessionLength first.
const TYPES = ["session", "break"];
let currentTimerIndex = 0;
let secondsRemaining = minutesToSeconds(lengths[currentTimerIndex]);
const DISPLAYBREAKMINUTES = document.getElementById("break-minutes");
const DISPLAYSESSIONMINUTES = document.getElementById("session-minutes");
const DISPLAYTIMERTITLE = document.getElementById('timer-title');
const DISPLAYCOUNTDOWN = document.getElementById('countdown');
const DISPLAYOVERLAY = document.getElementsByClassName("overlay")[0];
let timer;
let startChangeInterval;
let changeInterval;

// add the button events
document.getElementById('session-minus').addEventListener('mousedown', () => changeLength(0, -1));
document.getElementById('session-minus').addEventListener('mousedown', () => keepChangingLength(0, -1));
document.getElementById('session-minus').addEventListener('mouseup', clearChangeIntervals);
document.getElementById('session-plus').addEventListener('mousedown', () => changeLength(0, +1));
document.getElementById('session-plus').addEventListener('mousedown', () => keepChangingLength(0, +1));
document.getElementById('session-plus').addEventListener('mouseup', clearChangeIntervals);
document.getElementById('break-minus').addEventListener('mousedown', () => changeLength(1, -1));
document.getElementById('break-minus').addEventListener('mousedown', () => keepChangingLength(1, -1));
document.getElementById('break-minus').addEventListener('mouseup', clearChangeIntervals);
document.getElementById('break-plus').addEventListener('mousedown', () => changeLength(1, +1));
document.getElementById('break-plus').addEventListener('mousedown', () => keepChangingLength(1, +1));
document.getElementById('break-plus').addEventListener('mouseup', clearChangeIntervals);
document.getElementsByClassName('circle')[0].addEventListener('click', timerControl);

function clearChangeIntervals() {
	clearInterval(changeInterval);
	clearInterval(startChangeInterval);
}

function keepChangingLength(i, n, delay=500, repeat=100) {
	startChangeInterval = setTimeout(() => {
		changeInterval = setInterval(() => changeLength(i, n), repeat)},
	delay);
}

function changeLength(i, n) {
	// if a timer isn't running, updates session or break length. Minimum is one minute.
	if (!timerRunning) {
		lengths[i] = Math.max(lengths[i]+n, 1);
		if (i === currentTimerIndex) {
			resetSecondsRemaining();
		}
		display();
	}
}

function display() {
	// display timer title (session or break).
	DISPLAYTIMERTITLE.textContent = currentTimerIndex === 0 ? "Session" : "Break";
	DISPLAYSESSIONMINUTES.textContent = lengths[0];
	DISPLAYBREAKMINUTES.textContent = lengths[1];

	// display countdown in seconds or single number, depending on if timer has started running.
	if (minutesToSeconds(lengths[currentTimerIndex]) === secondsRemaining) { // timer is new, display single number;
		DISPLAYCOUNTDOWN.textContent = lengths[currentTimerIndex];
	}
	else {
		DISPLAYCOUNTDOWN.textContent = secondsToPrettyString(secondsRemaining);
	}
	displayOverlay();
}

function displayOverlay() {
	let percentage = (1 - secondsRemaining / minutesToSeconds(lengths[currentTimerIndex])) * 100;
	DISPLAYOVERLAY.style.height = `${percentage}%`;
}

function setColorClass() {
	if (currentTimerIndex === 0) {
		DISPLAYOVERLAY.classList.add('session-color');
		DISPLAYOVERLAY.classList.remove('break-color');
	} else {
		DISPLAYOVERLAY.classList.add('break-color');
		DISPLAYOVERLAY.classList.remove('session-color');
	}
}

function minutesToSeconds(minutes) {
	return minutes * 60;
}

function secondsToPrettyString(seconds) {
	let minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function timerControl() {
	if (timerRunning) {
		pauseTimer();
	}
	else {
		startTimer();
	}
}

function startTimer() {
	timerRunning = true;
	setColorClass();
	display(); // so that the single number displays for 1 second.
	timer = setInterval(timerTick, 1000);
}

function pauseTimer() {
	clearInterval(timer);
	timerRunning = false;
}

function timerTick() {
	secondsRemaining--;
	display();
	if (secondsRemaining === 0) {
		changeTimer();
	}
}

function changeTimer() {
	clearInterval(timer);
	changeTimerIndex();
	resetSecondsRemaining();
	setTimeout(startTimer, 1000); // need to do this a second late, so that the final 0:00 display for one second.
}

function resetSecondsRemaining() {
	secondsRemaining = minutesToSeconds(lengths[currentTimerIndex]);
}

function changeTimerIndex(n=2) {
	currentTimerIndex = ++currentTimerIndex % n;
}