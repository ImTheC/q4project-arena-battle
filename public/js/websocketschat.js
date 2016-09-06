(function() {
	"use strict";

	let messagesbox = document.getElementById("messages");
	let sendButton = document.getElementById("sendbutton");
	let userName = document.getElementById("userName").innerText;
	let usersList = document.getElementById("usersList");

	let socket = io.connect('http://localhost:3000');

	// When the socket is open, send some data to the server
	socket.on('connect', function(data) {
		 socket.emit('initSession', userName);
	});

	socket.on('respond', function(sessionInfo) {
		console.log(sessionInfo);
	});

	socket.on('usersList', function( listOfUsers ) {
			usersList.innerHTML = "";

			listOfUsers.forEach(function(user) {
				let textp = document.createElement('p');
				let textNode = document.createTextNode(user);

				textp.appendChild(textNode);
				usersList.appendChild (textp);
			});
	});

	// Log messages from the server
	socket.on ('broad', function (res) {
		let message = JSON.parse(res);
		let textp = document.createElement('p');
		let textNode = document.createTextNode(message.userName + ": " + message.textmsg);

		textp.appendChild(textNode);

	  messagesbox.appendChild (textp);
	});

	sendButton.addEventListener("click", sendText);

	// Send text to all users through the server
	function sendText() {

	  // Send the msg object as a JSON-formatted string.
		let msg = {"userName": userName, "textmsg": document.getElementById("textmsg").value};

	  socket.emit('messages', JSON.stringify(msg));

	  // Blank the text input element, ready to receive the next line of text from the userName.
	  document.getElementById("textmsg").value = "";
	}


})();
