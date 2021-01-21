'use strict'
console.log('hello utils')

function getMat(size) {
    var rows = size, cols = size;
    var mat = [];
    for (var i = 0; i < rows; i++) {
        mat[i] = [];
        for (var j = 0; j < cols; j++) {
            mat[i][j] = []
        }
    }
    return mat;
}

function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}
