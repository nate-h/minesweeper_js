/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
///////////////////////   MineSweeper V.2  //////////////////////
///////////////   Created by Nathanial Hapeman   ////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
///////////////////////////   vars   /////////////////////////////
//////////////////////////////////////////////////////////////////

// object literals
let stats = {
    rows: 9,
    cols: 13,
    width: 30,
    height: 30,
    numberBombs: 10,
    numberBombsNext: 10,
    shiftX: 0,
    shiftY: 0

};

let resetButton = {
    w: 80,
    h: 30,
    x: 307,
    y: 15
};

let gameClock = {
    time: 0,
    x: 25,
    y: 15,
    h: 30,
    w: 80,
    id: 0

};

let b1 = {
    w: 30,
    h: 30,
    x: 30,
    y: 335
};

let b2 = {
    w: 30,
    h: 30,
    x: 90,
    y: 335
};

let b3 = {
    w: 30,
    h: 30,
    x: 150,
    y: 335
};

// setting up arrays
var bombs = [];
var bombsFound = [];
var boxesToCheck = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0]
];

for (let i = 0; i < stats.cols; i++) {
    bombsFound[i] = new Array(stats.rows);
}

for (let i = 0; i < stats.cols; i++) {
    for (let j = 0; j < stats.rows; j++) {
        bombsFound[i][j] = -1;
    }
}

// images
var boxPic = new Image();
boxPic.src = 'img/box.png';
var numPic = new Image();
numPic.src = 'img/num.png';
var zeroPic = new Image();
zeroPic.src = 'img/zero.png';
var bombPic = new Image();
bombPic.src = 'img/bomb.png';
var bombBGPic = new Image();
bombBGPic.src = 'img/bombBG.png';

var flag = new Image();
flag.src = 'img/flag.png';
var resetPic = new Image();
resetPic.src = 'img/reset.png';
var clockPicM = new Image();
clockPicM.src = 'img/clock.png';
var radialS = new Image();
radialS.src = 'img/radialS.png';
var radialNS = new Image();
radialNS.src = 'img/radialNS.png';
var msBG = new Image();
msBG.src = 'img/mineSweeper.png';

// sound effects
var boomSound = new Audio('sounds/boomSound.wav');
var pressB = new Audio('sounds/pressB.wav');
var tada = new Audio('sounds/tada.wav');
var consuela = new Audio('sounds/consuela.wav');

// vars
var cc;
var mX;
var mY;
var clickedX;
var clickedY;
var msCanvas;
var cH;
var cW;
var gameOver = false;
var right = 2;
var boxesLeft = stats.rows * stats.cols - stats.numberBombs;
var msWidth = stats.cols * stats.width;
var msHeight = stats.rows * stats.height;
var rState = 1;

/////////////////////////////////// onload
window.addEventListener('load', loadM);
function loadM () {
    //declaring msCanvas
    msCanvas = document.getElementById('mCanvas');
    msCanvas.addEventListener('mouseup', clickedCanvas, false);
    cH = msCanvas.height;
    cW = msCanvas.width;
    msCanvas.oncontextmenu = function () {
        return false;
    };

    //giving it style
    cc = msCanvas.getContext('2d');

    cc.font = 'bold 18px verdana, sans-serif ';
    cc.fillStyle = '#ffffff';

    // pushing map
    stats.shiftX = (cW - msWidth) / 2;
    stats.shiftY = (cH - msHeight) - 40;
    gameClock.x = stats.shiftX + 5;

    // initializing other things
    init();
}

/////////////////////////////////// initialize
function init () {
    var x;
    var y;

    for (var i = 0; i < stats.numberBombs; i++) {
        // not adding duplicate bombs
        while (true) {
            x = Math.floor(Math.random() * stats.cols);
            y = Math.floor(Math.random() * stats.rows);

            if (bombsFound[x][y] !== -2) {
                bombsFound[x][y] = -2;
                bombs[i] = [x, y];
                break;
            }
        }
    }
    drawGrid();
}

