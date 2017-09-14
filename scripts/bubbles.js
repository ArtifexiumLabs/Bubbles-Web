//TODO begin work on hiring factories

var canvas;
var context;
var bubbles = [];
var count = 0;
var addition = 0;
var carryOver = 0;
var countLabel;
var additionLabel;

function init() {
    canvas = document.getElementById("bubbleCanvas");
    canvas.addEventListener('touchstart', preventZoom);
    canvas.addEventListener('click', userClick, false);
    context = canvas.getContext("2d");
    window.onload = window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    countLabel = document.getElementById("count");
    additionLabel = document.getElementById("addition");
    updateLabels();
}

function userClick() {
    drawOne();
    updateLabels();
}

function drawOne() {
    var xPos = Math.floor(Math.random() * document.body.clientWidth);
    var yPos = Math.floor(Math.random() * document.body.clientHeight);
    var r = Math.floor((Math.random() * 100) + 10);
    var c = getRandomColor();
    if (bubbles.length < 5000) {
        bubbles.push({
            x: xPos,
            y: yPos,
            radius: r,
            color: c
        });
    }
    count++;
    context.beginPath();
    context.arc(xPos, yPos, r, 0, 2 * Math.PI);
    context.fillStyle = c;
    context.fill();
}

function drawMultiple() {
    if (carryOver > 1) {
        carryOver--;
        drawOne();
    }
    carryOver += addition % 1;
    for (var i = 0; i < addition - addition % 1; i++) {
        if (i < 500) {
            drawOne();
        } else {
            count += addition - 500;
            break;
        }
    }

}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function buy(amount, rate) {
    if (count < amount) {
        return;
    }
    count -= amount;
    if (count < 5000) {
        bubbles.splice(0, 5000 - count);
    }
    addition += rate;
    redraw();
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < bubbles.length; i++) {
        context.beginPath();
        context.arc(bubbles[i].x, bubbles[i].y, bubbles[i].radius, 0, 2 * Math.PI);
        context.fillStyle = bubbles[i].color;
        context.fill();
    }
    updateLabels();
}

function updateLabels() {
    countLabel.innerHTML = "Bubbles: " + count.toFixed(1);
    additionLabel.innerHTML = "Bubbles/second: " + addition.toFixed(1);
}

function preventZoom(e) {
    var t2 = e.timeStamp;
    var t1 = e.currentTarget.dataset.lastTouch || t2;
    var dt = t2 - t1;
    var fingers = e.touches.length;
    e.currentTarget.dataset.lastTouch = t2;

    if (!dt || dt > 500 || fingers > 1)
        return; // not double-tap

    e.preventDefault();
    e.target.click();
}

init();
setInterval(drawMultiple, 1000);
setInterval(updateLabels, 1000);
