//Game logic here

//Define global variables
var cells = [];
var radius;

document.addEventListener("DOMContentLoaded", function(event){ //Waits for the HTML content to be loaded
	var gameCanvas = document.getElementById("gameCanvas");
	//Initialize global variables
	radius = gameCanvas.width/8; 
	cells = [
		{x: gameCanvas.width * 1/6, y: gameCanvas.height * 1/6},
		{x: gameCanvas.width * 1/2, y: gameCanvas.height * 1/6},
		{x: gameCanvas.width * 5/6, y: gameCanvas.height * 1/6},
		{x: gameCanvas.width * 1/6, y: gameCanvas.height * 1/2},
		{x: gameCanvas.width * 1/2, y: gameCanvas.height * 1/2},
		{x: gameCanvas.width * 5/6, y: gameCanvas.height * 1/2},
		{x: gameCanvas.width * 1/6, y: gameCanvas.height * 5/6},
		{x: gameCanvas.width * 1/2, y: gameCanvas.height * 5/6},
		{x: gameCanvas.width * 5/6, y: gameCanvas.height * 5/6} ]

	//Set up grid
	var ctx = gameCanvas.getContext("2d");
	//Left Vertical
	ctx.moveTo(gameCanvas.width/3, 0);
	ctx.lineTo(gameCanvas.width/3, gameCanvas.clientHeight);

	//Right Vertical
	ctx.moveTo(gameCanvas.width/3 * 2, 0);
	ctx.lineTo(gameCanvas.width/3 * 2, gameCanvas.height);

	//Top Horizontal
	ctx.moveTo(0, gameCanvas.height/3);
	ctx.lineTo(gameCanvas.width, gameCanvas.height/3);

	//Bottom Horizontal
	ctx.moveTo(0, gameCanvas.height/3 *2);
	ctx.lineTo(gameCanvas.width, gameCanvas.height/3 *2);
	//Draw grid lines
	ctx.lineWidth = 5;
	ctx.stroke();

	
for(var i=0; i<9; i++){
	drawX(ctx,i);
	drawO(ctx,i);
}
	


	//Update gameInfo text
	document.getElementById("gameInfo").innerHTML = "gameInfo HTML text"; 


	//Make background blue
	gameCanvas.onclick=function(event){
		console.log("Does this work?");
		gameCanvas.classList=["blue"]
	};
});

var connection = new WebSocket('ws://localhost:3000');
connection.onopen = function(){
	connection.send('Ping'); //Send the message to 'Ping' to the server
}





//Draws a circle at coordinates with a radius
//(2d context, x coord, y coord, radius)
function drawO(ctx,cell){
	ctx.beginPath();
	//Define the circle
	ctx.arc(cells[cell].x,cells[cell].y,radius,0,Math.PI*2);
	//Draw the circle
	ctx.stroke();
}

function drawX(ctx, cell){
	//left top to bottom right
	ctx.moveTo(cells[cell].x - radius, cells[cell].y - radius);
	ctx.lineTo(cells[cell].x + radius, cells[cell].y + radius);
	//right top to bottom left
	ctx.moveTo(cells[cell].x + radius, cells[cell].y - radius);
	ctx.lineTo(cells[cell].x - radius, cells[cell].y + radius);
	//Draw the X
	ctx.stroke();
}