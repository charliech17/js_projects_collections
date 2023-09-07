window.addEventListener("click",(event) => {
    // createScatter(event.pageX,event.pageY)
    createFirework(event.pageX,event.pageY)
})

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
let bgColor ='black'
function createFirework(centerX,centerY) {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const cHeight = window.innerHeight
    const cWidth = window.innerWidth
    const xCenter = cWidth / 2
    const yCenter = cHeight / 2
    let maxRadius = 15
    canvas.width = cWidth
    canvas.height = cHeight
    canvas.style.position = 'fixed'
    canvas.style.left = (centerX - xCenter) + 'px'
    canvas.style.top = (centerY - yCenter) + 'px'
    canvas.style.opacity = 1

    const pNum = 100
    const maxSpeed = 15
    const pInfo = []
    let alpha = 0 
    let count = 0
    // default設定
    ctx.strokeStyle = 'orange'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = alpha
	ctx.fillRect(0,0,canvas.width,canvas.height);


    createRandomParticle()
    requestAnimationFrame(drawFireworkDot)

    function drawFireworkDot() {
        count+=1
        ctx.clearRect(0, 0, cWidth, cHeight)
        // 畫出dash圓
        ctx.save()
        for(let i=0; i< pNum; i++) {
            const nowColor = `hsl(38.82deg 100% ${pInfo[i].brightness}%)`
            ctx.beginPath()
            ctx.fillStyle = nowColor
            const degToRad =   pInfo[i].startDeg * Math.PI / 180
            const xPoint = pInfo[i].radius * Math.cos(degToRad)
            const yPoint = pInfo[i].radius * Math.sin(degToRad)
            const nowXCenter = xCenter+xPoint
            const nowYCenter = yCenter+yPoint
            pInfo[i].radius += pInfo[i].speed
            pInfo[i].brightness = Math.min(
                (pInfo[i].brightness += pInfo[i].brightSpeed,pInfo[i].brightness)
                ,100
            )
            ctx.arc(nowXCenter,nowYCenter,pInfo[i].circleSize,0,2*Math.PI)
            ctx.fill()

            if(pInfo[i].lastPointX && pInfo[i].lastPointY) {
                ctx.save()
                const initXPoint = xCenter + pInfo[i].xStartPoint
                const initYpoint = yCenter + pInfo[i].yStartPoint
                const slope = (nowYCenter - initYpoint) / (nowXCenter - initXPoint)
                const interception =  nowYCenter - (slope * nowXCenter)
                let sign = 0
                if(
                    pInfo[i].startDeg > 0 && pInfo[i].startDeg < 90
                    || pInfo[i].startDeg > 270 && pInfo[i].startDeg < 360
                    ) {
                    sign = 1
                } else if(
                    pInfo[i].startDeg > 90 && pInfo[i].startDeg < 180
                    || pInfo[i].startDeg > 180 && pInfo[i].startDeg < 270
                    ) {
                    sign = -1
                }

                const finalX =  nowXCenter - sign * 20
                const finalY =  slope * finalX + interception
                var grad= ctx.createLinearGradient(
                    nowXCenter, nowYCenter, 
                    finalX, finalY
                );
                grad.addColorStop(0,nowColor);
                grad.addColorStop(1, bgColor);
                ctx.strokeStyle = grad;
                ctx.beginPath();
                ctx.moveTo(nowXCenter, nowYCenter);
                ctx.lineTo(finalX, finalY);
                ctx.stroke();
                ctx.closePath();
                ctx.restore()
            } 
            pInfo[i].lastPointX = nowXCenter
            pInfo[i].lastPointY = nowYCenter
            pInfo[i].lastPointColor = nowColor
            
            ctx.closePath()
            
        }
        ctx.restore()
        ctx.globalAlpha = (alpha+=0.1,alpha)
        requestAnimationFrame(drawFireworkDot)
    }

    function createRandomParticle() {
        for(let i=0; i< pNum; i++) {
            const info = {}
            
            info.radius = getRandomArbitrary(8,maxRadius)
            info.speed = getRandomArbitrary(5,maxSpeed)
            info.circleSize = getRandomArbitrary(1,10)
            info.brightness = Math.floor(getRandomArbitrary(20,40)*100)/100
            info.brightSpeed = getRandomArbitrary(0.5,2)
            info.startDeg = getRandomArbitrary(0,360)
            
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