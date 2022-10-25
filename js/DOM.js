'use strict'
let gUserPicks = { shape: '', color: '' }
let gElCanvas
let gCtx
let gStartPos
let gDx
let gDy
let gIsOnUp
let gIsOnDown = false
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']


function setUserColor(color) {
    gUserPicks.color = color
}

function setUserShape(shape) {
    gUserPicks.shape = shape
}

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    resizeCanvas()

}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function getUserColor(elColor) {
    console.log(elColor.value);
    setUserColor(elColor.value)
}
function getUserShape(elShape) {
    console.log(elShape.value);
    setUserShape(elShape.value)
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    gIsOnUp = false
    gIsOnDown = true
    console.log(ev);
    let pos = getEvPos(ev)
    gStartPos = pos
    drawShape(pos)
}

function onUp() {
    gIsOnUp = true
    gIsOnDown = false
}
function onMove(ev) {
    if (!gIsOnDown) return
    let pos = getEvPos(ev)
    gDx = pos.x - gStartPos.x
    gDy = pos.y - gStartPos.y
    gStartPos = pos
    drawShape(pos)
}

function drawShape(pos) {
    if (gIsOnUp) return
    if (gUserPicks.shape === '') gUserPicks.shape = 'line'
    if (gUserPicks.color === '') gUserPicks.color = 'black'
    switch (gUserPicks.shape) {
        case 'line':
            drawLine(pos)
            break;
        case 'square':
            drawSquare(pos)
            break;
        case 'circle':
            drawArc(pos)
            break;
        case 'triangle':
            drawTriangle(pos)
            break;
    }
}

function drawTriangle(pos){
    gCtx.beginPath() 
    gCtx.lineWidth = 2
    gCtx.moveTo(pos.x-gDx, pos.y-gDy) 
    gCtx.lineTo(pos.x-60, pos.y-50)
    gCtx.lineTo(pos.x, pos.y-100)
  
    gCtx.closePath()
 
    gCtx.fillStyle = gUserPicks.color 
    gCtx.fill() 
    gCtx.strokeStyle = 'black' 
    gCtx.stroke() 
}

function drawArc(pos) {
    gCtx.beginPath()
    gCtx.lineWidth = '1'
    gCtx.arc(pos.x - gDx, pos.y - gDy, 10, 0, 2 * Math.PI)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
    gCtx.fillStyle = gUserPicks.color
    gCtx.fill()
}

function drawSquare(pos) {
    gCtx.beginPath()
    gCtx.rect(pos.x-gDx, pos.y-gDy, 20, 20)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
    gCtx.fillStyle = gUserPicks.color
    gCtx.fill()
}

function drawLine(pos) {
    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.moveTo(pos.x - gDx, pos.y - gDy)
    gCtx.lineTo(pos.x, pos.y)
    gCtx.strokeStyle = gUserPicks.color
    gCtx.stroke()
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]

        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height) 
}

function downloadDraw(elLink) {
    const draw = gElCanvas.toDataURL('image/jpeg')
    elLink.href = draw
}



function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}


function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result

        img.onload = onImageReady.bind(null, img)

    }
    reader.readAsDataURL(ev.target.files[0])
}


function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

