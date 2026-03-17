export let particles = [];

const PARTICLES_LIFE=400; 

export function spawnParticles(x,y){
    for(let i=0;i<6;i++){
        particles.push({
            x:x,
            y:y,
            vx:(Math.random()-0.5)*4,
            vy:(Math.random()-0.5)*4,
            life:PARTICLES_LIFE,
            frame: Math.floor(Math.random() * 8)
        })
    }
}

export function updateParticles(delta){

    for(let p of particles){
        p.x += p.vx;
        p.y += p.vy;
        p.life -= delta;
    }

    // șterge particulele moarte
    particles = particles.filter(p => p.life > 0);
}

export function drawParticles(ctx, particleImages){

    for(let p of particles){

        const img = particleImages[p.frame];

        ctx.drawImage(
            img,
            p.x,
            p.y,
            16 * 2,
            16 * 2
        );
    }
}