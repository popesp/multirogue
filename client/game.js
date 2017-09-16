//Game logic here
const EMPTY = 0;
const X = 1;
const O = 2;

//Define global variables
var cells = [];
var radius;


document.addEventListener("DOMContentLoaded", function(event){ //Waits for the HTML content to be loaded
	var gameCanvas = document.getElementById("gameCanvas");
	//Initialize global variables
	radius = gameCanvas.width/8; 
	cells = [
		{x: gameCanvas.width * 1/6, y: gameCanvas.height * 1/6, state: EMPTY},
		{x: gameCanvas.width * 1/2, y: gameCanvas.height * 1/6, state: EMPTY},
		{x: gameCanvas.width * 5/6, y: gameCanvas.height * 1/6, state: EMPTY},
		{x: gameCanvas.width * 1/6, y: gameCanvas.height * 1/2, state: EMPTY},
		{x: gameCanvas.width * 1/2, y: gameCanvas.height * 1/2, state: EMPTY},
		{x: gameCanvas.width * 5/6, y: gameCanvas.height * 1/2, state: EMPTY},
		{x: gameCanvas.width * 1/6, y: gameCanvas.height * 5/6, state: EMPTY},
		{x: gameCanvas.width * 1/2, y: gameCanvas.height * 5/6, state: EMPTY},
		{x: gameCanvas.width * 5/6, y: gameCanvas.height * 5/6, state: EMPTY} ]

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


//Draw X and O in every cell to test
for(var i=0; i<9; i++){
	drawX(ctx,i);
	drawO(ctx,i);
}

gameCanvas.onclick=function(getMousePos){
	getClickedCell(gameCanvas, getMousePos);
}
	


	//Update gameInfo text
	document.getElementById("gameInfo").innerHTML = "gameInfo HTML text"; 


	//Make background blue and state mouse position
	gameCanvas.onclick=function(event){
		console.log(getMousePos(gameCanvas, event));
		var cellIndex = getClickedCell(gameCanvas, getMousePos(gameCanvas, event));
		drawO(ctx, cellIndex);
	};
});


//Draws a circle in cell
//(2d context, cell array)
function drawO(ctx,cell){
	console.log("Cell passed: " + cell);
	ctx.beginPath();
	//Define the circle
	ctx.arc(cells[cell].x,cells[cell].y,radius,0,Math.PI*2);
	//Draw the circle
	ctx.stroke();
}

//Draw an X in cell
//(2d context, cell array)
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


function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

function getClickedCell(canvas, coords){
	var rect = canvas.getBoundingClientRect();
	var clickedCell = Math.floor(3 * coords.x / rect.width) + Math.floor(3 * coords.y / rect.height)*3;
	console.log(clickedCell);
	return clickedCell;
}

