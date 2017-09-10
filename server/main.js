const net = require("net");
const port = 3000;

const server = net.createServer(function(socket)
{
	console.log("connected");
	
	socket.on("end", function()
	{
		console.log("disconnected");
	});
});

server.on("error", function(error)
{
	throw error;
});

server.listen(port);