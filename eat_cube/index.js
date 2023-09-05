const eatCube = document.getElementById("cube")
const eatTarget = document.getElementById("food") 
const borderWrapper = document.getElementById("wrapper")

const gameInfo = {
    ArrowRight: 'ArrowRight',
    ArrowLeft: 'ArrowLeft',
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    pageMargin: '16',
    borderWidth: 0,
    borderHeight: 0,
    boundryLeft: 0,
    boundryRight: 0,
    boundryTop: 0,
    boundryBottom: 0,
    cubeYNum:0,
    cubeXNum:0,
    interval: null
}

const cubeInfo = {
    moveSpace: 50,
    msMoveNext: 250,
    direction: 'ArrowRight',
    size: 50,
}
const targetCube = {
    left: 0,
    top: 0,
}
let allCube = [
    {left: 50,top:100}
]

const colorArray = ['green','purple','orange','wheat','black','pink']

function init() {
    document.body.style.margin = gameInfo.pageMargin + 'px'
    eatCube.style.width = cubeInfo.size + 'px'
    eatCube.style.height = cubeInfo.size + 'px'
    eatCube.style.left = allCube[0].left + 'px'
    eatCube.style.top = allCube[0].top + 'px'
    eatTarget.style.width = cubeInfo.size + 'px'
    eatTarget.style.height = cubeInfo.size + 'px'
    
    gameInfo.cubeXNum = Math.floor(
        ((window.innerWidth - 2 * gameInfo.pageMargin) 
        / cubeInfo.size)
    )
    gameInfo.cubeYNum = Math.floor(
        ((window.innerHeight - 2 * gameInfo.pageMargin) / cubeInfo.size)
    ) - 3 

    borderWrapper.style.width = 
        `${ gameInfo.cubeXNum * cubeInfo.size}px`
    borderWrapper.style.height = 
        `${ gameInfo.cubeYNum * cubeInfo.size }px`


    calcBoundory()
    generateFood()
    
    gameInfo.interval = setInterval(()=>{
        moveCube(cubeInfo.direction)
        isGameOver()
    },cubeInfo.msMoveNext)
    
    window.addEventListener("keydown",(event)=>{
        console.log(event.key,eatCube.style.top)
        if(gameInfo[event.key]) {
            cubeInfo.direction = gameInfo[event.key]
        }
    })
}

function calcBoundory() {
    gameInfo.boundryLeft = gameInfo.pageMargin
    gameInfo.boundryRight = calStyleValue(gameInfo.boundryLeft,'width')
    gameInfo.boundryTop = gameInfo.pageMargin
    gameInfo.boundryBottom = calStyleValue(gameInfo.boundryTop,'height')
    console.log(gameInfo)
}

function moveCube(direction) {
    let leftPos = Number(eatCube.style.left.replace("px",""))
    let topPos = Number(eatCube.style.top.replace("px",""))
    switch(direction) {
        case gameInfo.ArrowRight:
            leftPos += cubeInfo.moveSpace
            break;
        case gameInfo.ArrowLeft:
            leftPos -= cubeInfo.moveSpace,leftPos
            break;
        case gameInfo.ArrowUp:
            topPos -= cubeInfo.moveSpace,topPos
            break;
        case gameInfo.ArrowDown:
            topPos += cubeInfo.moveSpace,topPos
            break;
    }
    
    const lastCubePos = JSON.parse(JSON.stringify(allCube))
    allCube = []
    allCube[0] = {top: topPos, left:leftPos}
    if(!isEatFood()) {
        lastCubePos.pop()
    }
    lastCubePos.forEach((posInfo) => {
        allCube.push(posInfo)
    })
    
    if(isEatFood()) {
        const newChild = document.createElement("div")
        newChild.classList.add("cubeChild")
        newChild.style.width = cubeInfo.size + 'px'
        newChild.style.height = cubeInfo.size + 'px'
        newChild.style.backgroundColor = 'black'
        newChild.style.position = 'absolute'
        borderWrapper.appendChild(newChild)
        generateFood()
    }


    const allChildren = document.getElementsByClassName('cubeChild') || []
    eatCube.style.top = topPos + 'px'
    eatCube.style.left = leftPos + 'px'
    for (let i = 0; i < allChildren.length; i++) {
        allChildren[i].style.top = allCube[i+1].top + 'px'
        allChildren[i].style.left = allCube[i+1].left + 'px'
    }
    
}

function isEatFood() {
    if(
        allCube[0].top === targetCube.top
        && allCube[0].left === targetCube.left
    ) {
        return true
    }
    return false
}

function generateFood() {
    // setup food position
    targetCube.left = getRandomArbitrary(0,gameInfo.cubeXNum) * cubeInfo.size 
    targetCube.top = getRandomArbitrary(0,gameInfo.cubeYNum) * cubeInfo.size 
    eatTarget.style.top = targetCube.top + 'px'
    eatTarget.style.left = targetCube.left + 'px'
}

function calStyleValue(prevValue,propertyName) {
    const baseValue = prevValue.replace("px","")
    const wrapperWidth = window.getComputedStyle(borderWrapper,null)
                                .getPropertyValue(propertyName)
                                .replace("px","")
    return Number(baseValue) + Number(wrapperWidth)
}

function isGameOver() {
    const cubeRect = eatCube.getBoundingClientRect()

    // 右邊界
    if(gameInfo.boundryRight - Number(cubeRect.right) < -1) {
        stopGame()
        return
    }
    // 左邊界
    if(Number(cubeRect.left) - gameInfo.boundryLeft < -1) {
        stopGame()
        return
    }
    // 上邊界
    if(Number(cubeRect.top) - gameInfo.boundryTop < -1) {
        stopGame()
        return
    }

    if(gameInfo.boundryBottom - Number(cubeRect.bottom) < -1) {
        stopGame()
        return
    }

}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function stopGame() {
    clearInterval(gameInfo.interval)
    gameInfo.interval = null
    alert('game over')
}

init()