'use strict'

const MINE = '💣'
const EMPTY_CELL = ' ';
const FLAG = '🚩';
var gLevel = { SIZE: 4, MINES: 2, FLAGS: 3 };
var gBoard;
var gTimer;
var gCell;
var gGame = { isOn: false, shownCount: 0, markedCount: gLevel.FLAGS, secsPassed: 0 }


// the Function who run all the game
function init() {
    gBoard = createBoard();
    generateRandomMines(gLevel.MINES);
    renderBoard(gBoard);
    gGame.isOn = false;
    restartGame()
}

// the target is to open this function in cellClick to get the other cells open:
// i using another function to get the negs count around an then sent them to anothr matrix.

function expandShown(elCell, board, i, j) {
    var matrix = getMinesNegsCount(i, j, board);
    for (var i = 0; i < matrix.length; i++) {
        if (matrix[i] && elCell.innerText === '0') {
            renderCell({ i: matrix[i][0], j: matrix[i][1] }, setMinesNegsCount(i, j, board));
            // console.log('marix is:', matrix)
            gBoard[matrix[i][0]][matrix[i][1]].isShown = true;
        }
    }
}
// helped me to open the negs around empty cells;
function getMinesNegsCount(cellI, cellJ, mat) {
    var matrix = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if ((i === cellI && j === cellJ) || j < 0 || j >= mat[i].length) continue;
            if (!mat[i][j].isMine) {
                matrix[i + j] = [i, j];
            }
        }
    }
    return matrix;
}

// count the negs around!!!
function setMinesNegsCount(cellI, cellJ, mat) {
    var countMinesNegs = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if ((i === cellI && j === cellJ) || j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine) countMinesNegs++
        }
    }
    return countMinesNegs;

}

function changeBoardSize(level) {

    if (level === 'easy') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        gLevel.FLAGS = 3;
        gGame.markedCount = gLevel.FLAGS
    }
    if (level === 'medium') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        gLevel.FLAGS = 6;
        gGame.markedCount = gLevel.FLAGS
    }
    if (level === 'hard') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        gLevel.FLAGS = 12;
        gGame.markedCount = gLevel.FLAGS
    }
    init()
}




// function who check for game over;
function checkGameOver() {
    var countMine = 0;
    var countShown = 0;
    var countMarked = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown) countShown++;
            if (gBoard[i][j].isMine) countMine++;
            if (gBoard[i][j].isMarked) countMarked++;
        }
    }
    if ((countMarked + countShown) === (gBoard.length * gBoard.length)) {

        return true;
    }
    return false;
}
// marked the cells with flags by using right stick in mouse...
function cellMarked(elCell, i, j) {
    window.oncontextmenu = function () {
        if (gGame.markedCount !== 0) {
            elCell.isMarked = true;
            elCell.innerText = FLAG;
            gBoard[i][j].isMarked = true;
            gGame.markedCount--;
            var elFlag = document.querySelector('p span');
            elFlag.innerText = gGame.markedCount
        } else {
            var flag = document.querySelector('p span')
            flag.innerText = 'No More Flags';
        }



        if (checkGameOver()) {
            alert('game over')
        }
    }
}
// everythin happened hear - the most important function.
function cellClick(elCell, i, j) {
    var sec = 1;
    if (!gGame.isOn) {
        gGame.isOn = true;
        gTimer = setInterval(function () {
            var time = new Date(sec * 1000).toString().split(':');
            var currTime = time[1] + ':' + time[2].split(' ')[0];
            document.querySelector('.timer-display').innerHTML = currTime;
            sec++;
        }, 1000);
    }
    var modelCell = gBoard[i][j];
    // console.log('modelCell is:', modelCell)
    var display = modelCell.isMine ? MINE : modelCell.minesAroundCount;
    renderCell({ i: i, j: j }, display);
    if (gBoard[i][j].isMine) {
        clearInterval(gTimer);
        // restartGame()
        // gGame.isOn = false;
        var elRes = document.querySelector('.button4');
        elRes.style.display = 'block';
        // console.log('elres is:', elRes)
    } else {
        expandShown(elCell, gBoard, i, j);
    }
    gBoard[i][j].isShown = true;
    checkGameOver()



    // console.log(modelCell);
}

function restartGame() {
    var elRestart = document.querySelector('.button4');
    elRestart.style.display = 'none';
    var elBoard = document.querySelector('.table')
    elBoard.style.display = 'block';
    document.querySelector('.timer-display').innerHTML = '00:00';
    var elFlag = document.querySelector('p span');
    elFlag.innerText = gLevel.FLAGS
    gGame.markedCount = gLevel.FLAGS
    renderBoard(gBoard)

}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = EMPTY_CELL;
            strHTML += `<td class="cell-${i}-${j} cell" onclick="cellClick(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})">
        ${currCell}</td>`
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function createBoard() {
    var board = getMat(gLevel.SIZE);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = gCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    var mineIdxi = getRandomInt(0, gLevel.SIZE)
    var mineIdxj = getRandomInt(0, gLevel.SIZE)
    var randIdxi = getRandomInt(0, gLevel.SIZE)
    var randIdxj = getRandomInt(0, gLevel.SIZE)

    board[mineIdxi][mineIdxj].isMine = true;
    board[randIdxi][randIdxj].isMine = true;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(i, j, board);
        }
    }
    return board
}


function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function generateRandomMines(mines) {
    for (var i = 1; i < mines; i++) {
        var emptyCells = getEmptyCells(gBoard);
        var randIdx = getRandomInt(0, emptyCells.length);
        var emptyPos = emptyCells[randIdx];
        gBoard[emptyPos.i][emptyPos.j].isMine = true
    }
}
function getEmptyCells(gBoard) {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            var position = {
                i: i,
                j: j
            }
            if (!cell.isMine) {
                emptyCells.push(position)
            }
        }
    }
    return emptyCells
}