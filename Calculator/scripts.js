
function calculate(expr) {
	return eval(expr);
}

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

const BUTTONS = document.querySelectorAll('.buttons-container button');
for (let i=0; i<BUTTONS.length; i++) {
	BUTTONS[i].addEventListener('click', control);
}

// EXPRESSION
let expr = [""];
let i = 0;


function master() {
	control.call(this);
}

function control() {
	let entry = VALUES[this.value];
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
		// if entry isn't 0, if previous entry was a zero, replace the zero. Otherwise allow.
		if (entry === "0" && expr[i] !== "0") { // entry is 0.
			expr[i] += entry;
		}
		else { // entry is a number.
			if (expr[i] === "0") {
				expr[i] = entry;
			} else {
				expr[i] += entry;
			}
		}
	}

	else if (entry === ".") { // add dot if there isn't a dot already
		if (!expr[i].match(/\./)) {
			expr[i] += entry;
		}
	}

	else if (entry !== "=") { // we have an operator
		if (!(expr[0] === "")) { // if we have at least one value
			if (expr[i].match(/\d/) || expr[i].match(/\./)) {  // if current value is a number
				expr[++i] = entry;
				expr[++i] = "";
			} else {
				expr[i-1] = entry;
			}
		}
	}

	else { // we have an "=" sign.
		if (!(expr[0] === "")) { // if we have at least one value
			if (expr[i].match(/\d/) || expr[i].match(/\./)) {  // if current value is a number
				var answer = eval(expr.join(''));
				expr = [""];
				i = 0;
			}
			else { //
				expr[i-1] = "";
			}
			// console.log(answer);
			return answer;
		}
	}
	// console.log('entry' + entry);
	// console.log('entry type ' + typeof entry);
	// console.log('expr ' + expr);
}


let o = {value: ""};

function test1() {
	o.value = "1";
	control.call(o);
	for (let i=0; i<9; i++) {
		o.value = "plus";
		control.call(o);
		o.value = "1";
		control.call(o);
	}
	o.value = "equals";
	if (control.call(o) !== 10) {
		alert('fail');
	}
}

function test2() {
	o.value = "1";
	control.call(o);
	for (let i=0; i<9; i++) {
		o.value = "plus";
		control.call(o);
		control.call(o);
		o.value = "1";
		control.call(o);
	}
	o.value = "equals";
	if (control.call(o) !== 10) {
		alert('fail');
	}
}

function test3() {
	o.value = "1";
	control.call(o);
	for (let i=0; i<9; i++) {
		o.value = "minus";
		control.call(o);
		o.value = "plus";
		control.call(o);
		o.value = "1";
		control.call(o);
	}
	o.value = "equals";
	if (control.call(o) !== 10) {
		alert('fail');
	}
}

function test4() {
	o.value = "1";
	control.call(o);
	o.value = "dot";
	for (let i=0; i<9; i++) {
		o.value = "plus";
		control.call(o);
		o.value = "1";
		control.call(o);
	}
	o.value = "equals";
	if (control.call(o) !== 10) {
		alert('fail');
	}
}

function testAll() {
	test1();
	test2();
	test3();
	test4();
}

testAll();