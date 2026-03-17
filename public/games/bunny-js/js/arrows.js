export let arrows = [];

const ARROW_SIZE = 32;
const SCALE = 2;
const SPEED = 3;

export function spawnArrow(canvasWidth, canvasHeight){

    const side = Math.floor(Math.random() * 4);

    let arrow = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0
    };

    if(side === 0){
        // left → right
        arrow.x = -50;
        arrow.y = Math.random() * canvasHeight;
        arrow.vx = SPEED;
    }
    else if(side === 1){
        // right → left
        arrow.x = canvasWidth + 50;
        arrow.y = Math.random() * canvasHeight;
        arrow.vx = -SPEED;
    }
    else if(side === 2){
        // top → down
        arrow.x = Math.random() * canvasWidth;
        arrow.y = -50;
        arrow.vy = SPEED;
    }
    else{
        // bottom → up
        arrow.x = Math.random() * canvasWidth;
        arrow.y = canvasHeight + 50;
        arrow.vy = -SPEED;
    }

    arrows.push(arrow);
}

export function updateArrows(canvasWidth, canvasHeight){

    for(let a of arrows){
        a.x += a.vx;
        a.y += a.vy;
    }

    // șterge dacă ies din ecran
    arrows = arrows.filter(a =>
        a.x > -100 &&
        a.x < canvasWidth + 100 &&
        a.y > -100 &&
        a.y < canvasHeight + 100
    );
}

export function drawArrows(ctx, sprite){

    const frameWidth = 1024;
    const frameHeight = 1024;

    const sx = 0;
    const sy = 0;

    for(let a of arrows){

        ctx.save();

        // mutăm origin în centrul săgeții
        ctx.translate(a.x + 32, a.y + 32);

        // 🔥 ROTATION BASED ON DIRECTION
        if(a.vx > 0){
            // →
            ctx.rotate(0);
        }
        else if(a.vx < 0){
            // ←
            ctx.rotate(Math.PI);
        }
        else if(a.vy > 0){
            // ↓
            ctx.rotate(Math.PI / 2);
        }
        else if(a.vy < 0){
            // ↑
            ctx.rotate(-Math.PI / 2);
        }

        ctx.drawImage(
            sprite,
            sx,
            sy,
            frameWidth,
            frameHeight,
            -32, // IMPORTANT (centrat)
            -32,
            128,
            128
        );

        ctx.restore();

        // debug box
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(a.x, a.y, 64, 64);
    }
}
