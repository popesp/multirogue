const WebSocket = require("websocket");
const http = require("http");

let player1, player2;

const server_http = http.createServer();
server_http.listen(3000, function()
{
	console.log((new Date()) + " Server is listening on port 3000");
});

const server_websocket = new WebSocket.server(
{
	httpServer: server_http
});

server_websocket.on("request", function(request)
{
	let connection;
	
	if (player1 === undefined)
	{
		connection = player1 = request.accept(null, request.origin);
		player1.id_player = 0;
		console.log("Player 1 connected");
	}
	else if (player2 === undefined)
	{
		connection = player2 = request.accept(null, request.origin);
		player2.id_player = 1;
		console.log("Player 2 connected");
	}
	else
		request.reject();
	
	connection.on("message", function(message)
	{
		console.log(message.utf8Data);
	});
	
	connection.on("close", function(reason, description)
	{
		console.log(connection.remoteAddress + " disconnected");
	});
});