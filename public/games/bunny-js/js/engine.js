let lastTime=0;

export function startGameLoop(update,draw){
    function gameLoop(time){
        let delta=time-lastTime; //calcul cat timp a trecut de la ultimul frame
        lastTime=time;

        update(delta);
        draw();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop); //broserul trimite automat parametrul time=timestamp in milisecunde de cand a pornit pagina
}