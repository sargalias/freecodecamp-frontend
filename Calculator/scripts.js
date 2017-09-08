// INITIALISE BUTTONS
const VALUES = {
	0: "0",
	1: "1",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	AC: "AC",
	CE: "CE",
	divide: "/",
	times: "*",
	minus: "-",
	plus: "+",
	dot: ".",
	equals: "="
}
const NUMBERS = [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];


const CURRENTDISPLAY = document.getElementById('current');
const HISTORYDISPLAY = document.getElementById('previous');
const BUTTONS = document.querySelectorAll('.buttons-container button');
for (let i=0; i<BUTTONS.length; i++) {
	BUTTONS[i].addEventListener('click', master);
}

// EXPRESSION
let expr = [""];
let i = 0;
let justAnswered = false;


function master() {
	let answer = control.call(this);
	display(answer);
	return answer; // for use in tests.
}

function control() {
	let entry = VALUES[this.value]; // small protection so user can't alter the button value attribute to something malicious.
	if (NUMBERS.includes(entry)) { // accounting for too large numbers and for chaining expressions together after the user presses "equals" on the previous expression.
		if (justAnswered) {
			expr = [""];
		} else if (expr[i].length >= 10) {
			return;
		}
	}

	justAnswered = false;

	if (!entry) { // invalid entry
		return;
	}

	if (entry === "AC") { // reset everything
		expr = [""];
		i = 0;
	}

	else if (entry === "CE") { // reset current entry;
		expr[i] = "";
	}

	else if (entry.match(/\d/)) { // add number to end of expression.
		if (entry === "0" && expr[i] !== "0") { // entry is 0, but we won't end up with two beginning zeros.
			expr[i] += entry;
		}
		else { // entry is a number.
			if (expr[i] === "0") { // if only digit is a zero, replace it.
				expr[i] = entry;
			} else {
				expr[i] += entry;
			}
		}
	}

	else if (entry === ".") {
		if (!expr[i].match(/\./)) { // add dot if there isn't a dot already 
			expr[i] += entry;
			if (expr[i][0] === ".") { // add a zero if . is the first value
				expr[i] = "0" + expr[i];
			}
		}
	}

	else if (entry !== "=") { // we have an operator, but not "="
		if (!(expr[0] === "")) { // if we have at least one value
			if (expr[i].match(/\d/) || expr[i].match(/\./)) {  // if current value is a number
				expr[++i] = entry;
				expr[++i] = "";
			} else {
				expr[i-1] = entry; // replace previous operator
			}
		}
	}

	else { // we have an "=" sign.
		if (!(expr[0] === "")) { // if we have at least one value
			if (! (expr[i].match(/\d/) || expr[i].match(/\./)) ) {  // if current value is not a number
				expr = expr.slice(0, expr.length-1);
			}
			let answer = eval(expr.join(''));
			answer = Math.round(answer * 100) / 100;
			answer = answer.toString();
			expr = [answer];
			i = 0;
			justAnswered = true;
			return answer;
		}
	}
}

function display(answer="") {
	if (answer) {
		CURRENTDISPLAY.textContent = answer;
		return;
	}

	let currentDisplay = expr[expr.length-1] || expr[expr.length-2] || "0";
	let historyDisplay = expr.join('') || 0;

	// checks if the number is too large, should really be in its own function and called from function "master"
	if (currentDisplay.length > 9 || historyDisplay.length > 20) {
		expr = [""];
		i = 0;
		justAnswered = false;
		currentDisplay = "0";
		historyDisplay = "Digit limit met";
	}

	CURRENTDISPLAY.textContent = currentDisplay;
	HISTORYDISPLAY.textContent = historyDisplay;
}




// TESTS
let o = {value: ""};

function test1() {
	o.value = "AC";
	master.call(o);
	o.value = "1";
	master.call(o);
	for (let i=0; i<9; i++) {
		o.value = "plus";
		master.call(o);
		o.value = "1";
		master.call(o);
	}
	o.value = "equals";
	if (master.call(o) !== "10") {
		alert('fail');
	}
	o.value = "AC";
	master.call(o);
}

function test2() {
	o.value = "AC";
	master.call(o);
	o.value = "1";
	master.call(o);
	for (let i=0; i<9; i++) {
		o.value = "plus";
		master.call(o);
		master.call(o);
		o.value = "1";
		master.call(o);
	}
	o.value = "equals";
	if (master.call(o) !== "10") {
		alert('fail');
	}
	o.value = "AC";
	master.call(o);
}

function test3() {
	o.value = "AC";
	master.call(o);
	o.value = "1";
	master.call(o);
	for (let i=0; i<9; i++) {
		o.value = "minus";
		master.call(o);
		o.value = "plus";
		master.call(o);
		o.value = "1";
		master.call(o);
	}
	o.value = "equals";
	if (master.call(o) !== "10") {
		alert('fail');
	}
	o.value = "AC";
	master.call(o);
}

function test4() {
	o.value = "AC";
	master.call(o);
	o.value = "1";
	master.call(o);
	o.value = "dot";
	for (let i=0; i<9; i++) {
		o.value = "plus";
		master.call(o);
		o.value = "1";
		master.call(o);
	}
	o.value = "equals";
	if (master.call(o) !== "10") {
		alert('fail');
	}
	o.value = "AC";
	master.call(o);
}

function testAll() {
	test1();
	test2();
	test3();
	test4();
}

testAll();