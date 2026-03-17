import { assets, loadAssets } from "./assets.js";
import { startGameLoop } from "./engine.js";
import { floor, tilesMap, tilesMapLong } from "./map.js";
import { drawPlayer, player, updatePlayer } from "./player.js";
import { carrotSpots } from "./map.js";
import { spawnCarrots, drawCarrots, updateCarrots, carrots } from "./carrots.js";
import { updateParticles, drawParticles } from "./particles.js"
import { spawnArrow, updateArrows, drawArrows } from "./arrows.js";
import { arrows } from "./arrows.js";
import { checkArrowCollision } from "./player.js";

let canvas;
let ctx;
let gamePaused = false;
let score = 0;
let arrowTimer = 0;
let gameOver = false;
let maxScore = localStorage.getItem("maxScore") || 0;
export function setMaxScore(newMaxScore) { maxScore=newMaxScore;};

function startGame() {
    canvas = document.getElementById("board");
    if (!canvas) return console.error("Canvas cu id='board' nu există în DOM");

    ctx = canvas.getContext("2d");

    canvas.width = 1000;
    canvas.height = 562;//562;

    canvas.addEventListener("click", function (e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;//unde e x mouce pe tot ecranul-unde incepe canvas pt a afla x pe canvas
        const mouseY = e.clientY - rect.top;

        const x = canvas.width - 70;
        const y = 10;
        if (mouseX >= x && mouseX <= x + 60 && mouseY >= y && mouseY <= y + 40) { gamePaused = !gamePaused; drawPauseButton() }
    });

    spawnCarrots(carrotSpots);

    canvas.addEventListener("click", function(e){

    if(!gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const btnX = canvas.width/2 - 100;
    const btnY = canvas.height/2 + 80;

    if(
        mouseX >= btnX &&
        mouseX <= btnX + 200 &&
        mouseY >= btnY &&
        mouseY <= btnY + 50
    ){
        restartGame();
    }
});

    startGameLoop(update, draw)



}

function restartGame(){

    score = 0;
    gameOver = false;

    // reset player
    player.x = 10;
    player.y = 250;
    player.vx = 0;
    player.vy = 0;

    // reset arrays
    arrows.length = 0;
    //particles.length = 0;

    spawnCarrots(carrotSpots);
}

export function update(delta) {
    if(gameOver) return;
    if (gamePaused === true) return;
    updatePlayer(delta, canvas.width)
    updateCarrots(player, addScore);
    const allCollected = carrots.every(c => c.collected);

    if (allCollected) {
        spawnCarrots(carrotSpots);
    }

    updateParticles(delta);
    arrowTimer += delta;

    if (arrowTimer > 1500) {
        spawnArrow(canvas.width, canvas.height);
        arrowTimer = 0;
    }

    updateArrows(canvas.width, canvas.height);
    gameOver=checkArrowCollision(player,score,maxScore)
    

}



export function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.drawImage(assets.background, 0, 0);
    ctx.fillStyle = "rgba(224, 224, 180, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    //final #676d44 and light grass #87824c

    const globalX = 0;
    const globalY = -45;

    // Apply a subtle brightness filter only to the grass tiles
    ctx.save();
    ctx.filter = "brightness(1.2)";


    for (let tile of tilesMap) {
        ctx.drawImage(assets.grass, tile.x + globalX, tile.y + globalY, 168, 168)
    }

    for (let tile of tilesMapLong) {
        ctx.drawImage(assets.grassLong, tile.x + globalX, tile.y + globalY, 170, 170);
    }

    for (let tile of floor) {
        ctx.drawImage(assets.grassLong, tile.x, tile.y, 170, 170);
    }

    ctx.restore();



    ////////bunny
    // ctx.imageSmoothingEnabled = false;
    // const frameWidth = 30;
    // const frameHeight = 30;

    // const frameIndex = 0;

    // const columns = assets.bunny.width / frameWidth;

    // const sx = (frameIndex % columns) * frameWidth;
    // const sy = Math.floor(frameIndex / columns) * frameHeight;

    // ctx.drawImage(
    //     assets.bunny,
    //     sx,
    //     sy,
    //     frameWidth,
    //     frameHeight,
    //     200,
    //     200,
    //     frameWidth * 4,
    //     frameHeight * 4
    // );
    ///////bunny 286 287 ... 293
    ctx.imageSmoothingEnabled = false;
    drawPlayer(ctx, assets.bunny);
    //console.log(assets.bunny.width, assets.bunny.height)

    //ctx.drawImage(assets.grassLong,0,450,400,160)
    drawCarrots(ctx, assets.carrot);
    drawPauseButton()
    drawScore()

    drawParticles(ctx, [
        assets.particle0,
        assets.particle1,
        assets.particle2,
        assets.particle3,
        assets.particle4,
        assets.particle5,
        assets.particle6,
        assets.particle7
    ]);

    drawArrows(ctx, assets.arrows);
    if(gameOver){
    drawGameOver();
}
}


function drawGameOver(){
    ctx.save()

    // overlay semi transparent
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // GAME OVER
    ctx.fillStyle = "red";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 60);

    // SCORE
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2);

    // MAX SCORE
    maxScore=localStorage.getItem("maxScore");
    ctx.fillText("Max Score: " + maxScore, canvas.width / 2, canvas.height / 2 + 40);

    // BUTTON
    
    ctx.beginPath()
    ctx.fillStyle = "gray";
    ctx.roundRect(canvas.width/2 - 100, canvas.height/2 + 80, 200, 50,[10]);
    ctx.fill()
    ctx.fillStyle = "white";
    
    ctx.font = "20px Arial";
    ctx.fillText("PLAY AGAIN", canvas.width / 2, canvas.height / 2 + 110);

    ctx.restore();
}

function drawScore() {
    ctx.restore();
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    ctx.drawImage(assets.trophy,20,40,30,30);
    ctx.fillText(maxScore,55,63,30,30);
}
function drawPauseButton() {
    const x = canvas.width - 70;
    const y = 10;

    if (gamePaused) {
        //triunghi
        ctx.fillStyle = "rgba(0, 0, 0, 0.54)";
        ctx.fillRect(x, y, 60, 40)

        ctx.fillStyle = "rgba(255, 255, 255, 0.35)"
        const aux = 10;
        ctx.beginPath();
        ctx.moveTo(x + 12 + aux, y + 10);
        ctx.lineTo(x + 12 + aux, y + 30);
        ctx.lineTo(x + 30 + aux, y + 20);
        ctx.closePath();
        ctx.fill()

    } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.49)";
        ctx.fillRect(x, y, 60, 40)

        ctx.fillStyle = "rgba(255, 255, 255, 0.35)"
        ctx.fillRect(x + 18, y + 10, 10, 20);
        ctx.fillRect(x + 33, y + 10, 10, 20);



        // ctx.lineTo(x+30+aux,y+20);
        // ctx.closePath();

    }



}
export function addScore(nr) {
    score += nr;
}


loadAssets(startGame);