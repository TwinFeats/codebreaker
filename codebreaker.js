var gameSize = 6;
var solution = [];
var rnd = new Srand();
var gameboard;
var palette;
var numColors = [6, 8, 10];
var turn = 1;
var colors = ["red", "yellow", "green", "cyan", "violet", "orange", "pink", "purple", "brown", "royalblue"];

function init() {
    newGame();
}

function newGame() {
    gameboard = document.getElementById("gameboard");
    palette = document.getElementById("palette");
    gameSize = parseInt(document.getElementById("gameSize").value);
    turn = 1;
    solution = [];
    document.getElementById('submitCode').disabled = true;
    for (var i=0;i<gameSize;i++) {
        solution.push(colors[rnd.intInRange(0, numColors[gameSize-4]-1)]);
    }
    gameboard.classList = `gameboard${gameSize}`;
    palette.classList = `gameboard${gameSize}`;

    var html = '<div id="turn1">1</div>';
    for (var c=0;c<gameSize;c++) {
        html += '<div onpointerdown="holeClicked(event)"></div>';
    }
    html += "<div></div>";  //separator
    html += "<div></div>";  //white score
    html += "<div></div>";  //black score
    gameboard.innerHTML = html;

    var html = '<div></div>';
    if (gameSize == 6) html = "";
    for (var c=0;c<numColors[gameSize-4];c++) {
        html += "<div></div>";
    }
    if (gameSize == 4) {
        html += "<div></div>";  //separator
    }
    palette.innerHTML = html;
    var paletteColors = document.querySelectorAll("#palette > *");
    var idx = 1;
    if (gameSize == 6) idx = 0;
    for (var c=0;c<numColors[gameSize-4];c++) {
        paletteColors[idx+c].classList.add(colors[c]);
        paletteColors[idx+c].addEventListener("pointerdown", paletteClicked);
    }
}

function paletteClicked(event) {
    document.querySelector("#palette .selected")?.classList.remove("selected");
    event.target.classList.toggle("selected");
}

function holeClicked(event) {
    var item = event.target;
    while (!item.id) {
        item = item.previousElementSibling;
    }
    if (item.id == `turn${turn}`) {
        var color = document.querySelector("#palette .selected")?.classList[0];
        if (color) {
            event.target.classList = color;
            var row = document.getElementById(`turn${turn}`);
            var count = 0;
            while (row.nextElementSibling) {
                if (row.classList.length > 0) {
                    count++;
                }
                row = row.nextElementSibling;
            }
            document.getElementById('submitCode').disabled = (count != gameSize);
        }
    }
}

function playGood() {
    document.getElementById("goodAudio").play();
}

function playBad() {
    document.getElementById("badAudio").play();
}

function help() {
    document.getElementById("rules").classList.add("show");
}

function closeHelp() {
    document.getElementById("rules").classList.remove("show");
}

function submitCode(event) {
    var code = [];
    var copy = [...solution];
    console.log(solution);
    var row = document.getElementById(`turn${turn}`);
    while (row.nextElementSibling) {
        if (row.classList.length > 0) {
            code.push(row.classList[0]);
        }
        row = row.nextElementSibling;
    }
    var correct = 0;
    var nearly = 0;
    for (var i = 0; i < code.length; i++) {
        if (code[i] == copy[i]) {
            correct++;
            code[i] = "code";
            copy[i] = "copy";
        }
    }
    for (var i = 0; i < code.length; i++) {
        if (code[i] != "code") {
            for (var j = 0; j < copy.length; j++) {
                if (copy[j] != "copy") {
                    if (code[i] == copy[j]) {
                        nearly++;
                        code[i] = "code";
                        copy[j] = "copy";
                    }
                }
            }
        }
    }

    row.parentElement.children[((turn-1) * (gameSize + 4)) + gameSize+2].innerHTML = `<div>${correct}</div>`;
    row.parentElement.children[((turn-1) * (gameSize + 4)) + gameSize+3].innerHTML = `<div>${nearly}</div>`;
    row.parentElement.children[((turn-1) * (gameSize + 4)) + gameSize+2].classList.add("white");
    row.parentElement.children[((turn-1) * (gameSize + 4)) + gameSize+3].classList.add("black");

    if (correct != gameSize) {
        playBad();
        turn++;
        var html = `<div id="turn${turn}">${turn}</div>`;
        for (var c=0;c<gameSize;c++) {
            html += '<div onpointerdown="holeClicked(event)"></div>';
        }
        html += "<div></div>";  //separator
        html += "<div></div>";  //white score
        html += "<div></div>";  //black score
        gameboard.innerHTML = gameboard.innerHTML + html;
    } else {
        playGood();
        blink(10, "win")
    }
}

function blink(count, cssClass) {
    document.getElementById("gameboard").classList.toggle(cssClass);
    setTimeout(function() {
        if (--count > 0) {
            blink(count, cssClass);
        }
    }, 250);
}
