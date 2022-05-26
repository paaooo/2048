// redo
function centerElement(element) {
    var tag = document.getElementsByTagName(element)[0];
    var body = document.getElementsByTagName("Body")[0];
    var x2 = tag.offsetWidth;
    var x1 = body.offsetWidth;
    var marginX = (x1 - x2) / 2;
    tag.style.left = marginX + "px";
}

function random(int) { // generates random number based on parameter
    return Math.floor(Math.random() * int);
}

class Cell {
    row;
    col;
    count;
    value;
    colorMap = new Map();

    constructor(row, col, count) {
        this.row = row;
        this.col = col;
        this.count = count;
        this.value = 0;
    }
    color() {
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
        if (colorMap.has(this.value)) {
            return colorMap.get(this.value);
        } else {
            var colorKeys = Array.from(colorMap.keys()); // sets the keys to an array
            return colorMap.get(colorKeys[random(colorKeys.length)]); // returns random colors to other values
            // used for win screen to be colorful
        }
    }
}

window.onload = () => {
    var cellArray = null; // 2d array of every active cell
    var displayArray = document.getElementsByTagName("cell"); // only used for displaying innerText
    var background = document.getElementsByTagName("cellBackground"); // default background behind cells
    var game = document.getElementsByTagName("Game")[0]; // game element (the board)
    var dimension = 4; // for makeBoard() and randomCell(); Default: 4
    var dimensionButton = document.getElementsByTagName("Dimension"); // 4x4, 5x5, 6x6 buttons

    for (let i = 0; i < dimensionButton.length; i++) {
        dimensionButton[i].addEventListener("click", () => {
            dimension = parseInt(dimensionButton[i].id);
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

        centerElement("Game");
        centerElement("Score");
        centerElement("h1");
        centerElement("h2");
    }

    function startGame() {
        for (let i = 0; i < dimension * dimension; i++) { // Resets the board
            let cell = find(i);
            cell.value = 0; // sets all cell value to be 0
        }
        randomCell();
        randomCell();
        display();
    }

    document.getElementsByTagName("Reset")[0].addEventListener("click", function () { startGame(); }); // Reset button

    function randomCell() { // Finds a random empty cell in the board
        let emptyCells = () => {
            for (let i = 0; i < dimension * dimension; i++) {
                let cell = find(i);
                if (cell.value == 0) {
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
                if (random(5) == 0) { return 4; } else { return 2; } // returns 2 80% of the time, 4 20% of the time
            }
            if (cellArray[rand1][rand2].value == 0) { // Checks if the cell is empty
                cellArray[rand1][rand2].value = generateNumber(); // generateNumber() adds 2 or 4 to random cell found
                break;
            }

        }
    }
    // display();
    function display() { // displays all the cells' values onto the cell's text
        for (let i = 0; i < dimension * dimension; i++) {
            let cell = find(i);
            displayArray[i].innerText = cell.value;
            displayArray[i].style.setProperty("background-color", cell.color());
            if (cell.value == 0) {
                displayArray[i].innerText = "";
            }
        }
    }
    function find(count) { // finds specific cell based on count
        for (let row = 0; row < dimension; row++) {
            for (let col = 0; col < dimension; col++) {
                if (cellArray[row][col].count === count) {
                    return cellArray[row][col];
                }
            }
        }
    }
    // function find(row, col) { // delete if not used
    //     for (let row = 0; row < dimension; row++) {
    //         for (let col = 0; col < dimension; col++) {
    //             if (cellArray[row][col].row == row && cellArray[row][col].col == col) {
    //                 return cellArray[row][col];
    //             }
    //         }
    //     }
    // }

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