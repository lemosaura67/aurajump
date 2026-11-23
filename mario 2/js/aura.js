
const player = document.getElementById("player");
const playerImage = document.getElementById("player-image");

const game = document.getElementById("game");

const scoreText = document.getElementById("score");
const gameOver = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");

let playerX = 100;
let playerY = 0;
let velocityY = 0;

let jumping = false;
let score = 0;
let gameRunning = true;

let obstacles = [];

const groundHeight = 0;

const keys = {};

// Controles
document.addEventListener("keydown", function(e) {

    keys[e.key.toLowerCase()] = true;

    if (e.code === "Space") {

        e.preventDefault();

        if (!jumping && gameRunning) {
            velocityY = 15;
            jumping = true;
        }

    }

});

document.addEventListener("keyup", function(e) {
    keys[e.key.toLowerCase()] = false;
});

// Criar obstáculos
function createObstacle() {

    if (!gameRunning) return;

    const obstacle = document.createElement("div");

    obstacle.classList.add("obstacle");
    obstacle.style.left = game.clientWidth + "px";

    game.appendChild(obstacle);

    obstacles.push({
        element: obstacle,
        passed: false
    });

}

// Detectar colisão
function collision(a, b) {

    const r1 = a.getBoundingClientRect();
    const r2 = b.getBoundingClientRect();

    return (
        r1.left < r2.right &&
        r1.right > r2.left &&
        r1.top < r2.bottom &&
        r1.bottom > r2.top
    );

}

// Fim de jogo
function endGame() {

    if (!gameRunning) return;

    gameRunning = false;

    // Trocar imagem do personagem
    playerImage.src = "images/672.gif";

    // Alterar tamanho do personagem
    player.classList.add("dead");

    // Mostrar pontuação final
    finalScore.textContent = score;

    gameOver.style.display = "block";

}

// Reiniciar
function restartGame() {

    // Remover obstáculos
    obstacles.forEach(function(obstacle) {
        obstacle.element.remove();
    });

    obstacles = [];

    // Restaurar personagem
    playerImage.src = "images/67.gif";

    player.classList.remove("dead");

    playerX = 100;
    playerY = 0;
    velocityY = 0;

    player.style.left = playerX + "px";
    player.style.bottom = groundHeight + "px";

    // Zerar pontuação
    score = 0;
    scoreText.textContent = score;

    jumping = false;
    gameRunning = true;

    // Limpar teclas pressionadas
    for (let key in keys) {
        keys[key] = false;
    }

    // Esconder tela de derrota
    gameOver.style.display = "none";

    requestAnimationFrame(update);

}

// Atualização do jogo
function update() {

    if (!gameRunning) return;

    // Movimentação horizontal
    if (keys["arrowright"] || keys["d"]) {
        playerX += 5;
    }

    if (keys["arrowleft"] || keys["a"]) {
        playerX -= 5;
    }

    playerX = Math.max(
        0,
        Math.min(playerX, game.clientWidth - player.offsetWidth)
    );

    // Gravidade e pulo
    velocityY -= 0.7;
    playerY += velocityY;

    if (playerY <= 0) {
        playerY = 0;
        velocityY = 0;
        jumping = false;
    }

    // Atualizar personagem
    player.style.left = playerX + "px";
    player.style.bottom = (groundHeight + playerY) + "px";

    // Movimentar obstáculos
    for (let i = obstacles.length - 1; i >= 0; i--) {

        const obstacle = obstacles[i];

        let x = obstacle.element.offsetLeft - 6;

        obstacle.element.style.left = x + "px";

        // Verificar colisão
        if (collision(player, obstacle.element)) {
            endGame();
            return;
        }

        // Pontuação por obstáculo ultrapassado
        if (
            !obstacle.passed &&
            x + obstacle.element.offsetWidth < playerX
        ) {

            obstacle.passed = true;

            score++;

            scoreText.textContent = score;

        }

        // Remover obstáculos antigos
        if (x < -40) {

            obstacle.element.remove();

            obstacles.splice(i, 1);

        }

    }

    requestAnimationFrame(update);

}

// Criar obstáculos
setInterval(createObstacle, 1800);

// Iniciar jogo
update();

