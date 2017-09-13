const net = require("net");

const port = 3000;


// initialize game server
const server = net.createServer(function(socket)
{
	socket.on("data", function(chunk)
	{
		console.log(chunk);
	});
});
server.on("error", function(error)
{
	throw error;
});
server.listen(port);