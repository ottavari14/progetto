console.log("Il gioco è iniziato!");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const canvasImg = new Image ();
canvasImg.src= "sfondo.png";

avatar.src = 'ragazza.png';
bombImage.src = 'bomba.png';
palaceImage1.src = 'chiesa.png';
palaceImage2.src = 'palazzata.png';


let player = {
    x: 350,
    y: 500,
    width: 50,
    height: 50,
    speed: 5,
    jumpHeight: 150,
    isJumping: false,
    jumpY: 0
};

let bombs = [];
let buildings = [];
let score = 0;
let lives = 3;
let gameOver = false;
let multiplier = 1;
let level = 1;

document.addEventListener("keydown", movePlayer);
document.getElementById("retryButton").addEventListener("click", restartGame);

function movePlayer(event) {
    if (gameOver) return;
    if (event.key === "ArrowRight") player.x += player.speed;
    if (event.key === "ArrowLeft") player.x -= player.speed;
    if (event.key === " " && !player.isJumping) jump();
}

function jump() {
    player.isJumping = true;
    player.jumpY = 0;
    let jumpInterval = setInterval(() => {
        player.y -= 10;
        player.jumpY += 10;
        if (player.jumpY >= player.jumpHeight) {
            clearInterval(jumpInterval);
            setInterval(() => {
                if (player.y < 500) {
                    player.y += 10;
                    player.jumpY -= 10;
                } else {
                    clearInterval(jumpInterval);
                    player.isJumping = false;
                }
            }, 10);
        }
    }, 10);
}

function createBomb() {
    let x = Math.random() * (canvas.width - 50);
    bombs.push({
        x: x,
        y: 0,
        width: 50,
        height: 50,
        speed: 5 + level
    });
}

function createBuilding() {
    let x = Math.random() * (canvas.width - 50);
    let buildingImg = Math.random() > 0.5 ? building1Img : building2Img;
    buildings.push({
        x: x,
        y: 500,
        width: 50,
        height: 50,
        image: buildingImg
    });
}

function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw buildings
    buildings.forEach(building => {
        ctx.drawImage(building.image, building.x, building.y, building.width, building.height);
    });

    // Draw player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Update and draw bombs
    bombs.forEach((bomb, index) => {
        bomb.y += bomb.speed;
        ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);

        if (bomb.y > canvas.height) {
            bombs.splice(index, 1);
            return;
        }

        // Check for collision with player
        if (
            bomb.x < player.x + player.width &&
            bomb.x + bomb.width > player.x &&
            bomb.y < player.y + player.height &&
            bomb.y + bomb.height > player.y
        ) {
            bombs.splice(index, 1);
            score += 100 * multiplier;
            updateMultiplier();
        }

        // Check for collision with buildings
        buildings.forEach((building, bIndex) => {
            if (
                bomb.x < building.x + building.width &&
                bomb.x + bomb.width > building.x &&
                bomb.y < building.y + building.height &&
                bomb.y + bomb.height > building.y
            ) {
                score -= 50;
                bombs.splice(index, 1);
                if (score < 0) score = 0;
            }
        });
    });

    // Update and show score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Punteggio: " + score, 10, 30);
    ctx.fillText("Vite: " + lives, 10, 60);
    ctx.fillText("Livello: " + level, 10, 90);

    // Game over condition
    if (lives <= 0) {
        gameOver = true;
        document.getElementById("game-over").style.display = "block";
    }
}

function updateMultiplier() {
    if (score >= 500) {
        multiplier = 2;
    }
    if (score >= 1000) {
        multiplier = 3;
    }
}

function restartGame() {
    gameOver = false;
    lives = 3;
    score = 0;
    level = 1;
    multiplier = 1;
    bombs = [];
    buildings = [];
    document.getElementById("game-over").style.display = "none";
    gameLoop();
}

function gameLoop() {
    if (gameOver) return;

    if (Math.random() < 0.02) {
        createBomb();
    }
    if (Math.random() < 0.01) {
        createBuilding();
    }

    updateGame();

    if (score > level * 500) {
        level++;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
