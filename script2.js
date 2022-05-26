// redo
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

class cellClass {
    value;
    color;
    colorMap = new Map();
    constructor(row, col) {
        this.row = row;
        this.col = col;
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
        if (colorMap.has(value)) {
            color = colorMap.get(value);
        }
    }
}

window.onload = () => {
    centerElement("Game");
    centerElement("Score");
    centerElement("h1");
    centerElement("h2");

    class cellClass {
        value;
        color;
        colorMap = new Map();
        constructor(row, col) {
            this.row = row;
            this.col = col;
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
            if (colorMap.has(value)) {
                color = colorMap.get(value);
            }
        }
    }

    var cell = document.getElementsByTagName("cell");
    var background = document.getElementsByTagName("cellBackground");

    var dimension = 4; // for gameBoard() and randomCell(); Default: 4

    var dimensionButton = document.getElementsByTagName("Dimension");
    for (let i = 0; i < dimensionButton.length; i++) {
        dimensionButton[i].addEventListener("click", () => {
            dimension = parseInt(dimensionButton[i].id);
            makeBoard(dimension);
        }); // gets 04, 05, 06 from the buttons and passes it onto gameBoard()
    }

    var board, backgroundArray = null;
    makeBoard(dimension);
    function makeBoard(dimension) {
        let cellCount = 0;
        board = new Array(dimension);
        for (let row = 0; row < dimension; row++) {
            let temp = new Array(dimension);
            for (let col = 0; col < dimension; col++) {
                temp[col] =
                    cellCount++;
            }
            board[row] = temp;
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
}