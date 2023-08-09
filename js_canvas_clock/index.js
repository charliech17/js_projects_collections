import './index.css'
function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

// 數字時間
const timeDisplay = document.getElementById("time_display")

// 錶面顏色
const clockBorderInput = document.querySelector("#color_section #clockBorder")
const clockFaceInput = document.querySelector("#color_section #clockFace")
const scaleColorInput = document.querySelector("#color_section #scaleColor")
const tickColorInput = document.querySelector("#color_section #tickColor")
const secondTickInput = document.querySelector("#color_section #secondTick")

clockBorderInput.value = localStorage["clockBorder"] || "#880000"
clockFaceInput.value = localStorage["clockFace"] || "#FDFCFC"
scaleColorInput.value = localStorage["scaleColor"] || "#000000"
tickColorInput.value = localStorage["tickColor"] || "#880000"
secondTickInput.value = localStorage["secondTick"] || "#FFA629"

// 按鈕
const saveColorBtn = document.querySelector("#control_section #saveColor")
const savePictureBtn = document.querySelector("#control_section #savePicture")
const resetColorBtn = document.querySelector("#control_section #resetColor")


saveColorBtn.addEventListener("click",handleSaveColor)
savePictureBtn.addEventListener("click",handleSavePicture)
resetColorBtn.addEventListener("click",handleColorReset)


// canvas
const canvas = document.getElementById("myClock")
const ctx = canvas.getContext("2d")
requestAnimationFrame(clock)


function clock() {
    ctx.save()
    
    ctx.clearRect(0, 0, 500, 500); // 要清除上一次內容
    ctx.translate(250,250)
    ctx.rotate(-Math.PI/2)


    // default設定
    ctx.strokeStyle = clockBorderInput.value
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.fillStyle = clockFaceInput.value
    
    // 畫錶面
    ctx.save()
    ctx.beginPath()
    ctx.arc(0,0,160,0,2*Math.PI)
    ctx.stroke()
    ctx.fill()
    ctx.restore()

    // 畫時針錶面
    ctx.save()
    for(let i=0;i<12;i++) {
        ctx.beginPath()
        ctx.strokeStyle = scaleColorInput.value
        ctx.lineWidth = 4
        ctx.moveTo(120,0)
        ctx.lineTo(140,0)
        ctx.rotate(2*Math.PI/12)
        ctx.stroke()
    }
    ctx.restore()
    
    // 畫分針錶面
    ctx.save()
    for(let i=0;i<60;i++) {
        if(i % 5 !== 0) {
            ctx.beginPath()
            ctx.strokeStyle = scaleColorInput.value
            ctx.lineWidth = 2
            ctx.moveTo(130,0)
            ctx.lineTo(140,0)
            ctx.stroke()
        }
        ctx.rotate(2*Math.PI/60)
    }
    ctx.restore()

    const now = new Date()
    const nowHour = now.getHours()
    const nowMinute = now.getMinutes()
    const nowSec = now.getSeconds()
    // 畫時針
    const hourDeg = (nowHour + (nowMinute/60) + (nowSec/3600)) * 30 * (Math.PI / 180)
    ctx.save()
    ctx.beginPath()
    ctx.rotate(hourDeg)
    ctx.strokeStyle = tickColorInput.value
    ctx.lineWidth = 13
    ctx.moveTo(-20,0)
    ctx.lineTo(90,0)
    ctx.stroke()
    ctx.restore()

    // 畫分針
    const minuteDeg = (nowMinute + (nowSec/60)) * 6 * Math.PI / 180
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = tickColorInput.value
    ctx.lineWidth = 6
    ctx.rotate(minuteDeg)
    ctx.moveTo(-20,0)
    ctx.lineTo(140,0)
    ctx.stroke()
    ctx.restore()


    // 畫秒針
    const secDeg = (nowSec) * 6 * Math.PI / 180
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = secondTickInput.value
    ctx.arc(0,0,5,0,2*Math.PI)
    ctx.fill()
    
    ctx.beginPath()
    ctx.strokeStyle = secondTickInput.value
    ctx.lineWidth = 3
    ctx.rotate(secDeg)
    ctx.moveTo(-25,0)
    ctx.lineTo(140,0)
    ctx.stroke()
    ctx.restore()

    //final restore
    ctx.restore()

    const displayHour = nowHour < 10 ? '0' + nowHour : nowHour
    const displayMinute = nowMinute < 10 ? '0' + nowMinute : nowMinute
    const displaySecond = nowSec < 10 ? '0'+ nowSec : nowSec
    timeDisplay.textContent = `${displayHour} : ${displayMinute} : ${displaySecond}`
    requestAnimationFrame(clock)
}

function handleSaveColor() {
    if(localStorage["prevClockBorder"]) {
        localStorage["prevClockBorder"] = localStorage["clockBorder"]
        localStorage["prevClockFace"] = localStorage["clockFace"] 
        localStorage["prevScaleColor"] = localStorage["scaleColor"]
        localStorage["prevTickColor"] = localStorage["tickColor"]
        localStorage["prevSecondTick"] = localStorage["secondTick"]
    } else {
        localStorage["prevClockBorder"] = clockBorderInput.value
        localStorage["prevClockFace"] = clockFaceInput.value
        localStorage["prevScaleColor"] = scaleColorInput.value
        localStorage["prevTickColor"] = tickColorInput.value
        localStorage["prevSecondTick"] = secondTickInput.value
    }

    localStorage["clockBorder"] = clockBorderInput.value
    localStorage["clockFace"] = clockFaceInput.value
    localStorage["scaleColor"] = scaleColorInput.value
    localStorage["tickColor"] = tickColorInput.value
    localStorage["secondTick"] = secondTickInput.value
}

function handleSavePicture() {
    const dataURL = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = 'clock.png'
    link.href = dataURL
    link.click()
}

function handleColorReset() {
    if(localStorage["prevClockBorder"]) {
        localStorage["clockBorder"] = localStorage["prevClockBorder"]
        localStorage["clockFace"] = localStorage["prevClockFace"]
        localStorage["scaleColor"] = localStorage["prevScaleColor"]
        localStorage["tickColor"] = localStorage["prevTickColor"]
        localStorage["secondTick"] = localStorage["prevSecondTick"]

        clockBorderInput.value = localStorage["prevClockBorder"]
        clockFaceInput.value = localStorage["prevClockFace"]
        scaleColorInput.value = localStorage["prevScaleColor"]
        tickColorInput.value = localStorage["prevTickColor"]
        secondTickInput.value = localStorage["prevSecondTick"]
    }
}