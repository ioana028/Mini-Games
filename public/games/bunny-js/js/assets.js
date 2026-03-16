//loading the assets

export const assets={};

export function loadAssets(callback){

    let images = {
        background:"./assets/Summer81000-562.png",
        grass: "./assets/Grass-tile.png",
        grassLong: "./assets/Grass-tile-long.png",
        bunny:"./assets/Bunny/Bunny 1 16x16 animation.png"
    };
//D:\projects js\MemoryGame-v2\frontend\public\games\bunny-js\assets\Grass-tile.png
    let loaded=0;
    let total= Object.keys(images).length;

    for(let key in images){
        let img= new Image();
        img.src=images[key];

        img.onload = function(){
            loaded++;
            assets[key]=img;

            if(loaded===total)
                callback();
        }
         img.onerror = function(){
    console.error("Nu s-a încărcat:", images[key]);
    }

   
};

}

