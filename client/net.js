const socket = new WebSocket("ws://localhost:3000");

let state = "disconnected";
let id_player;
let board;

const processes =
{
	disconnected:
	{
		connected: function(args)
		{
			id_player = parseInt(args[0]);
			console.log("Connected as Player " + (id_player + 1) + ", waiting for another player to join...");
			state = "waiting";
		}
	},
	waiting:
	{
		ready: function()
		{
			console.log("Another player has joined, starting game...");
			state = "idle";
		},
		chat: function(args)
		{
			console.log("Player " + (parseInt(args[0]) + 1) + ": " + args.slice(1).join(" "));
		}
	},
	idle:
	{
		state: function(args)
		{
			console.log("It is your turn");
			
			board = args[0].split("").map(function(cell)
			{
				return parseInt(cell);
			});
			
			state = "turn";
		},
		chat: function(args)
		{
			console.log("Player " + (parseInt(args[0]) + 1) + ": " + args.slice(1).join(" "));
		}
	},
	turn:
	{
		invalid: function()
		{
			console.log("Invalid move; try again");
		},
		valid: function()
		{
			console.log("Waiting for opponent's move...");
			state = "idle";
		},
		chat: function(args)
		{
			console.log("Player " + (parseInt(args[0]) + 1) + ": " + args.slice(1).join(" "));
		}
	}
};

socket.onmessage = function(event)
{
	const args = event.data.split(" ");
	const process = processes[state][args[0]];
	
	if (process !== undefined)
		process(args.slice(1));
};