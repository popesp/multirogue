const WebSocket = require("websocket");
const http = require("http");

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
	const connection = request.accept(null, request.origin);
	console.log("Connection request accepted");
	
	connection.on("message", function(message)
	{
		if (message.type === "utf8")
		{
			console.log("Received Message: " + message.utf8Data);
			connection.sendUTF(message.utf8Data);
		}
		else if (message.type === "binary")
		{
			console.log("Received Binary Message of " + message.binaryData.length + " bytes");
			connection.sendBytes(message.binaryData);
		}
	});
	
	connection.on("close", function(reason, description)
	{
		console.log(connection.remoteAddress + " disconnected");
	});
});