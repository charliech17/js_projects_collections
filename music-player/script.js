const audio = document.getElementById("audio")
const playPauseBtn =  document.getElementById("play")
const playPauseBtnIcon = playPauseBtn.querySelector('i')
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")
const mainContainer = document.getElementById("music-container")
const cover = document.getElementById('cover')
const progess = document.getElementById("progress")
const progessContainer = document.getElementById("progress-container")

let musicList = ['hey','summer','ukulele']
let nowMusicIndex = 2

function changeSong(next) {
    if(next) {
        nowMusicIndex++
        if(nowMusicIndex === musicList.length) {
            nowMusicIndex = 0
        }
    } else {
        nowMusicIndex--
        if(nowMusicIndex<0) {
            nowMusicIndex = musicList.length - 1
        }
    }

    cover.src = `./images/${musicList[nowMusicIndex]}.jpg`
    audio.src = `./music/${musicList[nowMusicIndex]}.mp3`

    const isPlaying = mainContainer.classList.contains('play')
    if(isPlaying) {
        playSong()
    } else {
        pauseSong()
    }

}

function togglePlayPause() {
    const isPlaying = mainContainer.classList.contains('play')
    if(isPlaying) {
        pauseSong()
    } else {
        playSong()
    }
}

function pauseSong() {
    mainContainer.classList.remove('play')
    playPauseBtnIcon.classList.remove('fa-pause')
    playPauseBtnIcon.classList.add('fa-play')
    audio.pause()
}


function playSong() {
    mainContainer.classList.add('play')
    playPauseBtnIcon.classList.remove('fa-play')
    playPauseBtnIcon.classList.add('fa-pause')
    audio.play()
}

function handleProgessChange(event) {
    const evtClientX = event.clientX
    const elBoundLeft = progessContainer.getBoundingClientRect().left
    const progessWidth = window
                            .getComputedStyle(progessContainer,null)
                            .getPropertyValue("width")
                            .replace('px','')
    const duration = audio.duration
    audio.currentTime = (evtClientX- elBoundLeft) / progessWidth * duration
    timeout = null
}

let timeout = null
function handleProgessMove(event) {
    if(!isHoldingClick) return 
    if (timeout) {
		window.cancelAnimationFrame(timeout);
	}
    timeout = window.requestAnimationFrame(
        () => handleProgessChange(event)
    )
}

playPauseBtn.addEventListener("click",()=> togglePlayPause('btn'))

prevBtn.addEventListener("click",()=> changeSong(false))

nextBtn.addEventListener("click",() => changeSong(true))

audio.addEventListener("timeupdate",()=> {
    const duration = audio.duration
    const curTime = audio.currentTime
    progess.style.width = `${curTime / duration * 100}%`
})

audio.addEventListener("ended",()=> changeSong(true))


let isHoldingClick = false
progessContainer.addEventListener("pointerdown",(event)=> {
    isHoldingClick = true
    handleProgessChange(event)

    window.addEventListener("pointermove",handleProgessMove)
    window.addEventListener("pointerup",()=> {
        isHoldingClick = false
        timeout = null
        window.removeEventListener("pointermove",handleProgessMove)
    })
})

window.addEventListener("keydown",(event)=> {
    if(event.code === 'ArrowRight') {
        if(audio.currentTime + 5 >= audio.duration) {
            audio.currentTime = audio.duration - 0.5
            audio.pause()
            return 
        }
        audio.currentTime += 5 
        return 
    } 

    if(event.code === 'ArrowLeft') {
        if(audio.currentTime - 5 <= 0) {
            audio.currentTime = 0
            return 
        }
        audio.currentTime -= 5 
        return 
    } 

    if(event.code === 'Space') {
        document.activeElement.blur()
        togglePlayPause('key')
    } 
})