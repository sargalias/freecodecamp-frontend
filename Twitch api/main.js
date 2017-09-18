const users = ["Freecodecamp", "ESL_SC2", "OgamingSC2", "Cretetion", "Storbeck", "Habathcx", "RobotCaleb", "Noobs2ninjas"];
const container = document.getElementsByClassName('inner-container')[0];


function getDataAll() {
	for (let username of users) {
		getUserDataStreams(username);
	}
}

function getUserDataStreams(username) {
	getUserData(username, 'streams');
}

function getUserDataUsers(username) {
	getUserData(username, 'users');
}

function getUserData(username, stream) {
	$.ajax({
		url: `https://wind-bow.gomix.me/twitch-api/${stream}/${username}`,
		type: 'GET',
		dataType: 'jsonp'
	})
	.done(function(res) {
		// results.textContent = res;
		console.log(res);
		let data = {};
		if (stream === "streams") {
			if (res.stream) {
				// get data;
				data.liveStatus = "online";
				data.status = res.stream.channel.status.slice(0, 50);
				if (data.status.length > 40) {
					data.status = data.status.slice(0, 37) + '...';
				}
				data.img = res.stream.channel.logo;
			} else {
				getUserDataUsers(username);
				return;
			}
		} else {
			// get users data (no streaming.)
			data.liveStatus = "offline";
			data.status = 'Offline';
			data.img = res.logo;
		}
		if (!(data.img)) {
			return;
		}
		data.username = username;
		data.link = `https://www.twitch.tv/${username}`;
		applyData(data);	
	});
}

function applyData(data) {
	let article = document.createElement('article');
	article.classList.add(data.liveStatus);

	let userName = document.createElement('a');
	userName.textContent = data.username;
	userName.setAttribute('href', data.link);

	let status = document.createElement('a');
	status.textContent = data.status;
	status.setAttribute('href', data.link);

	let img = document.createElement('img');
	img.setAttribute('src', data.img);
	img.setAttribute('alt', data.username + ' logo');

	article.appendChild(img);
	article.appendChild(userName);
	article.appendChild(status);
	container.appendChild(article);
}

getDataAll();
