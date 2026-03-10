//board

let board;
const rowCount = 21;
const columnsSize = 19;
const tileSize = 32;  //px  //i chose 32 cause i have 64x64 images and i will scale them in half
const boardWidth = columnsSize * tileSize;
const boardHeight = rowCount * tileSize;
let context;

//images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;



//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX"
];

const walls = new Set(); //array where adding and deleteing is eficient and can have only unique values
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ['U', 'D', 'R', 'L'];

let score=0;
let lives=3;
let gameOver=false;



//move logic
// going left  -x=-tileSize
// going right  x= tileSize
// going up    -y=-tileSize
// going down   y= tileSize



window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
    loadImages();
    loadMap();
    // console.log(walls.size)
    // console.log(foods.size);
    // console.log(ghosts.size);
    // console.log(pacman.x);

    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random() * 4)];  //0..3.999  (0..0.999) =>floor 0,1,2,3
        ghost.updateDirection(newDirection);
    }
    update();

    this.document.addEventListener("keyup", movePacman);

}




function loadImages() {
    wallImage = new Image();
    wallImage.src = "./assets/wall.png"

    blueGhostImage = new Image();
    blueGhostImage.src = "./assets/blueGhost.png"
    orangeGhostImage = new Image();
    orangeGhostImage.src = "./assets/orangeGhost.png"
    pinkGhostImage = new Image();
    pinkGhostImage.src = "./assets/pinkGhost.png"
    redGhostImage = new Image();
    redGhostImage.src = "./assets/redGhost.png"

    pacmanUpImage = new Image();
    pacmanUpImage.src = "./assets/pacmanUp.png"
    pacmanDownImage = new Image();
    pacmanDownImage.src = "./assets/pacmanDown.png"
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./assets/pacmanLeft.png"
    pacmanRightImage = new Image();
    pacmanRightImage.src = "./assets/pacmanRight.png"

}

function loadMap() {
    walls.clear();
    ghosts.clear();
    foods.clear();

    for (let r = 0; r < rowCount; r++)
        for (let c = 0; c < columnsSize; c++) {
            // const row=tileMap[r];
            const tileMapChar = tileMap[r][c]

            //calculating the pixel position of the current tile
            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == 'X') {
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            } else if (tileMapChar == 'b') {
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == 'o') {
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == 'p') {
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == 'r') {
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == 'P') {
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            } else if (tileMapChar == ' ') {
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }


        }
}

//this is the game loop
function update() {
    if(gameOver){return;}
    //move logic
    move();
    draw();
    //we can use setInterval(funct,50) (this is calling repetitively), 
    //setTimeout(update,50)  its calling it once but we can do it recursively 
    //requestAnimationFrame (this is dependent on the computer and cant be changes ex:60FPS)
    //20 FPS 1s =>1000ms/20 =50

    //the issue with the setInterval its that is going to call the function every 50 ms and some frames can overlap, 

    setTimeout(update, 50);


}

function draw() {
    context.clearRect(0, 0, boardWidth, boardHeight);
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }

    for (let wall of walls) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    for (let food of foods) {
        context.fillStyle = "yellow";
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    context.fillStyle="white";
    context.font="15px sans-serif";
    if(!gameOver)
    context.fillText("X"+lives+" score:"+score,10,20);
    else context.fillText("Game over: "+score,10,20);
    // if(gameOver){
    //     context.fillText("Game Over: "+score,tileSize/2,tileSize/2);
    // }else{
    //     context.fillText("x"+lives+" score:"+score,tileSize/2);
    // }
    


}



function move() {
   
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    //check wall colision
    for (let wall of walls.values()) {
        if (collision(pacman, wall) == 1) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    //check if pacman is eating food
    for (let food of foods.values())
        if (collision(pacman, food) == 1) {
            foods.delete(food);
            score+=10; break;
        }

    for (let ghost of ghosts.values()) {
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;
        for (let wall of walls.values()) {
            if (collision(ghost, wall) == 1) {
                ghost.x -= ghost.velocityX;
                ghost.y -= ghost.velocityY;
                const newDirection = directions[Math.floor(Math.random() * 4)];  //0..3.999  (0..0.999) =>floor 0,1,2,3
                ghost.updateDirection(newDirection);
                break;
            }
        }

        if (ghost.x < 0) { ghost.x = boardWidth - tileSize; }
        else
            if (ghost.x >= boardWidth)
                ghost.x = 0;

        if (ghost.y / tileSize == 9 && ghost.direction == "L" || ghost.direction == "R") {
            const newDirection = directions[Math.floor(Math.random() * 2)]; //"U or "D"
            ghost.updateDirection(newDirection);
        }
    }

    for(let ghost of ghosts.values()){
        if(collision(pacman,ghost)){
            lives--;
            //gameOver=true;
            resetPositions();
            if(lives==0){
                gameOver=true;
                //stopMovment();
            }
        }
    }

    //check win
    if(foods.size==0){
        loadMap();
        resetPositions();
    }
   
}

function movePacman(e) {
    if(gameOver){

        loadMap(); //for recreating the food
        lives=3;
        score=0;
        gameOver=false;
        update();
        return;
    }


    //https://www.toptal.com/developers/keycode/table
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        pacman.updateDirection("U");
    } else if (e.code == "ArrowDown" || e.code == "KeyS") {
        pacman.updateDirection("D");
    } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        pacman.updateDirection("L");
    } else if (e.code == "ArrowRight" || e.code == "KeyD") {
        pacman.updateDirection("R");
    }

    if (pacman.direction == "U")
        pacman.image = pacmanUpImage;
    else if (pacman.direction == "D")
        pacman.image = pacmanDownImage;
    else if (pacman.direction == "R")
        pacman.image = pacmanRightImage;
    else if (pacman.direction == "L")
        pacman.image = pacmanLeftImage;
}

function collision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function resetPositions(){
    pacman.reset();
    pacman.velocityX=0;
    pacman.velocityY=0;
    for(let ghost of ghosts.values()){
        ghost.reset();
    }
}

function stopMovment(){
   for(let ghost of ghosts.values()){
        ghost.velocityX=0;
        ghost.velocityY=0;
    }
}


class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();

        //we also check here for colisions
        this.x += this.velocityX;
        this.y += this.velocityY;
        for (let wall of walls.values())
            if (collision(this, wall)) {
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = prevDirection;
                this.updateVelocity();
                return;
            }
    }

    updateVelocity() {
        if (this.direction == 'R') {
            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        } else if (this.direction == 'L') {
            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        } else if (this.direction == 'U') {
            this.velocityX = 0;
            this.velocityY = -tileSize / 4;;
        } else if (this.direction == 'D') {
            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        }
    }

    reset(){
        this.x=this.startX;
        this.y=this.startY;
    }


}