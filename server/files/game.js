/* eslint-env browser */

// game constants
const X = 1;
const O = 2;

// global variables
let ctx;
let radius;
let cells;
let id_player;
let state = "disconnected";

// socket connection
const socket = new WebSocket("ws://" + window.location.hostname);

// do things after the DOM is loaded
document.addEventListener("DOMContentLoaded", function()
{
	const gameCanvas = document.getElementById("gameCanvas");
	ctx = gameCanvas.getContext("2d");
	ctx.lineWidth = 5;
	
	// initialize global variables
	radius = gameCanvas.width/8;
	cells =
	[
		{x: gameCanvas.width * 1/6, y: gameCanvas.height * 1/6},
		{x: gameCanvas.width * 1/2, y: gameCanvas.height * 1/6},
		{x: gameCanvas.width * 5/6, y: gameCanvas.height * 1/6},
		{x: gameCanvas.width * 1/6, y: gameCanvas.height * 1/2},
		{x: gameCanvas.width * 1/2, y: gameCanvas.height * 1/2},
		{x: gameCanvas.width * 5/6, y: gameCanvas.height * 1/2},
		{x: gameCanvas.width * 1/6, y: gameCanvas.height * 5/6},
		{x: gameCanvas.width * 1/2, y: gameCanvas.height * 5/6},
		{x: gameCanvas.width * 5/6, y: gameCanvas.height * 5/6}
	];

	// reset game grid
	resetCanvas(gameCanvas);
	
	// handle mouse clicks
	gameCanvas.onclick = function(event)
	{
		socket.send("place " + getClickedCell(gameCanvas, event));
	};
	
	// handle chat inputs
	document.getElementById("chatSubmit").onsubmit = function submitCallback(event)
	{
		event.preventDefault();
		
		const textBox = document.getElementById("chatInput");
		socket.send("chat " + textBox.value);
		textBox.value = "";
	};
});

// draw an O in a cell
function drawO(cell)
{
	ctx.beginPath();
	ctx.arc(cells[cell].x, cells[cell].y, radius, 0, Math.PI*2);
	ctx.stroke();
}

// draw an X in cell
function drawX(cell)
{
	// left top to bottom right
	ctx.moveTo(cells[cell].x - radius, cells[cell].y - radius);
	ctx.lineTo(cells[cell].x + radius, cells[cell].y + radius);
	
	// right top to bottom left
	ctx.moveTo(cells[cell].x + radius, cells[cell].y - radius);
	ctx.lineTo(cells[cell].x - radius, cells[cell].y + radius);
	
	ctx.stroke();
}

function resetCanvas(gameCanvas)
{
	// clear canvas
	ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	ctx.beginPath();
	
	// Left Vertical
	ctx.moveTo(gameCanvas.width/3, 0);
	ctx.lineTo(gameCanvas.width/3, gameCanvas.clientHeight);

	// Right Vertical
	ctx.moveTo(gameCanvas.width/3 * 2, 0);
	ctx.lineTo(gameCanvas.width/3 * 2, gameCanvas.height);

	// Top Horizontal
	ctx.moveTo(0, gameCanvas.height/3);
	ctx.lineTo(gameCanvas.width, gameCanvas.height/3);

	// Bottom Horizontal
	ctx.moveTo(0, gameCanvas.height/3 *2);
	ctx.lineTo(gameCanvas.width, gameCanvas.height/3 *2);
	
	ctx.stroke();
}

// redraw board state
function updateBoard(board)
{
	resetCanvas(document.getElementById("gameCanvas"));
	
	const boardstate = board.split("").map(function(cell)
	{
		return parseInt(cell);
	});
	
	for(const i in boardstate)
		if(boardstate[i] == X)
			drawX(i);
		else if(boardstate[i] == O)
			drawO(i);
}

function getClickedCell(canvas, event)
{
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	
	return Math.floor(x*3/rect.width) + Math.floor(y*3/rect.height)*3;
}

//Update gameInfo text
function updateGameInfoText(text)
{
	document.getElementById("gameInfo").innerHTML = text;
}

// add a chat line
function appendChat(name, text)
{
	const chatLine = document.createElement("div");
	chatLine.className = "chatLine";
	
	const playerName = document.createElement("span");
	playerName.className = "playerName";
	playerName.innerHTML = name + ":";
	
	chatLine.appendChild(playerName);
	chatLine.innerHTML += text;
	
	document.getElementById("chatLines").appendChild(chatLine);
	document.getElementById("chatHistory").scrollTop = document.getElementById("chatHistory").scrollHeight;
}

// network/state message handler
const processes =
{
	disconnected:
	{
		connected: function(args)
		{
			id_player = parseInt(args[0]);
			updateGameInfoText("Connected as Player " + (id_player + 1) + ", waiting for another player to join...");
			updateBoard(args[1]);
			
			state = "waiting";
		}
	},
	waiting:
	{
		ready: function()
		{
			updateGameInfoText("Another player has joined, starting game...");
			if(id_player === 1) // TODO: jank
				updateGameInfoText("Waiting for opponent's move...");
			
			state = "idle";
		},
		chat: function(args)
		{
			appendChat("Player" + (parseInt(args[0]) + 1), args.slice(1).join(" "));
		}
	},
	idle:
	{
		state: function(args)
		{
			updateGameInfoText("It is your turn");
			updateBoard(args[0]);
			
			state = "turn";
		},
		ended: function()
		{
			// TODO
		},
		chat: function(args)
		{
			appendChat("Player" + (parseInt(args[0]) + 1), args.slice(1).join(" "));
		}
	},
	turn:
	{
		invalid: function()
		{
			updateGameInfoText("Invalid move; try again");
		},
		valid: function(args)
		{
			updateGameInfoText("Waiting for opponent's move...");
			updateBoard(args[0]);
			
			state = "idle";
		},
		chat: function(args)
		{
			appendChat("Player" + (parseInt(args[0]) + 1), args.slice(1).join(" "));
		}
	},
	ended:
	{
		
	}
};

// socket message handler
socket.onmessage = function(event)
{
	const args = event.data.split(" ");
	const process = processes[state][args[0]];
	
	if (process !== undefined)
		process(args.slice(1));
};