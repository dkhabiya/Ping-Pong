var canvas;
var canvasContext;

var ballX = 50;
var ballSpeedX = 5;

var ballY = 10;
var ballSpeedY = 4;

const PADDLE_HEIGHT = 100;
var paddleLeftY = 250;

// var paddleLeft = ;

// var paddleRightY = ;
// var paddleRightY = ;

window.onload = function() {
	canvas 			= document.getElementById("gameCanvas");
	canvasContext 	= canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
		move();
		draw();
	}, 1000/framesPerSecond);

	canvas.addEventListener('mousemove', function(evt) {
		var mousePosition = calculateMousePosition(evt);
		paddleLeftY = mousePosition.y - (PADDLE_HEIGHT/2);
	});
}

function draw() {
	// Board
	drawRect(0, 0, canvas.width, canvas.height, 'black');

	// Paddle Left
	drawRect(0, paddleLeftY, 10, PADDLE_HEIGHT, 'white');
	
	// Paddle Right
	drawRect(canvas.width - 10, 200, 10, PADDLE_HEIGHT, 'white');

	// Ball
	drawBall(ballX, ballY, 8, 'white');

}

function drawRect(x, y, w, h, c) {
	canvasContext.fillStyle = c;
	canvasContext.fillRect(x, y, w, h);	
}

function drawBall(x, y, r, c) {
	canvasContext.fillStyle = c;
	canvasContext.beginPath();
    canvasContext.arc(x, y, r, 0, 2 * Math.PI, true);

    canvasContext.fill();
}

function move() {
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX > canvas.width) {
		ballSpeedX	= -ballSpeedX;	
	}

	if(ballY > canvas.height) {
		ballSpeedY	= -ballSpeedY;	
	}

	if(ballX < 0) {
		if( ballY > paddleLeftY && ballY < (paddleLeftY + PADDLE_HEIGHT) ) {
			ballSpeedX	= -ballSpeedX;	
		} else {
			ballReset();
		}
	}

	if(ballY < 0) {
		ballSpeedY	= -ballSpeedY;	
	}
}

function calculateMousePosition(evt) {
	var rect = canvas.getBoundingClientRect();
	var main = document.documentElement;

	var mouseX = evt.clientX - rect.left - main.scrollLeft;
	var mouseY = evt.clientY - rect.top - main.scrollTop;

	return {
		x: mouseX,
		y: mouseY
	}
}

function ballReset() {
	ballSpeedX	= -ballSpeedX;
	ballX = canvas.width/2;
	ballX = canvas.height/2;
}