const WebSocket = require("websocket");
const http = require("http");

const players = [];
const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let state = "waiting";
let id_playerturn = 0;

const server_http = http.createServer();
server_http.listen(3000);

const server_websocket = new WebSocket.server({
	httpServer: server_http
});

server_websocket.on("request", function(request)
{
	let connection;
	
	if (players[0] === undefined)
	{
		connection = players[0] = request.accept(null, request.origin);
		connection.id_player = 0;
		
		connection.send("connected 0 " + board.join(""));
	}
	else if (players[1] === undefined)
	{
		connection = players[1] = request.accept(null, request.origin);
		connection.id_player = 1;
		
		connection.send("connected 1 " + board.join(""));
		
		state = "game";
		
		players[0].send("ready");
		players[1].send("ready");
		
		players[0].send("state " + board.join(""));
	}
	else
		request.reject();
	
	if (connection !== undefined)
	{
		connection.on("message", function(message)
		{
			const args = message.utf8Data.split(" ");
			
			if (args[0] === "chat")
			{
				const message = "chat " + connection.id_player + " " + args.slice(1).join(" ");
				if (players[0] !== undefined)
					players[0].send(message);
				if (players[1] !== undefined)
					players[1].send(message);
			}
			else if (args[0] === "place" && state === "game" && id_playerturn === connection.id_player)
			{
				const index_cell = parseInt(args[1]);
				
				if (index_cell < 0 || index_cell > 8)
					connection.send("invalid");
				else if (board[index_cell] !== 0)
					connection.send("invalid");
				else
				{
					board[index_cell] = connection.id_player + 1;
					
					let gameover = true;
					for (const i in board)
						if (board[i] === 0)
						{
							gameover = false;
							break;
						}
					
					connection.send("valid " + state);
					if (gameover)
					{
						for (const i in board)
							board[i] = 0;
						
						id_playerturn = 0;
						players[0].send("state " + board.join(""));
					}
					else
					{
						id_playerturn = +!id_playerturn;
						players[id_playerturn].send("state " + board.join(""));
					}
				}
			}
		});
		
		connection.on("close", function()
		{
			players[connection.id_player] = undefined;
			state = "waiting";
		});
	}
});