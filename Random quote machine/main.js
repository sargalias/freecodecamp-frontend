
const blockquote = document.getElementsByTagName("blockquote")[0];
const cite = document.getElementsByTagName("cite")[0];
const btnNew = document.getElementById("new");
const btnTweet = document.getElementById("tweet");
btnNew.addEventListener('click', randomQuote);

function randomQuote() {
	$.ajax({
			url: 'https://api.forismatic.com/api/1.0/?',
			data: 'method=getQuote&format=jsonp&lang=en&jsonp=?',
			type: "GET",
			dataType: 'jsonp'
	}).done(function (response) {
		blockquote.textContent = response.quoteText;
		cite.textContent = response.quoteAuthor
		btnTweet.setAttribute('href', 'https://twitter.com/intent/tweet?text=' + '"' + blockquote.textContent + '" - ' + cite.textContent);
	});
}

$(document).ready(function() {
	randomQuote();
})