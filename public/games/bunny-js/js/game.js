import { assets, loadAssets } from "./assets.js";
import { startGameLoop } from "./engine.js";
import { floor, tilesMap, tilesMapLong } from "./map.js";
import { drawPlayer, updatePlayer } from "./player.js";

let canvas;
let ctx;
let gamePaused = false;

function startGame() {
    canvas = document.getElementById("board");
    if (!canvas) return console.error("Canvas cu id='board' nu există în DOM");

    ctx = canvas.getContext("2d");

    canvas.width = 1000;
    canvas.height = 562;//562;

    canvas.addEventListener("click",function(e){
    const rect=canvas.getBoundingClientRect();
    const mouseX=e.clientX-rect.left;//unde e x mouce pe tot ecranul-unde incepe canvas pt a afla x pe canvas
    const mouseY=e.clientY-rect.top;

    const x=canvas.width-70;
    const y=10;
    if(mouseX >= x && mouseX<=x+60 && mouseY>=y && mouseY<=y+40)
        {gamePaused=!gamePaused;drawPauseButton()}
});

    startGameLoop(update, draw)

}



export function update(delta) {
    if(gamePaused===true) return;
    updatePlayer(delta) 

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
    console.log(assets.bunny.width, assets.bunny.height)

    //ctx.drawImage(assets.grassLong,0,450,400,160)

    drawPauseButton()
}


function drawPauseButton(){
    const x=canvas.width-70;
    const y=10;
    
    if(gamePaused){
        //triunghi
        ctx.fillStyle="rgba(0, 0, 0, 0.54)";
    ctx.fillRect(x,y,60,40)

    ctx.fillStyle="rgba(255, 255, 255, 0.35)"
        const aux=10;
        ctx.beginPath();
        ctx.moveTo(x+12+aux,y+10);
        ctx.lineTo(x+12+aux,y+30);
        ctx.lineTo(x+30+aux,y+20);
        ctx.closePath();
        ctx.fill()

    }else{
        ctx.fillStyle="rgba(0, 0, 0, 0.49)";
    ctx.fillRect(x,y,60,40)

    ctx.fillStyle="rgba(255, 255, 255, 0.35)"
        ctx.fillRect(x+18,y+10,10,20);
        ctx.fillRect(x+33,y+10,10,20);
        
        

        // ctx.lineTo(x+30+aux,y+20);
        // ctx.closePath();
        
    }
}
loadAssets(startGame);