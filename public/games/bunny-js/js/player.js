import { keys } from "./input.js";

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
    jumpRight:[44, 45,45,45,45,45,45,45,45,45,45,45,45,45,45,45, 46, 47, 48],
    jumpLeft:[59, 58,58,58,58,58,58,58,58,58,58,58,58,58,58,58, 57, 56, 55],
    runRight: [44, 45, 46, 47, 48],
    runLeft: [59, 58, 57, 56, 55],
    frameDuration: 80,
    currentAnimation: "idle"

};
export function updatePlayer(delta) {
    player.vx = 0;
    player.vy += player.gravity;
    player.y += player.vy;
    const groundLevel = 430;

    if (player.y >= groundLevel) {
        player.y = groundLevel;
        player.vy = 0;
        player.onGround = true;
    }

    if (keys["ArrowLeft"]) {
        player.vx = -player.speed;
        if (player.currentAnimation !== "runLeft") {
            player.frame = 0;
        }
        player.currentAnimation = "runLeft";
    }

    else if (keys["ArrowRight"]) {
        player.vx = player.speed;
        if (player.currentAnimation !== "runRight") {
            player.frame = 0;
        }
        player.currentAnimation = "runRight";
    }

    else {
        player.currentAnimation = "idle";
    }
    player.x += player.vx;

    updateAnimation(delta);
}
function updateAnimation(delta){

    player.frameTime += delta;
    let frames;

    if(!player.onGround){

        if(player.vx > 0){
            frames = player.jumpRight;
        }
        else if(player.vx < 0){
            frames = player.jumpLeft;
        }
        else{
            frames = player.jumpUp;
        }

    }
    else if(player.currentAnimation === "runRight"){
        frames = player.runRight;
    }
    else if(player.currentAnimation === "runLeft"){
        frames = player.runLeft;
    }
    else{
        frames = player.idleFrames;
    }

    if(player.frameTime > player.frameDuration){

        player.frameTime = 0;
        player.frame++;

        if(player.frame >= frames.length){
            player.frame = 0;
        }

    }
}
export function drawPlayer(ctx, sprite) {
   let frames;

if(!player.onGround){

    if(player.vx > 0){
        frames = player.jumpRight;
    }
    else if(player.vx < 0){
        frames = player.jumpLeft;
    }
    else{
        frames = player.jumpUp;
    }

}
else if(player.currentAnimation === "runRight"){
    frames = player.runRight;
}
else if(player.currentAnimation === "runLeft"){
    frames = player.runLeft;
}
else{
    frames = player.idleFrames;
}

    const frameIndex = frames[player.frame];

    const frameWidth = 32;
    const frameHeight = 32;

    const columns = sprite.width / frameWidth;

    const sx = (frameIndex % columns) * frameWidth;
    const sy = Math.floor(frameIndex / columns) * frameHeight;

    ctx.drawImage(
        sprite,
        sx,
        sy,
        frameWidth,
        frameHeight,
        player.x,
        player.y,
        frameWidth * 3,
        frameHeight * 3
    );
}
window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" && player.onGround === true) {
        player.vy = player.jumpForce;
        player.onGround = false;
    }
});