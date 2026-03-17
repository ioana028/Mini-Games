export let carrots = [];
import { sounds } from "./assets.js";
import { spawnParticles } from "./particles.js";


const CARROT_SIZE=32;
const SCALE=2;
export function spawnCarrots(spots){
    carrots= [];

    const count = Math.floor((Math.random()*2)+1);

    const shuffled= [...spots].sort(()=>Math.random()-0.5);

    for(let i=0;i<count;i++){
        carrots.push({
            x: shuffled[i].x, 
            y:shuffled[i].y,
            collected:false
        });
    }

    
}

export function updateCarrots(player,addScore){
    for(let carrot of carrots){
        if(carrot.collected) continue;
        
        const overlap =  player.x < carrot.x + 32 &&
            player.x + 32 > carrot.x &&
            player.y < carrot.y + 32 &&
            player.y + 32 > carrot.y;

        if(overlap===true){
            carrot.collected=true;

            sounds.carrotSound.currentTime=0;
            sounds.carrotSound.play();

             spawnParticles(carrot.x + 16, carrot.y + 16);

            addScore(1);
        }
    }

    

    
}

export function drawCarrots(ctx,carrotImage){
    for(let carrot of carrots){
        if(carrot.collected===true) {continue; carrots.pop(carrot)}

        ctx.drawImage(carrotImage,carrot.x,carrot.y,32*2,32*2);
    }

  
}