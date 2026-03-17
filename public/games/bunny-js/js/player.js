import { keys } from "./input.js";
import { tilesMap, tilesMapLong } from "./map.js";
import { arrows } from "./arrows.js";
import { setMaxScore } from "./game.js"; 

export const player = {
    x: 10,
    y: 250,
    vx: 0,
    vy: 0,
    gravity: 0.6,
    jumpForce: -14,
    onGround: false,
    speed: 7,
    frame: 0,
    frameTime: 0,
    idleFrames: [286, 308, 309, 310, 311, 264, 265, 266, 267, 268, 269, 270, 271, 272, 287, 288, 289, 290, 291, 292, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 293, 297, 298, 299, 300, 301, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373],
    jumpUp: [24, 24, 25, 25],
    jumpRight: [44, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 46, 47, 48],
    jumpLeft: [59, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 57, 56, 55],
    runRight: [44, 45, 46, 47, 48],
    runLeft: [59, 58, 57, 56, 55],
    frameDuration: 80,
    currentAnimation: "idle"

};
const FRAME_SIZE = 32;
const PLAYER_SCALE = 3;

const PLAYER_WIDTH = FRAME_SIZE * PLAYER_SCALE;
const PLAYER_HEIGHT = FRAME_SIZE * PLAYER_SCALE;

// 🔥 HITBOX (mai mic decât sprite-ul)
const HITBOX_WIDTH = 18 * PLAYER_SCALE;
const HITBOX_HEIGHT = 16 * PLAYER_SCALE;

const HITBOX_OFFSET_X = 7 * PLAYER_SCALE;
const HITBOX_OFFSET_Y = 7 * PLAYER_SCALE;

const TILE_WIDTH = 168;
const TILE_HEIGHT = 168;

const TILE_WIDTH_LONG = 190;
const TILE_HEIGHT_LONG = 168;
export function updatePlayer(delta,canvasWidth) {

    player.onGround = false;
    player.vy += player.gravity;
    player.y += player.vy;

    
    const playerLeft = player.x + HITBOX_OFFSET_X;
    const playerRight = playerLeft + HITBOX_WIDTH;
    const playerTop = player.y + HITBOX_OFFSET_Y;
    const playerBottom = playerTop + HITBOX_HEIGHT;

   
    //const allTiles=[...tilesMap,...tilesMapLong];
    for (let tile of tilesMap) {

        const tileX = tile.x;
        const tileY = tile.y;

        if (player.vy > 0) {

            const prevBottom = playerBottom - player.vy;

            const isAbove = prevBottom <= tileY;
            const isNowTouching = playerBottom >= tileY;

            const paddingX = 20 * PLAYER_SCALE;

            const overlapX =
                playerRight - paddingX > tileX &&
                playerLeft + paddingX < tileX + TILE_WIDTH;

            if (isAbove && isNowTouching && overlapX) {

                player.y = tileY - HITBOX_HEIGHT - HITBOX_OFFSET_Y;
                player.vy = 0;
                player.onGround = true;
            }
        }
    }

    
    for (let tile of tilesMapLong) {

        const tileX = tile.x;
        const tileY = tile.y;

        if (player.vy > 0) {

            const prevBottom = playerBottom - player.vy;

            const isAbove = prevBottom <= tileY;
            const isNowTouching = playerBottom >= tileY;

            const paddingX = 17 * PLAYER_SCALE;

            const overlapX =
                playerRight - paddingX > tileX &&
                playerLeft + paddingX < tileX + TILE_WIDTH_LONG;

            if (isAbove && isNowTouching && overlapX) {

                player.y = tileY - HITBOX_HEIGHT - HITBOX_OFFSET_Y;
                player.vy = 0;
                player.onGround = true;
            }
        }


    }

    // fallback ground
    const groundLevel = 430;

    if (!player.onGround && player.y >= groundLevel) {
        player.y = groundLevel;
        player.vy = 0;
        player.onGround = true;
    }

    player.vx = 0;

    if (keys["ArrowLeft"]) {
        player.vx = -player.speed;
        if (player.currentAnimation !== "runLeft") player.frame = 0;
        player.currentAnimation = "runLeft";
    }
    else if (keys["ArrowRight"]) {
        player.vx = player.speed;
        if (player.currentAnimation !== "runRight") player.frame = 0;
        player.currentAnimation = "runRight";
    }
    else {
        player.currentAnimation = "idle";
    }

    player.x += player.vx;
    player.x=Math.max(-20,player.x)
    player.x=Math.min(canvasWidth-70,player.x);

    updateAnimation(delta);
}
function updateAnimation(delta) {

    player.frameTime += delta;
    let frames;

    if (!player.onGround) {

        if (player.vx > 0) {
            frames = player.jumpRight;
        }
        else if (player.vx < 0) {
            frames = player.jumpLeft;
        }
        else {
            frames = player.jumpUp;
        }

    }
    else if (player.currentAnimation === "runRight") {
        frames = player.runRight;
    }
    else if (player.currentAnimation === "runLeft") {
        frames = player.runLeft;
    }
    else {
        frames = player.idleFrames;
    }

    if (player.frameTime > player.frameDuration) {

        player.frameTime = 0;
        player.frame++;

        if (player.frame >= frames.length) {
            player.frame = 0;
        }

    }
}
export function drawPlayer(ctx, sprite) {

    let frames;

    if (!player.onGround) {
        if (player.vx > 0) frames = player.jumpRight;
        else if (player.vx < 0) frames = player.jumpLeft;
        else frames = player.jumpUp;
    }
    else if (player.currentAnimation === "runRight") {
        frames = player.runRight;
    }
    else if (player.currentAnimation === "runLeft") {
        frames = player.runLeft;
    }
    else {
        frames = player.idleFrames;
    }

    const frameIndex = frames[player.frame];

    const frameWidth = FRAME_SIZE;
    const frameHeight = FRAME_SIZE;

    const columns = sprite.width / frameWidth;

    const sx = (frameIndex % columns) * frameWidth;
    const sy = Math.floor(frameIndex / columns) * frameHeight;

    ctx.drawImage(
        sprite,
        sx,
        sy,
        frameWidth,
        frameHeight,
        Math.round(player.x),
        Math.round(player.y),
        PLAYER_WIDTH,
        PLAYER_HEIGHT
    );
    ctx.strokeStyle = "red";
    ctx.strokeRect(
        player.x + HITBOX_OFFSET_X,
        player.y + HITBOX_OFFSET_Y,
        HITBOX_WIDTH,
        HITBOX_HEIGHT
    );
}
window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" && player.onGround === true) {
        player.vy = player.jumpForce;
        player.onGround = false;
    }
});



export function checkArrowCollision(player,score,maxScore){
    let gameOverRespone=false;

    for(let a of arrows){

        const hit =
            player.x < a.x + 64 &&
            player.x + PLAYER_WIDTH > a.x &&
            player.y < a.y + 64 &&
            player.y + PLAYER_HEIGHT > a.y;

        if(hit){
            gameOverRespone = true;

            // 🔥 salvare max score
            if(score > maxScore){
                setMaxScore(score);
                localStorage.setItem("maxScore", score);
                console.log("maxScore set new with"+localStorage.getItem("maxScore"));
            }
        }
    }
    return gameOverRespone;
}