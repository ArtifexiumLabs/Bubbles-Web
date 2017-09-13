//TODO add more hiring options
//TODO begin work on hiring factories
//TODO stress test
//TODO only allow 5000 bubbles to be saved, after that, bubbles are not saved, only generated and drawn. If bubbles fall below 5000, clear, and draw remaining bubbles.

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
    canvas.addEventListener('click', drawOne, false);
    context = canvas.getContext("2d");
    window.onload = window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    countLabel = document.getElementById("count");
    additionLabel = document.getElementById("addition");
    updateLabels();

}

function drawOne() {
    var xPos = Math.floor(Math.random() * document.body.clientWidth);
    var yPos = Math.floor(Math.random() * document.body.clientHeight);
    var r = Math.floor((Math.random() * 100) + 10);
    var c = getRandomColor();
    bubbles.push({
        x: xPos,
        y: yPos,
        radius: r,
        color: c
    });
    count++;
    context.beginPath();
    context.arc(xPos, yPos, r, 0, 2 * Math.PI);
    context.fillStyle = c;
    context.fill();
    updateLabels();
}

function drawMultiple() {
    if (carryOver > 1) {
        carryOver--;
        drawOne();
    }
    carryOver += addition % 1;
    for (var i = 0; i < addition - addition % 1; i++) {
        drawOne();
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
    if (bubbles.length < amount) {
        return;
    }
    bubbles.splice(0, amount);
    count -= amount;
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
    countLabel.innerHTML = "Bubbles: " + count;
    additionLabel.innerHTML = "Bubbles/second: " + addition.toFixed(1);

}

function preventZoom(e) {
    var t2 = e.timeStamp;
    var t1 = e.currentTarget.dataset.lastTouch || t2;
    var dt = t2 - t1;
    var fingers = e.touches.length;
    e.currentTarget.dataset.lastTouch = t2;

    if (!dt || dt > 500 || fingers > 1) return; // not double-tap

    e.preventDefault();
    e.target.click();
}

init();
setInterval(drawMultiple, 1000);
