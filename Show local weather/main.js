const temp = document.getElementById('temp');
const weatherType = document.getElementById('weather-type');
const loc = document.getElementById('location');
const icon = document.getElementById('icon');
const button = document.getElementById('units');
let lon;
let lat;
let unitType = 0; // 0 is celcius, 1 is farenheight.
button.addEventListener('click', toggleUnits);

let getLocation = new Promise(function (resolve, reject) {
	// if geolocation enabled.
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			[lat, lon] = [position.coords.latitude, position.coords.longitude];

			// promise resolve / reject based on result.
			if (lon || lat) {
				resolve('Got location');
			}
			else {
				reject('No location');
				loc.textContent = "Couldn't access your location.";
				loc.style.display = "block";
			}
		})
	}
});

function getWeather() {
	console.log('running or not');
	xhr = new XMLHttpRequest();
	xhr.open('GET', `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lon}`, true);

	xhr.onload = function() {
		let details = JSON.parse(this.responseText);
		loc.textContent = details.name;
		weatherType.textContent = details.weather[0].description[0].toUpperCase() + details.weather[0].description.slice(1);
		temp.textContent = (Math.round(details.main.temp) + " \u00B0C");
		icon.setAttribute('src', details.weather[0].icon);
		displayAll();
	};
	xhr.send();
}

function toggleUnits() {
	let temperature = temp.textContent;
	let unit;
	if (unitType === 0) {
		// convert to farenheight
		temperature = Math.round((parseInt(temperature) * 9 / 5) +32);
		unit = "F";
	} else {
		temperature = Math.round((parseInt(temperature)-32) * 5 / 9);
		unit = "C";
	}
	temp.textContent = temperature + ' \u00B0' + unit;
	unitType = ++unitType % 2;

	// add to weather icon.
}

function displayAll() {
	let p = document.getElementsByTagName('p');
	for (let i=0; i<p.length; i++) {
		p[i].style.display = "block";
	}
	button.style.display = "block";
}

getLocation.then(getWeather);

