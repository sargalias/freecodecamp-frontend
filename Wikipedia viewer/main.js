const input = document.getElementById('search');
const results = document.getElementById('results');
const articlesDiv = document.getElementsByClassName('articles')[0];
input.addEventListener('keypress', search);

function search(e) {
	if (e.keyCode === 13) {
		clearSearchData();
		let searchTerm = input.value;
		if (searchTerm !== "") {
			input.value = "";
			getSearchData(searchTerm);
		}
	}
}

function clearSearchData() {
	articlesDiv.innerHTML = "";
}

function getSearchData(searchTerm) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTerm}&utf8=&format=json&origin=*`, true);
	xhr.onload = function() {
		let searchResults = JSON.parse(this.responseText).query.search;
		setSearchData(searchResults);
	}
	xhr.send();
}

function setSearchData(searchResults) {
	let min = Math.min(searchResults.length, 10);
	for (let i=0; i<min; i++) {
		let article = document.createElement('article');
		let a = document.createElement('a');
		let h2 = document.createElement('h2');
		let p = document.createElement('p');
		h2.textContent = searchResults[i].title;
		p.innerHTML = searchResults[i].snippet + '...';
		a.appendChild(h2);
		a.appendChild(p);
		a.setAttribute('href', `https://en.wikipedia.org/?curid=${searchResults[i].pageid}`);
		a.setAttribute('target', '_blank');
		article.appendChild(a);
		articlesDiv.appendChild(article);
	}
}

