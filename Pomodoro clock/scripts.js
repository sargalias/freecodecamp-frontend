
/* Functionality:
	No timer is running:
		Can set the break time and the session length.
		To change them, click on the buttons, then the times change.
		Start the timer by pressing the middle circle.
		Click the circle to start the times.
		Program remembers if it's running the break or session timer, to resume them after.
	
	Timer is running:
		No change is allowed.
		Pause the timer by clicking the circle again.
		If no changes are made, clicking the timer just resumes it.
		If changes are made on the CURRENT timer, the current timer is reset and starts again with the new settings.

	Timer ends:
		Switches to the next timer (session or break) infinitely.

	While the timer runs, the .overlay height is updated with a percentage of the timer run through.

	Display:
		Header:
			Just shows current settings in minutes for both.
		Main title:
			Displays Session / Break! depending on which timer is active.
		Main timer:
			Shows a single number of minutes for the first second.
			Shows descending time in format x:xx otherwise.

	Misc:
		Minutes should have a minimum of 1 for both timers.
*/


// need code for holding down mouse button change at reasonable speed.
// need code for overlay fill.
	// just change color classes based on current timer.
	// else, just fill up acording to % between lenths minutes and seconds remaining.


let timerRunning = false;
const lengths = [25, 5]; // sessionLength first.
const TYPES = ["session", "break"];
let currentTimerIndex = 0;
let secondsRemaining = minutesToSeconds(lengths[currentTimerIndex]);
const DISPLAYBREAKMINUTES = document.getElementById("break-minutes");
const DISPLAYSESSIONMINUTES = document.getElementById("session-minutes");
const DISPLAYTIMERTITLE = document.getElementById('timer-title');
const DISPLAYCOUNTDOWN = document.getElementById('countdown');
let timer;


// add the button events, we don't need the buttons again afterwards.
document.getElementById('session-minus').addEventListener('click', () => changeLength(0, -1));
document.getElementById('session-plus').addEventListener('click', () => changeLength(0, +1));
document.getElementById('break-minus').addEventListener('click', () => changeLength(1, -1));
document.getElementById('break-plus').addEventListener('click', () => changeLength(1, +1));
document.getElementsByClassName('circle')[0].addEventListener('click', timerControl);

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
	startTimer();
}

function resetSecondsRemaining() {
	secondsRemaining = minutesToSeconds(lengths[currentTimerIndex]);
}

function changeTimerIndex(n=2) {
	currentTimerIndex = ++currentTimerIndex % n;
}