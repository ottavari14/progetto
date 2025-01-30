console.log("Il gioco è iniziato!");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Caricamento delle immagini
const canvasImg = new Image();
canvasImg.src = "images/SFONDO.png"; // Sfondo del canvas

const avatarImg = new Image();
avatarImg.src = "images/ragazza.png"; // Avatar del giocatore

const bombImg = new Image();
bombImg.src = "images/bomba.png"; // Immagine della bomba

const building1Img = new Image();
building1Img.src = "images/chiesa.png"; // Immagine del primo edificio

const building2Img = new Image();
building2Img.src = "images/palazzata.png"; // Immagine del secondo edificio

// Oggetto player
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

// Aggiungi un listener per il movimento del giocatore
document.addEventListener("keydown", movePlayer);
document.getElementById("retryButton").addEventListener("click", restartGame);

// Funzione di movimento del giocatore
function movePlayer(event) {
    if (gameOver) return;
    if (event.key === "ArrowRight") player.x += player.speed;
    if (event.key === "ArrowLeft") player.x -= player.speed;
    if (event.key === " " && !player.isJumping) jump();
}

// Funzione di salto
function jump() {
    player.isJumping = true;
    player.jumpY = 0;
    let jumpInterval = setInterval(() => {
        player.y -= 10;
        player.jumpY += 10;
        if (player.jumpY >= player.jumpHeight) {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
                if (player.y < 500) {
                    player.y += 10;
                    player.jumpY -= 10;
                } else {
                    clearInterval(fallInterval);
                    player.isJumping = false;
                }
            }, 10);
        }
    }, 10);
}

// Funzione per creare una nuova bomba
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

// Funzione per creare un nuovo edificio
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

// Funzione per aggiornare lo stato del gioco
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Disegna lo sfondo
    ctx.drawImage(canvasImg, 0, 0, canvas.width, canvas.height);

    // Disegna gli edifici
    buildings.forEach(building => {
        ctx.drawImage(building.image, building.x, building.y, building.width, building.height);
    });

    // Disegna il giocatore
    ctx.drawImage(avatarImg, player.x, player.y, player.width, player.height);

    // Aggiorna e disegna le bombe
    bombs.forEach((bomb, index) => {
        bomb.y += bomb.speed;
        ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);

        if (bomb.y > canvas.height) {
            bombs.splice(index, 1);
            return;
        }

        // Verifica collisione con il giocatore
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

        // Verifica collisione con gli edifici
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

    // Aggiorna e mostra il punteggio
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Punteggio: " + score, 10, 30);
    ctx.fillText("Vite: " + lives, 10, 60);
    ctx.fillText("Livello: " + level, 10, 90);

    // Condizione di Game Over
    if (lives <= 0) {
        gameOver = true;
        document.getElementById("game-over").style.display = "block";
    }
}

// Funzione per aggiornare il moltiplicatore
function updateMultiplier() {
    if (score >= 500) {
        multiplier = 2;
    }
    if (score >= 1000) {
        multiplier = 3;
    }
}

// Funzione per riavviare il gioco
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

// Funzione per assicurarsi che le immagini siano caricate prima di iniziare il gioco
function checkImagesLoaded() {
    let loadedImages = 0;
    const totalImages = 5;

    function imageLoaded() {
        loadedImages++;
        if (loadedImages === totalImages) {
            console.log("Tutte le immagini sono caricate. Inizia il gioco!");
            gameLoop();
        }
    }

    canvasImg.onload = imageLoaded;
    avatarImg.onload = imageLoaded;
    bombImg.onload = imageLoaded;
    building1Img.onload = imageLoaded;
    building2Img.onload = imageLoaded;
}

// Avvia il gioco dopo che tutte le immagini sono caricate
checkImagesLoaded();
