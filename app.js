// Constants
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PADDLE_MARGIN = 20;
const BALL_RADIUS = 10;

const PLAYER_COLOR = '#39FF14';
const AI_COLOR = '#FF3131';
const BALL_COLOR = '#FAF700';

let playerY = (HEIGHT - PADDLE_HEIGHT) / 2;
let aiY = (HEIGHT - PADDLE_HEIGHT) / 2;
let playerScore = 0;
let aiScore = 0;

let ball = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 3 * (Math.random() > 0.5 ? 1 : -1)
};

// Mouse control
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp to canvas
    if (playerY < 0) playerY = 0;
    if (playerY > HEIGHT - PADDLE_HEIGHT) playerY = HEIGHT - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // Background
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Middle net
    ctx.setLineDash([10, 15]);
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Scores
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, WIDTH/4, 40);
    ctx.fillText(aiScore, WIDTH*3/4, 40);

    // Player paddle
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI paddle
    ctx.fillStyle = AI_COLOR;
    ctx.fillRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = BALL_COLOR;
    ctx.fill();
}

// Update game state
function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision (top/bottom)
    if (ball.y < BALL_RADIUS || ball.y > HEIGHT - BALL_RADIUS) {
        ball.vy = -ball.vy;
        ball.y = ball.y < BALL_RADIUS ? BALL_RADIUS : HEIGHT - BALL_RADIUS;
    }

    // Player paddle collision
    if (
        ball.x - BALL_RADIUS < PADDLE_MARGIN + PADDLE_WIDTH &&
        ball.y > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.vx = -ball.vx;
        // Add effect based on hit position
        let hitPos = (ball.y - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.vy += hitPos * 2;
        ball.x = PADDLE_MARGIN + PADDLE_WIDTH + BALL_RADIUS;
    }

    // AI paddle collision
    if (
        ball.x + BALL_RADIUS > WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ball.y > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.vx = -ball.vx;
        // Add effect based on hit position
        let hitPos = (ball.y - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.vy += hitPos * 2;
        ball.x = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_RADIUS;
    }

    // Score (left/right wall)
    if (ball.x < 0) {
        aiScore++;
        resetBall(-1);
    } else if (ball.x > WIDTH) {
        playerScore++;
        resetBall(1);
    }

    // AI movement (simple)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ball.y - 10) {
        aiY += 4;
    } else if (aiCenter > ball.y + 10) {
        aiY -= 4;
    }
    // Clamp AI
    if (aiY < 0) aiY = 0;
    if (aiY > HEIGHT - PADDLE_HEIGHT) aiY = HEIGHT - PADDLE_HEIGHT;
}

// Reset ball to center
function resetBall(direction) {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.vx = 5 * direction;
    ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
