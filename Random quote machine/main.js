
const blockquote = document.getElementsByTagName("blockquote")[0];
const cite = document.getElementsByTagName("cite")[0];
const btnNew = document.getElementById("new");
const btnTweet = document.getElementById("tweet");
btnNew.addEventListener('click', randomQuote);

function setQuote(quote, author) {
	blockquote.textContent = quote;
	cite.textContent = author;
	btnTweet.setAttribute('href', 'https://twitter.com/intent/tweet?text=' + '"' + quote + '" - ' + author);
}

function randomIndex(max) {
	return Math.floor(Math.random() * max);
}

function randomQuote() {
	$.ajax({
			url: 'https://api.forismatic.com/api/1.0/?',
			data: 'method=getQuote&format=jsonp&lang=en&jsonp=?',
			type: "GET",
			dataType: 'jsonp'
	}).done(function (response) {
		setQuote(response.quoteText, response.quoteAuthor);
	}).fail(function() {
		randomQuoteBackup();
	});
}

function randomQuoteBackup() {
	if (!window.QUOTES) {
		let xhr = new XMLHttpRequest();
		xhr.open('Get', 'quotes.json', true);
		xhr.onload = function() {
			window.QUOTES = JSON.parse(this.responseText);
			let i = randomIndex(QUOTES.length);
			setQuote(QUOTES[i].quote, QUOTES[i].name);	
		};
		xhr.send();
	} else {
		let i = randomIndex(QUOTES.length);
		setQuote(QUOTES[i].quote, QUOTES[i].name);	
	}
}

$(document).ready(function() {
	randomQuote();
})