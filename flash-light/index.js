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
        const pointerType = event.pointerType
        let xPos,yPos
        switch(pointerType) {
            case 'mouse':
                xPos = event.pageX - styleInfo.bodyMargin
                yPos = event.pageY - styleInfo.bodyMargin
                break;
            case 'touch':
            case 'pen':
                xPos = event.touches[0].pageX - styleInfo.bodyMargin
                yPos = event.touches[0].pageY - styleInfo.bodyMargin
                break;
            
        }
        const xRatio = `${(xPos / styleInfo.containerWidth)*100}%`
        const yRatio = `${(yPos / styleInfo.containerHeight)*100}%`
        setLight(xRatio,yRatio)
    }
})

init()