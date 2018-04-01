var canvas;
var canvasContext;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WIN_SCORE = 3;

var ballX = 50;
var ballSpeedX = 5;
var ballY = 10;
var ballSpeedY = 4;

var paddleLeftY = 250;
var paddleRightY = 250;

var paddleLeftScore = 0;
var paddleRightScore = 0;

var flag = false;

window.onload = function() {
	canvas 			= document.getElementById("gameCanvas");
	canvasContext 	= canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
		move();
		draw();
	}, 1000/framesPerSecond);

	// Event to handle game play
	canvas.addEventListener('mousedown', handleMouseClick);

	// Event to handle player paddle movement
	canvas.addEventListener('mousemove', function(evt) {
		var mousePosition = calculateMousePosition(evt);
		paddleLeftY = mousePosition.y - (PADDLE_HEIGHT/2);
	});
}

// Draw game board
function draw() {
	// Board
	drawRect(0, 0, canvas.width, canvas.height, 'black');

	displayScore();

	// A player has won.
	if(flag) {
		
		if ( paddleLeftScore >= WIN_SCORE ) {
			displayMessage('You Won!', 1);
		} else if ( paddleRightScore >= WIN_SCORE ) {
			displayMessage('You Lost!', 2);
		}

		displayMessage('Click to continue!');
		return;
	}

	// Net
	drawNet();

	// Ball
	drawBall(ballX, ballY, 8, 'green');

	// Paddle Left
	drawRect(0, paddleLeftY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
	
	// Paddle Right
	drawRect(canvas.width - PADDLE_THICKNESS, paddleRightY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
}

// Draw board, paddle and net
function drawRect(x, y, w, h, c) {
	canvasContext.fillStyle = c;
	canvasContext.fillRect(x, y, w, h);	
}

// Draw net
function drawNet() {
	for(var i=0; i<canvas.height; i+= 20) {
		drawRect(canvas.width/2 - 1, i, 2, 5, 'white');
	}
}

// Draw ball
function drawBall(x, y, r, c) {
	canvasContext.fillStyle = c;
	canvasContext.beginPath();
    canvasContext.arc(x, y, r, 0, 2 * Math.PI, true);

    canvasContext.fill();
}

// Player paddle movement
function move() {
	if(flag) return;

	autoMove();

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX > canvas.width) {
		if( ballY > paddleRightY && ballY < (paddleRightY + PADDLE_HEIGHT) ) {
			ballSpeedX	= -ballSpeedX;	
			ballSpeedY = (ballY - (paddleRightY + PADDLE_HEIGHT/2)) * 0.3;
		} else {
			paddleLeftScore++;
			ballReset();
		}
	}

	if(ballY > canvas.height) {
		ballSpeedY	= -ballSpeedY;	
	}

	if(ballX < 0) {
		if( ballY > paddleLeftY && ballY < (paddleLeftY + PADDLE_HEIGHT) ) {
			ballSpeedX	= -ballSpeedX;	
			ballSpeedY = (ballY - (paddleLeftY + PADDLE_HEIGHT/2)) * 0.3;

		} else {
			paddleRightScore++;
			ballReset();	
		}
	}

	if(ballY < 0) {
		ballSpeedY	= -ballSpeedY;	
	}
}

// Computer paddle movement
function autoMove() {
	var paddleRightYCenter = paddleRightY + PADDLE_HEIGHT/2;

	if(paddleRightYCenter < ballY - 35) {
		paddleRightY += 6; 
	} else if(paddleRightYCenter > ballY + 35) {
		paddleRightY -= 6; 
	}
}

// Calculate mouse position
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

// Reset ball position
function ballReset() {
	if( paddleRightScore >= WIN_SCORE || paddleLeftScore >= WIN_SCORE ) {
		flag = true;
		return;
	}

	ballSpeedX	= -ballSpeedX;
	ballX = canvas.width/2;
	ballX = canvas.height/2;
}

// Click to continue
function handleMouseClick(evt) {
	if(flag) {
		paddleRightScore = 0;
		paddleLeftScore = 0;
		location.reload();
		flag = false;
	}
}

// Display score
function displayScore() {
	var paddleLeftScoreElement = document.getElementById("playerScore");
	var paddleRightScoreElement = document.getElementById("computerScore");

	paddleLeftScoreElement.innerHTML = "Your Score: " + paddleLeftScore;
	paddleRightScoreElement.innerHTML = "Computer Score: " + paddleRightScore;
}

// Display game messages
function displayMessage(msg, type) {

	var msgWidth = canvasContext.measureText(msg).width;
	var h = 0;

	canvasContext.font="40px Tahoma";

	// Player wins
	if (type === 1) {
		canvasContext.fillStyle = 'green';
		h = canvas.height/3;
	} else if (type === 2) {
		canvasContext.fillStyle = 'red';
		h = canvas.height/3;
	} else {
		canvasContext.fillStyle = 'white';
		h = canvas.height/2;
	}

	canvasContext.fillText(msg, (canvas.width/2) - (msgWidth / 2), h);
}