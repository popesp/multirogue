//Game logic here

document.addEventListener("DOMContentLoaded", function(event){ //Waits for the HTML content to be loaded
	var gameCanvas = document.getElementById("gameCanvas");

	document.getElementById("gameInfo").innerHTML = "SODJHGSDJHG";
	gameCanvas.onclick=function(event){
		console.log("Does this work?");
		gameCanvas.classList=["blue"]
	};
});

var connection = new WebSocket('ws://localhost:3000');
connection.onopen = function(){
	connection.send('Ping'); //Send the message to 'Ping' to the server
}
