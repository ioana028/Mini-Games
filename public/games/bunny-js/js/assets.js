//loading the assets

export const assets = {};
export const sounds = {};

export function loadAssets(callback) {

    let images = {
        background: "./assets/Summer81000-562.png",
        grass: "./assets/Grass-tile.png",
        grassLong: "./assets/Grass-tile-long.png",
        bunny: "./assets/Bunny/Bunny 1 16x16 animation.png",
        carrot: "./assets/carrot.png",
        particle0: "./assets/particles/frame0000.png", //D:\projects js\MemoryGame-v2\frontend\public\games\bunny-js\assets\particles\frame0000.png
        particle1: "./assets/particles/frame0001.png",
        particle2: "./assets/particles/frame0002.png",
        particle3: "./assets/particles/frame0003.png",
        particle4: "./assets/particles/frame0004.png",
        particle5: "./assets/particles/frame0005.png",
        particle6: "./assets/particles/frame0006.png",
        particle7: "./assets/particles/frame0007.png",
        arrows: "./assets/Arrows_pack.png",
        trophy:"./assets/trophy.png"
    };

    let audioFiles = {
        carrotSound: "./assets/carrot.mp3"
    };
    //D:\projects js\MemoryGame-v2\frontend\public\games\bunny-js\assets\Grass-tile.png
    let loaded = 0;
    let total = Object.keys(images).length + Object.keys(sounds).length;

    for (let key in images) {
        let img = new Image();
        img.src = images[key];

        img.onload = function () {
            loaded++;
            assets[key] = img;

            if (loaded === total)
                callback();
        }
        img.onerror = function () {
            console.error("Nu s-a încărcat:", images[key]);
        }

        for (let key in audioFiles) {
            let audio = new Audio();
            audio.src = audioFiles[key];

            audio.onloadeddata = function () {
                sounds[key] = audio;
                loaded++;
                if (loaded === total) callback();
            }
        }

    };

}