//////////////////////////////////// onclick
function clickedCanvas (e) {
    var pos = getMousePos(msCanvas, e);
    mX = pos.x - stats.shiftX;
    mY = pos.y - stats.shiftY;

    if (collision(resetButton, pos.x, pos.y) === true) {
        console.log('Reset Game');
        resetMineSweeper();
        pressB.play();
        return;
    } else if (collision(gameClock, pos.x, pos.y) === true) {
        consuela.play();
        return;
    } else if (collision(b1, pos.x, pos.y) === true) {
        rState = 1;
        pressB.play();
        stats.numberBombsNext = 10;
        drawMSBottom();
        return;
    } else if (collision(b2, pos.x, pos.y) === true) {
        rState = 2;
        pressB.play();
        stats.numberBombsNext = 15;
        drawMSBottom();
        return;
    } else if (collision(b3, pos.x, pos.y) === true) {
        rState = 3;
        pressB.play();
        stats.numberBombsNext = 20;
        drawMSBottom();
        return;
    }

    if (gameOver === true) {
        return;
    }

    if (Math.floor(mX / stats.width) < stats.cols && Math.floor(mY / stats.height) < stats.rows) {
        clickedX = Math.floor(mX / stats.width);
        clickedY = Math.floor(mY / stats.height);

        // adding/ removing flag
        if (e.button === right) {
            //flag non-bomb
            if (bombsFound[clickedX][clickedY] === -1) {
                bombsFound[clickedX][clickedY] = -3;
                pressB.play();
                drawGrid();
            } else if (bombsFound[clickedX][clickedY] === -3) {
                bombsFound[clickedX][clickedY] = -1;
                pressB.play();
                drawGrid();
            }

            //flag bomb
            if (bombsFound[clickedX][clickedY] === -2) {
                bombsFound[clickedX][clickedY] = -4;
                pressB.play();
                drawGrid();
            } else if (bombsFound[clickedX][clickedY] === -4) {
                bombsFound[clickedX][clickedY] = -2;
                pressB.play();
                drawGrid();
            }
            return;
        }

        if (bombsFound[clickedX][clickedY] === -3 || bombsFound[clickedX][clickedY] === -4) {
            consuela.play();
            return;
        }

        //check if clicked bomb
        for (var i = 0; i < stats.numberBombs; i++) {
            if (clickedX === bombs[i][0] && clickedY === bombs[i][1]) {
                loseMS();
                gameOver = true;
                return;
            }
        }

        //mark number
        if (bombsFound[clickedX][clickedY] < 0) {
            pressB.play();
            clickPass(clickedX, clickedY);

            if (boxesLeft === 0) {
                winningMS();
                gameOver = true;
            } else {
                drawGrid();
            }
        }
    } else {
        console.log('Out of Range');
    }
}

//////////////////////////////////////  mineSweeperTimer

function mineSweeperTimer () {
    cc.clearRect(gameClock.x, gameClock.y, gameClock.w, gameClock.h);
    cc.drawImage(resetPic, resetButton.x, resetButton.y);
    cc.drawImage(clockPicM, gameClock.x, gameClock.y);
    cc.fillStyle = '#000000';
    cc.fillText(gameClock.time, 43, 37);
    gameClock.time++;
    if (gameClock.time === 999) {
        gameClock.time = 989;
    }
}

////////////////////////////////////// reset

function resetMineSweeper () {
    clearInterval(gameClock.id);

    gameClock.time = 0;
    boxesLeft = stats.rows * stats.cols - stats.numberBombs;
    for (var i = 0; i < stats.cols; i++) {
        for (var j = 0; j < stats.rows; j++) {
            bombsFound[i][j] = -1;
        }
    }

    var x;
    var y;

    stats.numberBombs = stats.numberBombsNext;
    for (var bombI = 0; bombI < stats.numberBombs; bombI++) {
        // not adding duplicate bombs
        while (true) {
            x = Math.floor(Math.random() * stats.cols);
            y = Math.floor(Math.random() * stats.rows);

            if (bombsFound[x][y] !== -2) {
                bombsFound[x][y] = -2;
                bombs[bombI] = [x, y];
                break;
            }
        }
    }
    gameOver = false;

    drawGrid();
}

//////////////////////////////////////////////////////////////////
///////////////////////   rendering   ////////////////////////////
//////////////////////////////////////////////////////////////////

