
const blockquote = document.getElementsByTagName("blockquote")[0];
const cite = document.getElementsByTagName("cite")[0];
const btnNew = document.getElementById("new");
const btnTweet = document.getElementById("tweet");

btnNew.addEventListener('click', randomQuote);
btnTweet.addEventListener('click', tweetQuote);


function randomQuote() {
	quote, c = getRandomQuote();
	setQuote(quote, c);
}

function setQuote(quote, author) {
	blockquote.textContent = quote;
	cite.textContent = author;
}

function tweetQuote() {
	let quote = blockquote.textContent;
	let author = cite.textContent;
	tweet(quote, author);
}

function getRandomQuote() {
	// code that gets a new random code from the API.
}

function tweet() {
	// code that tweets the thing.
}

// additional:
// 	Make the quote-container a fixed height? Or at least give it a min-height.
// 	and center the quote.