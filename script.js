function centerElement(element) {
    var tag = document.getElementsByTagName(element)[0];
    var body = document.getElementsByTagName("Body")[0];
    var x2 = tag.offsetWidth;
    var x1 = body.offsetWidth;
    var marginX = (x1 - x2) / 2;
    tag.style.left = marginX + "px";
}

function center() {
    centerElement("Game");
    centerElement("Score");
    centerElement("h1");
    centerElement("h2");
}

function random(int) { // generates random number based on parameter
    return Math.floor(Math.random() * int);
}

var colorMap = new Map();
colorMap.set(0, "#515354");
colorMap.set(2, "#4c545c");
colorMap.set(4, "#666b70");
colorMap.set(8, "#2e423a");
colorMap.set(16, "#38805d");
colorMap.set(32, "#2d9161");
colorMap.set(64, "#0fa65d");
colorMap.set(128, "#6d869c");
colorMap.set(256, "#52799c");
colorMap.set(512, "#4176a3");
colorMap.set(1024, "#2d76b5");
colorMap.set(2048, "#0e84eb");

class Cell {
    // 2d
    row;
    col;
    // 1d
    count;

    value;
    merge; // stops already merged cells from merging
    constructor(row, col, count) {
        this.row = row;
        this.col = col;
        this.count = count;
        this.value = 0;
        this.merge = true;
    }
    color() {
        if (colorMap.has(this.value)) {
            return colorMap.get(this.value);
        } else {
            var colorKeys = Array.from(colorMap.keys()); // sets the keys to an array
            return colorMap.get(colorKeys[random(colorKeys.length)]); // returns random colors to other values
            // used for win screen to be colorful
        }
    }
    makeZero() { // makes the cell value into 0; for mergin/resetting
        this.value = 0;
    }
    zero() {
        return this.value === 0;
    }
    double() { // doubles the value of the cell; for merging
        this.value *= 2;
    }
    validNum() {
        let nums = [2, 4, 6, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]
        return (nums.indexOf(this.value) === -1);
    }
}
window.onload = () => {
    // Sounds
    var sound = {
        moveSound: new Howl({ src: ['sounds/move.mp3'], volume: 0.7 }),
        mergeSound: new Howl({ src: ['sounds/merge.mp3'], volume: 0.5 }),
        winSound: new Howl({ src: ['sounds/win.mp3'] })
    }

    var cellArray = null; // 2d array of every active cell
    var displayArray = document.getElementsByTagName("cell"); // only used for displaying innerText
    var background = document.getElementsByTagName("cellBackground"); // default background behind cells
    var game = document.getElementsByTagName("Game")[0]; // game element (the board)
    var dimension = 4; // for makeBoard() and randomCell(); Default: 4
    var dimensionButton = document.getElementsByTagName("Dimension"); // 4x4, 5x5, 6x6 buttons
    var currentScore = 0;
    var won = false; // to stop animate function when the user won
    var moving = false; // top stop inputs when the board's animating

    for (let i = 0; i < dimensionButton.length; i++) {
        dimensionButton[i].addEventListener("click", () => {
            dimension = parseInt(dimensionButton[i].id); // sets the dimension for the board
            makeBoard(dimension);
        }); // gets 04, 05, 06 from the buttons and passes it onto gameBoard()
    }

    makeBoard(dimension);
    function makeBoard(dimension) {
        for (let i = 0; i < displayArray.length; i++) { // Resets / Deletes board
            displayArray[i].style.setProperty("display", "none");
            background[i].style.setProperty("display", "none");
        }

        let cellCount = 0;
        cellArray = new Array(dimension);
        for (let row = 0; row < dimension; row++) { // Makes new board
            let tempArray = new Array(dimension);
            for (let col = 0; col < dimension; col++) {
                tempArray[col] = new Cell(row, col, cellCount); // Sets cells into a 2d array
                displayArray[cellCount].style.setProperty("display", "inherit"); // Makes the cells being used visible
                background[cellCount].style.setProperty("display", "inherit");
                cellCount++;
            }
            cellArray[row] = tempArray;
        }
        game.style.setProperty("grid-template-columns", "auto ".repeat(dimension)); // Sets grid template to match dimensions

        startGame();
        center();
    }

    function startGame() {
        for (let i = 0; i < dimension * dimension; i++) { // Resets the board
            let cell = findCount(i);
            cell.makeZero(); // sets all cell value to be 0
        }
        won = false;
        currentScore = 0;
        updateScore(0);
        randomCell();
        randomCell();
        // cellArray[0][0].value = 1024;
        // cellArray[0][1].value = 1024;
        display();
    }

    document.getElementsByTagName("Reset")[0].addEventListener("click", function () { startGame(); }); // Reset button

    function win() {
        let check = false;
        for (let i = 0; i < dimension * dimension; i++) {
            let cell = findCount(i);
            if (cell.value === 2048) {
                check = true;
            }
        }

        if (check) {
            for (let i = 0; i < dimension * dimension; i++) {
                let cell = findCount(i);
                // resets all values to random numbers for colorful winscreen
                cell.value = random(10) + Math.random();
            }
            display();
            //win message
            let winMessage = () => {
                let mid = Math.ceil(dimension / 2) - 1;
                displayArray[cellArray[mid][mid - 1].count].innerText = "Y";
                displayArray[cellArray[mid][mid].count].innerText = "O";
                displayArray[cellArray[mid][mid + 1].count].innerText = "U";
                displayArray[cellArray[mid + 1][mid - 1].count].innerText = "W";
                displayArray[cellArray[mid + 1][mid].count].innerText = "I";
                displayArray[cellArray[mid + 1][mid + 1].count].innerText = "N";
                displayArray[cellArray[mid + 1][mid + 2].count].innerText = "!";
                cellArray[0][0].value = 2048; // keeps win screen on the board until reset 
            }
            winMessage();
            if (!won) {
                setTimeout(() => winMessage(), 210); // redesplays win message after last animation
                sound.winSound.play(); // plays mergeSound once when the player wins until player resets
                won = true;
            }
        }
    }

    function randomCell() { // Finds a random empty cell in the board
        let emptyCells = () => {
            for (let i = 0; i < dimension * dimension; i++) {
                let cell = findCount(i);
                if (cell.zero()) {
                    return true;
                }
            }
            return false;
        }
        while (emptyCells()) { // Checks if there are empty cells available
            // Finds a random cell
            let rand1 = random(dimension);
            let rand2 = random(dimension);
            let generateNumber = () => {
                if (random(5) === 0) { return 4; } else { return 2; } // returns 2 80% of the time, 4 20% of the time
            }
            if (cellArray[rand1][rand2].zero()) { // Checks if the cell is empty
                cellArray[rand1][rand2].value = generateNumber(); // generateNumber() adds 2 or 4 to random cell found
                displayCell(cellArray[rand1][rand2]);
                break;
            }

        }
    }

    function displayCell(cell) { // individually displays cells
        displayArray[cell.count].innerText = cell.value;
        displayArray[cell.count].style.setProperty("background-color", cell.color());
        if (cell.validNum()) {
            displayArray[cell.count].innerText = "";
        }
    }

    function display() { // displays all the cells' values onto the cell's text
        for (let i = 0; i < dimension * dimension; i++) {
            let cell = findCount(i);
            displayCell(cell);
        }
    }

    //find functions: has to have different names because retard javascript doesn't support overrides
    function findCount(count) { // finds specific cell based on count
        for (let row = 0; row < dimension; row++) {
            for (let col = 0; col < dimension; col++) {
                if (cellArray[row][col].count === count) {
                    return cellArray[row][col];
                }
            }
        }
    }

    function resetMerge() { // resets cells used for merge so they can merge again
        for (let i = 0; i < dimension * dimension; i++) {
            let cell = findCount(i);
            cell.merge = true;
        }
    }

    function updateScore(num) {
        currentScore += num;
        document.getElementsByTagName("Score")[0].innerText = "Score: " + currentScore;
    }

    function merge(cell, direction) {
        let moved = false; // to recognize merging as movement
        // if statements check if it's at the edge of the board, if it's the same as the next cell, and if the next cell has already merged
        switch (direction) {
            case "right":
                if (cell.col != dimension - 1 && cellArray[cell.row][cell.col + 1].value === cell.value && cellArray[cell.row][cell.col + 1].merge) {
                    cellArray[cell.row][cell.col + 1].double();
                    cellArray[cell.row][cell.col + 1].merge = false; // turns off merging for next cells
                    cell.makeZero(); // makes cell "moved" into 0
                    moved = true;
                    updateScore(cellArray[cell.row][cell.col + 1].value);
                }
                break;
            case "left":
                if (cell.col != 0 && cellArray[cell.row][cell.col - 1].value === cell.value && cellArray[cell.row][cell.col - 1].merge) {
                    cellArray[cell.row][cell.col - 1].double();
                    cellArray[cell.row][cell.col - 1].merge = false; // turns off merging for next cells
                    cell.makeZero(); // makes cell "moved" into 0
                    moved = true;
                    updateScore(cellArray[cell.row][cell.col - 1].value);
                }
                break;
            case "up":
                if (cell.row != 0 && cellArray[cell.row - 1][cell.col].value === cell.value && cellArray[cell.row - 1][cell.col].merge) {
                    cellArray[cell.row - 1][cell.col].double();
                    cellArray[cell.row - 1][cell.col].merge = false; // turns off merging for next cells
                    cell.makeZero(); // makes cell "moved" into 0
                    moved = true;
                    updateScore(cellArray[cell.row - 1][cell.col].value);
                }
                break;
            case "down":
                if (cell.row != dimension - 1 && cellArray[cell.row + 1][cell.col].value === cell.value && cellArray[cell.row + 1][cell.col].merge) {
                    cellArray[cell.row + 1][cell.col].double();
                    cellArray[cell.row + 1][cell.col].merge = false; // turns off merging for next cells
                    cell.makeZero(); // makes cell "moved" into 0
                    moved = true;
                    updateScore(cellArray[cell.row + 1][cell.col].value);
                }
                break;
            default:
                break;
        }
        return moved; // to recognize merging cells as movement
    }

    // Move function
    function move(direction) {
        let movement = 0; // to keep track if something actually moved with the input
        let merged = 0; // to keep track if a cell has merged (to play sound once later)
        switch (direction) {
            case "up":
                for (let row = 1; row < dimension; row++) { // goes downwards
                    for (let col = 0; col < dimension; col++) {
                        if (!cellArray[row][col].zero()) { // skips zeroes
                            let rowMoved = row; // keeps track of the cell being moved
                            let jumpCount = 0; // keepts track of how many times the cell moved
                            while (rowMoved != 0 && cellArray[rowMoved - 1][col].zero()) { // "moves" each cell to where it's not empty
                                cellArray[rowMoved - 1][col].value = cellArray[rowMoved][col].value;
                                cellArray[rowMoved][col].makeZero();
                                rowMoved--;
                                movement++;
                                jumpCount++;
                            }
                            if (merge(cellArray[rowMoved][col], direction)) {
                                rowMoved--;
                                movement++;
                                jumpCount++;
                                merged++;
                            }
                            animate(cellArray[row][col], jumpCount, direction, cellArray[rowMoved][col]);
                        }
                    }
                }
                break;
            case "down":
                for (let row = dimension - 2; row >= 0; row--) { // goes upwards
                    for (let col = 0; col < dimension; col++) {
                        if (!cellArray[row][col].zero()) { // skips zeroes
                            let rowMoved = row; // keeps track of the cell being moved
                            let jumpCount = 0; // keepts track of how many times the cell moved
                            while (rowMoved != dimension - 1 && cellArray[rowMoved + 1][col].zero()) { // "moves" each cell to where it's not empty
                                cellArray[rowMoved + 1][col].value = cellArray[rowMoved][col].value;
                                cellArray[rowMoved][col].makeZero();
                                rowMoved++;
                                movement++;
                                jumpCount++;
                            }
                            if (merge(cellArray[rowMoved][col], direction)) {
                                rowMoved++;
                                movement++;
                                jumpCount++;
                                merged++;
                            }
                            animate(cellArray[row][col], jumpCount, direction, cellArray[rowMoved][col]);
                        }
                    }
                }
                break;
            case "left":
                for (let row = 0; row < dimension; row++) {
                    for (let col = 1; col < dimension; col++) { // goes left to right
                        if (!cellArray[row][col].zero()) { // skips zeroes
                            let colMoved = col;
                            let jumpCount = 0; // keepts track of how many times the cell moved
                            while (colMoved != 0 && cellArray[row][colMoved - 1].zero()) { // "moves" each cell to where it's not empty
                                cellArray[row][colMoved - 1].value = cellArray[row][colMoved].value;
                                cellArray[row][colMoved].makeZero();
                                colMoved--;
                                movement++;
                                jumpCount++;
                            }
                            if (merge(cellArray[row][colMoved], direction)) {
                                colMoved--;
                                movement++;
                                jumpCount++;
                                merged++;
                            }
                            animate(cellArray[row][col], jumpCount, direction, cellArray[row][colMoved]);
                        }
                    }
                }
                break;
            case "right":
                for (let row = 0; row < dimension; row++) {
                    for (let col = dimension - 2; col >= 0; col--) { // goes right to left
                        if (!cellArray[row][col].zero()) { // skips zeroes
                            let colMoved = col;
                            let jumpCount = 0; // keepts track of how many times the cell moved
                            while (colMoved != dimension - 1 && cellArray[row][colMoved + 1].zero()) { // "moves" each cell to where it's not empty
                                cellArray[row][colMoved + 1].value = cellArray[row][colMoved].value;
                                cellArray[row][colMoved].makeZero();
                                colMoved++;
                                movement++;
                                jumpCount++;
                            }
                            if (merge(cellArray[row][colMoved], direction)) {
                                colMoved++;
                                movement++;
                                jumpCount++;
                                merged++;
                            }
                            animate(cellArray[row][col], jumpCount, direction, cellArray[row][colMoved]);
                        }
                    }
                }
                break;
            default:
                break;
        }
        // plays merge sound once if merged
        if (merged > 0) { sound.mergeSound.play(); }
        // timeout finishes after animation
        setTimeout(() => { if (movement > 0) { randomCell(); } }, 195); // spawns a random cell if a movement happened
        resetMerge();
    }

    function animate(cell, jumpCount, direction, cellEnd) {
        if (!won) { // turns off animations when user won
            let pos = 2 * jumpCount; // position and velocity
            if (direction == 'left' || direction == 'up') { // makes pos negative so it goes the opposite way based on direction
                pos *= -1;
            }
            let move = pos; // used to increment pos
            let finalPos = (106 * jumpCount); // final position
            let stop = () => { // runs when the cell reaches its final position
                if (Math.abs(pos) >= finalPos) {
                    // resets after animation
                    displayArray[cell.count].style.setProperty("z-index", "1");
                    clearInterval(animation);
                    displayArray[cell.count].style.top = "0px"
                    displayArray[cell.count].style.left = "0px"
                    moving = false;
                    // displaying cells' actual values after animation
                    displayCell(cell);
                    displayCell(cellEnd);
                }
            }

            let animation = null;
            displayArray[cell.count].style.setProperty("z-index", "2"); // puts the cell on top of everything
            switch (direction) {
                case "down":
                case "up":
                    animation = setInterval(() => {
                        displayArray[cell.count].style.top = pos + 'px';
                        pos += move;
                        moving = true; // turns off movement when animation is happening
                        stop(); //stops the cell at its final position
                    }, 1)
                    break;
                case "right":
                case "left":
                    animation = setInterval(() => {
                        displayArray[cell.count].style.left = pos + 'px';
                        pos += move;
                        moving = true; // turns off movement when animation is happening
                        stop();// stops cell at its final position
                    }, 1)
                    break;
                default:
                    break;
            }
        }
    }

    // Key presses
    var directionMap = new Map();
    directionMap.set("ArrowRight", () => move("right"));
    directionMap.set("KeyD", () => move("right"));
    directionMap.set("ArrowLeft", () => move("left"));
    directionMap.set("KeyA", () => move("left"));
    directionMap.set("ArrowUp", () => move("up"));
    directionMap.set("KeyW", () => move("up"));
    directionMap.set("ArrowDown", () => move("down"));
    directionMap.set("KeyS", () => move("down"));
    window.addEventListener("keydown", (event) => {
        if (directionMap.has(event.code) && !moving) { // turns off movement when animation is happening
            event.preventDefault();
            sound.moveSound.play();
            directionMap.get(event.code)();
        }
        win();
        center();
    })
}

window.onresize = () => center();