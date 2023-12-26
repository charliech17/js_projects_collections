const canvas = document.getElementById("cvs")
const ctx = canvas.getContext("2d")

const select = document.getElementById("moveSL")

// width,height
const CANVAS_WIDTH = canvas.width = 600
const CANVAS_HEIGHT = canvas.height = 600

// image
const playerImage = new Image()
playerImage.src = "../shadow_dog.png"

// start animate
function animateSquare() { // 畫正方形
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    ctx.fillRect(x,50,100,100);
    requestAnimationFrame(animateSquare);
}

function drawImage3() {
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    ctx.drawImage(playerImage,0,0); // keep original image width and height
    requestAnimationFrame(drawImage3);
}

function drawImage5() {
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    ctx.drawImage(playerImage,0,0,CANVAS_WIDTH,CANVAS_HEIGHT); 
    requestAnimationFrame(drawImage5);
}

const spriteWidth = 575; // 6856/12 = 573
const spriteHeight = 523; // 5230/10
let frameX = 0;
let frameY = 0;
let gameFrame = 0;
let movement = "still"
let recordTimes = 0;
const staggerFrames = 8;
const animationState = {
    "idle": {
        col: 0,
        rowFrames: 7,
        times: 2,
    },
    "jump":{
        col: 1,
        rowFrames: 7,
        times: 1,
    },
    "still": {
        col: 2,
        rowFrames: 7,
    },
    "run": {
        col: 3,
        rowFrames: 9,
        times: 70,
    },
    "circle": {
        col: 6,
        rowFrames: 7,
        times: 70,
    },
    "fall": {
        col: 8,
        rowFrames: 12,
        times: 50,
    },
}

function animateHardCode() {
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    // ctx.drawImage(playerImage,sx,sy,sw,sh,dx,dy,dw,dh);
    ctx.drawImage(playerImage,frameX * spriteWidth,frameY * spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight)

    if(gameFrame % staggerFrames == 0) {
        if(frameX<6) frameX++;
        else frameX = 0;
        gameFrame = 0
    }

    gameFrame++
    requestAnimationFrame(animate);
}

function animate() {
    const {col,rowFrames,times} = animationState[movement]

    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    // ctx.drawImage(playerImage,sx,sy,sw,sh,dx,dy,dw,dh);
    ctx.drawImage(playerImage,frameX * spriteWidth,col * spriteHeight,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight)

    if(gameFrame % staggerFrames == 0) {
        if(frameX<rowFrames-1) frameX++;
        else frameX = 0;
        gameFrame = 0
    }

    gameFrame++
    requestAnimationFrame(animate);
}

window.addEventListener("keydown",(evt)=>{
    console.log()
    const pressKey = evt.key
    switch(pressKey){
        case "ArrowRight":
            movement = "run"
            break;
        case "ArrowUp": 
            movement = "circle"
            break;
        case "ArrowDown": 
            movement = "fall"
            break;
        case "ArrowLeft": 
            movement = "still"
            break;
    }
    select.value = movement
})

function handleSelectChange() {
    movement = select.value
}

animate()