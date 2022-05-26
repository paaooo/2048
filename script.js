function centerElement(element) {
    var tag = document.getElementsByTagName(element)[0];
    var body = document.getElementsByTagName("Body")[0];
    var x2 = tag.offsetWidth;
    var x1 = body.offsetWidth;
    var marginX = (x1 - x2) / 2;
    tag.style.left = marginX + "px";
}

window.onresize = () => {
    centerElement("Game");
    centerElement("Score");
    centerElement("h1");
    centerElement("h2");
}

window.onclick = () => {
    centerElement("Game");
    centerElement("Score");
    centerElement("h1");
    centerElement("h2");
}

window.onload = function () {
    // putting cells into 2d array
    var cellArray, backgroundArray = [[], [], [], []]; // Default 4x4
    var cell = document.getElementsByTagName("cell");
    var background = document.getElementsByTagName("cellBackground");
    var score = document.getElementsByTagName("Score")[0];
    var currentScore = 0;
    var boardDimension = 4; // for gameBoard() and randomCell(); Default: 4

    var gameMap = new Map();
    // cellArray changes the 2d array that takes in the cells so it's able to handle 5x5 or 6x6
    // setProperty changes the grid-template column
    var game = document.getElementsByTagName("Game")[0];
    gameMap.set(4, () => { cellArray = [[], [], [], []]; backgroundArray = [[], [], [], []]; game.style.setProperty("grid-template-columns", "auto auto auto auto"); }); // 4 x 4
    gameMap.set(5, () => { cellArray = [[], [], [], [], []]; backgroundArray = [[], [], [], [], []]; game.style.setProperty("grid-template-columns", "auto auto auto auto auto"); }); // 5 x 5
    gameMap.set(6, () => { cellArray = [[], [], [], [], [], []]; backgroundArray = [[], [], [], [], [], []]; game.style.setProperty("grid-template-columns", "auto auto auto auto auto auto"); }); // 6 x 6

    var dimensionButton = document.getElementsByTagName("Dimension");
    for (let i = 0; i < dimensionButton.length; i++) {
        dimensionButton[i].addEventListener("click", () => { gameBoard(parseInt(dimensionButton[i].id)) }); // gets 04, 05, 06 from the buttons and passes it onto gameBoard()
    }

    document.getElementsByTagName("Reset")[0].addEventListener("click", function () { startGame(); }); // Reset button

    function gameBoard(dimension) { // changes the dimension of the board
        boardDimension = dimension;
        // console.log(boardDimension);
        gameMap.get(dimension)(); // sets grid and 2d array

        for (let i = 0; i < cell.length; i++) { // resets the gameboard to dis  playing nothing
            cell[i].style.setProperty("display", "none");
            background[i].style.setProperty("display", "none");
        }
        let cellCount = 0;
        for (let row = 0; row < dimension; row++) { // sets cells into a 2d array: 4x4 by default
            for (let col = 0; col < dimension; col++) {
                cellArray[row][col] = cell[cellCount];
                cell[cellCount].style.setProperty("display", "inherit"); // makes display of each cell in the board grid
                backgroundArray[row][col] = background[cellCount];
                background[cellCount].style.setProperty("display", "inherit");
                cellCount++;
            }
        }
        startGame(); // sets the board by default
        // cellArray[0][1].innerText = "1024";
        // cellArray[0][0].innerText = "1024";
        // keeping the game and the score at the center of the screen
        centerElement("Game");
        centerElement("Score");
        centerElement("h1");
        centerElement("h2");
    }

    // returns if there's still cells that are empty
    function emptyCells() {
        for (let row = 0; row < cellArray.length; row++) {
            for (let col = 0; col < cellArray[row].length; col++) {
                if (cellArray[row][col].innerText == "") {
                    return true;
                }
            }
        }
        return false;
    }

    function random(int) { // generates random number depending on parameter
        return Math.floor(Math.random() * int);
    }

    function randomCell() { // finds a random cell in the board
        while (emptyCells()) {
            let rand1 = random(boardDimension);
            let rand2 = random(boardDimension);
            if (cellArray[rand1][rand2].innerText == "") {
                cellArray[rand1][rand2].innerText = generateNumber(); // generateNumber() adds 2 or 4 to random cell found
                break;
            }
        }
    }

    // generates 2 or 4, with 2 being more likely than 4
    function generateNumber() {
        if (random(5) == 0) { return 2; } else { return 2; }
    }

    function updateScore(add) { // adds to score
        currentScore += add;
        score.innerText = "Score: " + currentScore;
    }

    // move functions
    function move(direction) {
        let movement = 0; // to keep track if the gameboard actually moves after the input or if it's just a dead keypress (for purposes of adding a new random cell)
        switch (direction) {
            case "up":
                for (let row = 1; row < cellArray.length; row++) { // goes downwards
                    for (let col = 0; col < cellArray[row].length; col++) {
                        if (cellArray[row][col].innerText != "") {
                            let cellMoved = row; //keeps track of the cell being moved
                            let jumpCount = 0;
                            while (cellMoved != 0 && cellArray[cellMoved - 1][col].innerText == "") {
                                cellArray[cellMoved - 1][col].innerText = cellArray[cellMoved][col].innerText;
                                cellArray[cellMoved][col].innerText = "";
                                cellMoved--;
                                movement++;
                                jumpCount++;
                            }
                            if (mergeCells(cellMoved, col, direction)) {
                                movement++;
                                jumpCount++;
                            }
                            Animate(cellArray[row][col], jumpCount, direction);
                        }
                    }
                }
                break;
            case "down":
                for (let row = cellArray.length - 2; row >= 0; row--) { // goes upwards
                    for (let col = 0; col < cellArray[row].length; col++) {
                        if (cellArray[row][col].innerText != "") {
                            let cellMoved = row; //keeps track of the cell being moved
                            let jumpCount = 0;
                            while (cellMoved != cellArray.length - 1 && cellArray[cellMoved + 1][col].innerText == "") {
                                cellArray[cellMoved + 1][col].innerText = cellArray[cellMoved][col].innerText;
                                cellArray[cellMoved][col].innerText = "";
                                cellMoved++;
                                movement++;
                                jumpCount++;
                            }
                            if (mergeCells(cellMoved, col, direction)) {
                                movement++;
                                jumpCount++;
                            }
                            Animate(cellArray[row][col], jumpCount, direction);
                        }
                    }
                }
                break;
            case "left":
                for (let row = 0; row < cellArray.length; row++) {
                    for (let col = 1; col < cellArray[row].length; col++) { // goes left to right
                        if (cellArray[row][col].innerText != "") {
                            let cellMoved = col; //keeps track of the cell being moved
                            let jumpCount = 0;
                            while (cellMoved != 0 && cellArray[row][cellMoved - 1].innerText == "") {
                                cellArray[row][cellMoved - 1].innerText = cellArray[row][cellMoved].innerText;
                                cellArray[row][cellMoved].innerText = "";
                                cellMoved--;
                                movement++;
                                jumpCount++;
                            }
                            if (mergeCells(row, cellMoved, direction)) {
                                movement++;
                                jumpCount++;
                            }
                            Animate(cellArray[row][col], jumpCount, direction);
                        }
                    }
                }
                break;
            case "right":
                for (let row = 0; row < cellArray.length; row++) {
                    for (let col = cellArray[row].length - 2; col >= 0; col--) { // goes right to left
                        if (cellArray[row][col].innerText != "") {
                            let cellMoved = col; //keeps track of the cell being moved
                            let jumpCount = 0;
                            while (cellMoved != cellArray[row].length - 1 && cellArray[row][cellMoved + 1].innerText == "") {
                                cellArray[row][cellMoved + 1].innerText = cellArray[row][cellMoved].innerText;
                                cellArray[row][cellMoved].innerText = "";
                                cellMoved++;
                                movement++;
                                jumpCount++
                            }
                            if (mergeCells(row, cellMoved, direction)) {
                                movement++;
                                jumpCount++;
                            }
                            Animate(cellArray[row][col], jumpCount, direction);
                        }
                    }
                }
                break;
            default:
                break;
        }
        // anim.then(() => color());
        if (movement > 0) { randomCell(); } //keeps track if any cell moved at all (to prevent adding a random cell when a key is pressed but nothing moved)
    }
    // Merges cells together if they have the same string (gets called inside move function)
    function mergeCells(row, col, direction) {
        let movement = false; // For the gameboard to recognize merging as movement (for purposes of adding a new random cell)
        switch (direction) {
            case "up":
                if (row !== 0 && cellArray[row - 1][col].innerText == cellArray[row][col].innerText) {
                    cellArray[row - 1][col].innerText = parseInt(cellArray[row][col].innerText) * 2;
                    cellArray[row][col].innerText = "";
                    movement = true;
                    updateScore(parseInt(cellArray[row - 1][col].innerText));
                }
                break;
            case "down":
                if (row !== boardDimension - 1 && cellArray[row + 1][col].innerText == cellArray[row][col].innerText) {
                    cellArray[row + 1][col].innerText = parseInt(cellArray[row][col].innerText) * 2;
                    cellArray[row][col].innerText = "";
                    movement = true;
                    updateScore(parseInt(cellArray[row + 1][col].innerText));
                }
                break;
            case "left":
                if (col !== 0 && cellArray[row][col - 1].innerText == cellArray[row][col].innerText) {
                    cellArray[row][col - 1].innerText = parseInt(cellArray[row][col].innerText) * 2;
                    cellArray[row][col].innerText = "";
                    movement = true;
                    updateScore(parseInt(cellArray[row][col - 1].innerText));
                }
                break;
            case "right":
                if (col !== boardDimension - 1 && cellArray[row][col + 1].innerText == cellArray[row][col].innerText) {
                    cellArray[row][col + 1].innerText = parseInt(cellArray[row][col].innerText) * 2;
                    cellArray[row][col].innerText = "";
                    movement = true;
                    updateScore(parseInt(cellArray[row][col + 1].innerText));
                }
                break;
            default:
                break;
        }
        return movement; // for move function to recognize a movement
    }

    //Animation
    function Animate(cellMoved, jumpCount, direction) { // moves background cell instead of actual cell
        // jumpCount is how far the cell has to move, used for velocity and final position
        let pos = 4 * jumpCount; // how fast the cell moves, also it's position
        if (direction == 'left' || direction == 'up') { // makes pos negative so it goes the opposite way based on direction
            pos *= -1;
        }
let count = 0;
        let move = pos; // used to increment pos
        let finalPos = (106 * jumpCount); // final position 
        let stop = () => { // runs when the cell reaches its final position
            count++
            console.log(count);
            if (Math.abs(pos) >= finalPos) {
                cellMoved.style.setProperty("z-index", "1");
                clearInterval(animation);
                cellMoved.style.top = "0px"
                cellMoved.style.left = "0px"
            }
        }

        let animation = null;
        cellMoved.style.setProperty("z-index", "2");
        switch (direction) {
            case "down":
            case "up":
                animation = setInterval(() => {
                    cellMoved.style.top = pos + 'px';
                    pos += move;
                    stop(); //stops cell at its final position
                }, 1)
                break;
            case "right":
            case "left":
                animation = setInterval(() => {
                    cellMoved.style.left = pos + 'px';
                    pos += move;
                    stop();// stops cell at its final position
                }, 1)
                break;
            default:
                break;
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
        if (directionMap.has(event.code)) {
            event.preventDefault();
            directionMap.get(event.code)();
        }
        setTimeout(() => color(), 25);
        win();
        centerElement("Game");
        centerElement("Score");
        centerElement("h1");
        centerElement("h2");

    })

    //Color
    var colorMap = new Map();
    colorMap.set("", "#515354");
    colorMap.set("2", "#4c545c");
    colorMap.set("4", "#666b70");
    colorMap.set("8", "#2e423a");
    colorMap.set("16", "#38805d");
    colorMap.set("32", "#2d9161");
    colorMap.set("64", "#0fa65d");
    colorMap.set("128", "#6d869c");
    colorMap.set("256", "#52799c");
    colorMap.set("512", "#4176a3");
    colorMap.set("1024", "#2d76b5");
    colorMap.set("2048", "#0e84eb");
    var colorKeys = Array.from(colorMap.keys()); // sets the keys to an array
    function color() { // changes color of cells depending on number
        for (let row = 0; row < cellArray.length; row++) {
            for (let col = 0; col < cellArray[row].length; col++) {
                let cell = cellArray[row][col];
                let back = backgroundArray[row][col];
                if (colorMap.has(cell.innerText)) {
                    cell.style.setProperty("background-color", colorMap.get(cell.innerText));
                    back.style.setProperty("background-color", colorMap.get(back.innerText));
                } else {
                    cell.style.setProperty("background-color", colorMap.get(colorKeys[random(colorKeys.length)])); // makes a colorful win screen
                }
            }
        }
    }

    function startGame() { // sets the whole gameboard empty and adds two random numbers on it.
        for (let i = 0; i < cell.length; i++) {
            cell[i].innerText = "";
        }
        currentScore = 0;
        updateScore(0);
        randomCell();
        randomCell();
        color();
    }

    function checkWin() { // checks if any cell has 2048
        for (let i = 0; i < cell.length; i++) {
            if (cell[i].innerText == "2048") {
                return true;
            }
        }
        return false;
    }

    function win() { // Will be executing after every input
        if (checkWin()) { // prints a win message
            let randString = [" ", "­", "؜", "឴", " ", " "] // invisible characters

            for (let i = 0; i < cell.length; i++) { //invisible string to make win-screen colorful
                cell[i].innerText = `${randString[random(6)]}${randString[random(6)]}${randString[random(6)]}${randString[random(6)]}${randString[random(6)]}`; // lower chance of generating NaN when moving
            }

            let middle = Math.ceil(cellArray.length / 2) - 1;
            cellArray[middle][middle - 1].innerText = "Y";
            cellArray[middle][middle].innerText = "O";
            cellArray[middle][middle + 1].innerText = "U";
            cellArray[middle + 1][middle - 1].innerText = "W";
            cellArray[middle + 1][middle].innerText = "I";
            cellArray[middle + 1][middle + 1].innerText = "N";
            cellArray[middle + 1][middle + 2].innerText = "!";
            //for empty cells to get filled up with random strings so they don't combine (for larger gameboards)
            color();
        }
    }
    gameBoard(boardDimension); // starts the game in a 4x4 by default
    // backgroundArray[0][0].innerText = "PAO";

}