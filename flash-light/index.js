const container = document.getElementById("container")
const light = document.getElementById("light")

const styleInfo = {
    bodyMargin: '16',
    containerWidth: 0,
    containerHeight: 0,
    lightHidePos: '-1000px'
}
const mouseInfo = {
    isInContainer: false,

}


function hideLight() {
    setLight(styleInfo.lightHidePos,styleInfo.lightHidePos)
}

function setLight(xPos,yPos) {
    light.style.setProperty("--lightXPos",xPos)
    light.style.setProperty("--lightYPos",yPos)
}

function getComputedValue(element,propName) {
    const styValue = window.getComputedStyle(element,null)
                                .getPropertyValue(propName)
                                .replace("px","")
    return styValue
}

function calContainerStyle() {
    styleInfo.containerWidth  =  getComputedValue(container,'width')
    styleInfo.containerHeight =  getComputedValue(container,'height')
}

function init() {
    document.body.style.setProperty("--bodyMargin",`${styleInfo.bodyMargin}px`)
    hideLight()
    calContainerStyle()
}

container.addEventListener("pointerenter",() => {
    mouseInfo.isInContainer = true
})

container.addEventListener("pointerleave",() => {
    mouseInfo.isInContainer = false
    hideLight()
})

window.addEventListener("pointermove",(event)=> {
    if(mouseInfo.isInContainer) {
        const xPos = event.pageX - styleInfo.bodyMargin
        const yPos = event.pageY - styleInfo.bodyMargin
        const xRatio = `${(xPos / styleInfo.containerWidth)*100}%`
        const yRatio = `${(yPos / styleInfo.containerHeight)*100}%`
        setLight(xRatio,yRatio)
    }
})

init()