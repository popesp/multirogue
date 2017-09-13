const socket = new WebSocket("ws://localhost:3000");

socket.onopen = function()
{
	console.log("Connected to server");
	
	socket.send("hello world");
};