//////////////////////////////////// draw msCanvas
function drawGrid () {
    cc.clearRect(0, 0, 400, 400);
    cc.fillStyle = 'rgba(200,200,200,1)';
    cc.fillRect(0, 0, 400, 400);
    cc.fillStyle = 'rgba(255,255, 255,1)';
    cc.drawImage(msBG, 5, 5);

    for (let i = 0; i < stats.cols; i++) {
        for (let j = 0; j < stats.rows; j++) {
            var x = i * stats.width + stats.shiftX;
            var y = j * stats.height + stats.shiftY;

            if (bombsFound[i][j] > -1) {
                if (bombsFound[i][j] > 0) {
                    cc.drawImage(numPic, x, y);
                    cc.fillText(bombsFound[i][j], x + 9, y + 21);
                } else { cc.drawImage(zeroPic, x, y); }
            } else if (bombsFound[i][j] === -3 || bombsFound[i][j] === -4) {
                cc.drawImage(flag, x, y);
            } else { cc.drawImage(boxPic, x, y); }
        }
    }
    cc.drawImage(resetPic, resetButton.x, resetButton.y);
    cc.drawImage(clockPicM, gameClock.x, gameClock.y);

    cc.fillText('E', 10, 355);
    cc.drawImage(radialNS, 30, 335);
    cc.fillText('M', 70, 355);
    cc.drawImage(radialNS, 90, 335);
    cc.fillText('H', 130, 355);
    cc.drawImage(radialNS, 150, 335);

    switch (rState) {
    case 1:
        cc.drawImage(radialS, 30, 335);
        break;
    case 2:
        cc.drawImage(radialS, 90, 335);
        break;
    case 3:
        cc.drawImage(radialS, 150, 335);
        break;
    default:
        console.log("This shouldn't display!");
    }
    cc.fillText(stats.numberBombsNext, 330, 357);
    cc.drawImage(bombPic, 360, 335);

    cc.fillStyle = '#000000';
    cc.fillText(gameClock.time, 43, 37);
}

//////////////////////////////////// loseMS
function loseMS () {
    drawGrid();

    //Rendering Bombs
    for (var i = 0; i < stats.numberBombs; i++) {
        var x = bombs[i][0] * stats.width + stats.shiftX;
        var y = bombs[i][1] * stats.height + stats.shiftY;
        cc.drawImage(bombBGPic, x, y);
    }

    boomSound.play();
    console.log('Boom! You lost    :<(   ');
    clearInterval(gameClock.id);
}

function drawMSBottom () {
    cc.clearRect(0, 330, 400, 40);
    cc.fillStyle = 'rgba(200,200,200,1)';
    cc.fillRect(0, 330, 400, 40);
    cc.fillStyle = 'rgba(255,255, 255,1)';

    cc.fillText('E', 10, 355);
    cc.drawImage(radialNS, 30, 335);
    cc.fillText('M', 70, 355);
    cc.drawImage(radialNS, 90, 335);
    cc.fillText('H', 130, 355);
    cc.drawImage(radialNS, 150, 335);

    switch (rState) {
    case 1:
        cc.drawImage(radialS, 30, 335);
        break;
    case 2:
        cc.drawImage(radialS, 90, 335);
        break;
    case 3:
        cc.drawImage(radialS, 150, 335);
        break;
    default:
        console.log("This shouldn't display!");
    }
    cc.fillText(stats.numberBombsNext, 330, 357);
    cc.drawImage(bombPic, 360, 335);
}

function winningMS () {
    drawGrid();

    // showing bombs
    for (var i = 0; i < stats.numberBombs; i++) {
        var x = bombs[i][0] * stats.width + stats.shiftX;
        var y = bombs[i][1] * stats.height + stats.shiftY;
        cc.drawImage(flag, x, y);
    }

    tada.play();

    console.log('You Won!   :<) ');
    clearInterval(gameClock.id);
}

//////////////////////////////////// click pass
function clickPass (x, y) {
    if (boxesLeft === stats.rows * stats.cols - stats.numberBombs) {
        gameClock.id = setInterval(mineSweeperTimer, 1000);
        gameClock.time++;
    }

    boxesLeft--;

    var numBombs = 0;

    for (let i in boxesToCheck) {
        var newX = x + boxesToCheck[i][0];
        var newY = y + boxesToCheck[i][1];

        if (newX >= 0 && newY >= 0 && newY < stats.rows && newX < stats.cols) {
            //check if bomb
            if (bombsFound[newX][newY] === -2 || bombsFound[newX][newY] === -4) {
                numBombs++;
            }
        }
    }

    bombsFound[x][y] = numBombs;

    if (numBombs === 0) {
        for (let i in boxesToCheck) {
            let newX = x + boxesToCheck[i][0];
            let newY = y + boxesToCheck[i][1];
            if (newX >= 0 && newY >= 0 && newY < stats.rows && newX < stats.cols) {
                if (bombsFound[newX][newY] === -1) {
                    clickPass(newX, newY);
                }
            }
        }
    }
}

////////////////////////////////////  get actual position

function getMousePos (msCanvas, evt) {
    var rect = msCanvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//////////////////////////// checking if collsion with button
function collision (boundary, x, y) {
    if (boundary.x + boundary.w < x) { return false; }
    if (boundary.x > x) { return false; }
    if (boundary.y + boundary.h < y) { return false; }
    if (boundary.y > y) { return false; }

    return true;
}
