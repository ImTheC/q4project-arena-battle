(function() {
	"use strict";

	let messagesbox = document.getElementById("messages");
	let sendButton = document.getElementById("sendbutton");
	let userName = document.getElementById("userName").innerText;
	let usersList = document.getElementById("usersList");
	let usersListSelect = document.getElementById("usersListSelect");

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
			let selected = false;
			let sendTo = document.getElementById("sendTo");

			if ( sendTo ) {
				selected = sendTo.options[sendTo.selectedIndex].text;
			}

			console.log("SELECTED:", selected);
			usersListSelect.innerHTML = "";

			let selectList = document.createElement('select');
			selectList.setAttribute("id","sendTo");
			let selectHTML="<option value='all'> All </option>";

			listOfUsers.forEach(function(user) {
				let textp = document.createElement('p');
				let textNode = document.createTextNode(user);
				selectHTML+= "<option value='" + user + "'> " + user + " </option>";

				textp.appendChild(textNode);
				usersList.appendChild (textp);
			});

    selectList.innerHTML= selectHTML;
    document.getElementById('usersListSelect').appendChild(selectList);

		if ( selected ) {
			sendTo = document.getElementById("sendTo");
			for ( let i = 0; i < sendTo.options.length; i++ ) {
				if ( sendTo.options[i].text === selected ) {
					sendTo.options[i].selected = true;
				}
			}
		}
	});

	// Log messages from the server
	socket.on ('broad', function (res) {
		console.log(res);
		let textp = document.createElement('p');
		let textNode;

		if ( res.sendTo !== "all" ) {
			textNode = document.createTextNode(res.userName + " (whispered): " + res.textmsg);
			textp.setAttribute("class","whisper");
		} else {
			textNode = document.createTextNode(res.userName + ": " + res.textmsg);
		}

		textp.appendChild(textNode);

	  messagesbox.appendChild (textp);
	});

	sendButton.addEventListener("click", sendText);

	// Send text to all users through the server
	function sendText() {
		let sendTo = document.getElementById("sendTo").value;
		console.log(sendTo);

	  // Send the msg object as a JSON-formatted string.
		let msg = {"sendTo": sendTo, "userName": userName, "textmsg": document.getElementById("textmsg").value};

	  socket.emit('messages', msg);

	  // Blank the text input element, ready to receive the next line of text from the userName.
	  document.getElementById("textmsg").value = "";
	}


})();
