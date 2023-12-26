function init() {
    const root = document.querySelector(':root')
    const vh = window.innerHeight / 100
    root.style.setProperty("--vh",vh)
}

// css 散射版本
function createScatter(centerX,centerY) {
    const radius = 30
    const ptWidth = '10px'
    const ptHeight = '10px'
    const frwsDegs = ['0','30','60','90','120','150','180','210','240','270','300','330']
    const perDegsInfo = []

    frwsDegs.forEach((deg,index)=> {
        const particle = document.createElement('div')
        const degToRad = deg * Math.PI / 180
        const ptID = new Date().toISOString() + "__" + index;
        const xIncreaseFactor = radius * Math.cos(degToRad)
        const yIncreaseFactor = radius * Math.sin(degToRad)
        const initX = centerX + radius * Math.cos(degToRad)
        const initY = centerY + radius * Math.sin(degToRad)
        particle.id = ptID
        particle.style.width = ptWidth
        particle.style.height = ptHeight
        particle.style.borderRadius = '50%'
        particle.style.backgroundColor = 'orange'
        particle.style.position = 'fixed'
        particle.style.left = initX + 'px'
        particle.style.top =  initY + 'px'
        particle.style.transition = 'top 0.1s,left 0.1s'
        particle.style.opacity =  '1'
        document.body.appendChild(particle)
        perDegsInfo.push({
            ptID,
            initX,
            initY,
            xIncreaseFactor,
            yIncreaseFactor
        })
    })

    let limit = 30
    let times = 0
    const perMoveFactor = 1
    let inter = setInterval(()=> {
        times += 1
        const isAboveLimit = times > limit
        if(isAboveLimit) {
            clearInterval(inter)
        }
        perDegsInfo.forEach((ptInfo) => {
            const {initX,initY,ptID,xIncreaseFactor,yIncreaseFactor} = ptInfo
            const particle = document.getElementById(ptID)
            if(isAboveLimit) {
                particle.remove()
                return
            }
            particle.style.left = (initX + perMoveFactor * times * xIncreaseFactor) + 'px'
            particle.style.top =  (initY + perMoveFactor * times * yIncreaseFactor) + 'px'
            particle.style.opacity = Number(particle.style.opacity)
        })
    },100)

}

// canvas
function createFirework(pointX,pointY) {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const cHeight = window.innerHeight
    const cWidth = window.innerWidth
    const xCenter = cWidth / 2
    const yCenter = cHeight / 2
    const pNum = 100
    const maxSpeed = 15
    const pInfo = []
    let maxRadius = 15

    canvas.width = cWidth
    canvas.height = cHeight
    canvas.style.position = 'fixed'
    canvas.style.left = 0 + 'px'
    canvas.style.top = 0 + 'px'
    canvas.style.opacity = 1
    // default設定
    ctx.strokeStyle = 'orange'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.globalCompositeOperation = 'lighter'


    createRandomParticle()
    requestAnimationFrame(drawFireworkDot)

    function drawFireworkDot() {
        const judgeCanvasDelArr = []
        ctx.clearRect(0, 0, cWidth, cHeight)
        // 畫出dash圓
        ctx.save()
        for(let i=0; i< pNum; i++) {
            const { brightness,startDeg, radius, speed, 
                    brightSpeed,circleSize,saveLastPoints,
                    alpha,alphaSpeed,saveLimit,colorInfo,startTimeStamp} = pInfo[i]
            const colorAlpha = Math.min(Math.floor(alpha*10)/10,1) 
            const nowColor = `hsla(${colorInfo.deg} ${colorInfo.sat} ${brightness}% / ${colorAlpha})` //38.82deg, 100% 170deg 75%
            ctx.beginPath()
            ctx.fillStyle = nowColor
            const degToRad =   startDeg * Math.PI / 180
            const xPoint = radius * Math.cos(degToRad)
            const yPoint =  radius * Math.sin(degToRad) 
                            + ((400) * Math.pow((new Date()-startTimeStamp)/1000,2))
            const nowXCenter =  xPoint + pointX
            const nowYCenter =  yPoint + pointY
            pInfo[i].radius += speed
            pInfo[i].brightness = Math.min(
                (pInfo[i].brightness += brightSpeed,pInfo[i].brightness)
                ,100
            )
            ctx.arc(nowXCenter,nowYCenter,circleSize,0,2*Math.PI)
            ctx.fill()

            if(saveLastPoints.length > 0) {
                ctx.save()
                const finalX =  saveLastPoints[0].x
                const finalY =  saveLastPoints[0].y
                var grad = ctx.createLinearGradient(
                    nowXCenter, nowYCenter, 
                    finalX, finalY
                );
                grad.addColorStop(0,nowColor);
                grad.addColorStop(1, saveLastPoints[0].color);
                ctx.strokeStyle = grad;
                ctx.lineWidth = circleSize + 1
                ctx.beginPath();
                ctx.moveTo(nowXCenter, nowYCenter);
                ctx.lineTo(finalX, finalY);
                ctx.stroke();
                ctx.closePath();
                ctx.restore()
            } 

            saveLastPoints.push({
                x: nowXCenter,
                y: nowYCenter,
                color:  nowColor
            })
            if(saveLastPoints.length > saveLimit) {
                saveLastPoints.shift()
            }
            pInfo[i].alpha -= alphaSpeed


            if(nowXCenter > cWidth || nowYCenter > cHeight) {
                judgeCanvasDelArr.push(true)
            }

            ctx.closePath()
        }
        ctx.restore()

        if(judgeCanvasDelArr.length === pNum) return canvas.remove()
        requestAnimationFrame(drawFireworkDot)
    }

    function createRandomParticle() {
        const colorArr = [
            {deg:'38.82deg',sat:'100%'},
            {deg:'170deg',sat:'75%'},
            {deg:'349.52deg',sat:'100%'},
            {deg:'54deg',sat:'100%'},
        ]
        const colorInfo = colorArr[Math.floor(getRandomArbitrary(0,colorArr.length))]
        for(let i=0; i< pNum; i++) {
            const info = {}
            
            info.radius = getRandomArbitrary(8,maxRadius)
            info.speed = getRandomArbitrary(5,maxSpeed)
            info.circleSize = getRandomArbitrary(1,10)
            info.brightness = Math.floor(getRandomArbitrary(10,30)*100)/100
            info.brightSpeed = Math.floor(getRandomArbitrary(15,40))/10
            info.startDeg = getRandomArbitrary(0,360)
            info.saveLastPoints = []
            info.saveLimit = Math.floor(getRandomArbitrary(3,7))
            info.alpha = 1
            info.alphaSpeed = getRandomArbitrary(0.001,0.05)
            info.colorInfo = colorInfo
            info.startTimeStamp = new Date()
            
            const degToRad =   info.startDeg * Math.PI / 180
            const xStartPoint = info.radius * Math.cos(degToRad)
            const yStartPoint = info.radius * Math.sin(degToRad)
            info.xStartPoint = xStartPoint
            info.yStartPoint = yStartPoint

            const initColor = `hsl(38.82deg 100% ${info.brightness}%)`
            info.initColor = initColor
            pInfo.push(info)
        }
    }

    document.body.appendChild(canvas)
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

window.addEventListener("click",(event) => {
    console.log('hello click')
    createFirework(event.pageX,event.pageY)
})

window.addEventListener("touchstart",(event) => {
    console.log('hello touch')
    createFirework(event.pageX,event.pageY)
})

init()