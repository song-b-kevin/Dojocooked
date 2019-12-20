// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/***Game Variables***/
var gameTop = 100;
var gameStart = true;
var gameOver = false;
var pots = [];
var ingredients = [];
var dishes = [];
var fireExts = [];
var potTimer = [];
var foodOrders = [];
var points = 0;

/***Generate World***/
var worldObject = new Array(world.length)
for (var i = 0; i < worldObject.length; i++) {
    worldObject[i] = new Array(world[i].length);
}

var worldDict = {
    0: "floor",
    1: "table",
    2: "stove",
    3: "cutting_board",
    4: "sink",
    5: "sink_dish",
    6: "dirty_dish",
    7: "food_out",
    8: "trash",
    9: "table", //fire_ext
    10: "onion_box",
    11: "table", //dishes
    12: "floor", //player_one
};

function drawWorld() {
    output = "";
    for (var row = 0; row < world.length; row++) {
        output += "<div class='row'>";
        for (var column = 0; column < world[row].length; column++) {
            output += "<div class='" + worldDict[world[row][column]] + "'></div>";
            if (gameStart) {
                //pots
                if (world[row][column] == 2) {
                    var potId = pots.length;
                    var newPot = "pot" + potId;
                    document.getElementById("pots").innerHTML += "<div id='" + newPot + "' class='pots'></div>";
                    pots.push({
                        name: newPot,
                        id: potId,
                        type: "pots",
                        x: column,
                        y: row,
                        item: [],
                        process: 0
                    })
                    //make icons
                    for (var s = 1; s < 4; s++) {
                        document.getElementById(newPot).innerHTML += "<div class='item_icon'></div>";
                    }
                    updatePos(pots[potId]);
                    worldObject[row][column] = pots[potId];
                }
                //food out
                else if (world[row][column] == 7) {
                    worldObject[row][column] = "food_out";
                }
                //trash cans
                else if (world[row][column] == 8) {
                    worldObject[row][column] = "trash";
                }
                //fire extinguisher
                else if (world[row][column] == 9) {
                    var fireExtId = fireExts.length;
                    var newFireExt = "fire_ext" + fireExtId;
                    document.getElementById("fire_exts").innerHTML += "<div id='" + newFireExt + "' class='fire_exts'></div>";
                    fireExts.push({
                        name: newFireExt,
                        type: "fire_exts",
                        x: column,
                        y: row
                    })
                    updatePos(fireExts[fireExtId]);
                    worldObject[row][column] = fireExts[fireExtId];
                    world[row][column] = 1;
                }
                //dishes
                else if (world[row][column] == 11) {
                    var dishId = dishes.length;
                    var newDish = "dish" + dishId;
                    document.getElementById("dishes").innerHTML += "<div id='" + newDish + "' class='dishes'></div>";
                    dishes.push({
                        name: newDish,
                        type: "dishes",
                        clean: true,
                        x: column,
                        y: row,
                        item: [],
                    })
                    updatePos(dishes[dishId]);
                    worldObject[row][column] = dishes[dishId];
                    world[row][column] = 1;
                }
                //player 1
                else if (world[row][column] == 12) {
                    playerOne = {
                        name: "player_one",
                        type: "player",
                        x: column,
                        y: row,
                        item: null,
                        facing: {
                            world: world[row + 1][column],
                            x: column,
                            y: row + 1
                        },
                        direction: "down",
                        step: 1,
                        css: document.getElementById("player_one").style
                    }
                    updatePos(playerOne);
                    world[row][column] = 0;
                }
            }
        }
        output += "</div>";
    }
    if (gameStart) {
        gameStart = false;
    }
    document.getElementById("world").innerHTML = output;
}

/***Game Functions***/
function startGame() {
    if (gameTimeLimit != 0) {
        gameTimeLimit--;
        gameTime();
        setTimeout(startGame, 1000);
    }
    if (gameTimeLimit == 0) {
        gameOver = true;
        document.getElementById("gameover_msg").innerHTML = "GAME OVER";
        css("levelselector").display = "block";
    }
}

function gameTime() {
    var minutes = Math.floor(gameTimeLimit / 60);
    minutes = (new Array(2).join("0") + minutes).slice(-2);
    var seconds = gameTimeLimit % 60;
    seconds = (new Array(2).join("0") + seconds).slice(-2);
    var time = minutes + ":" + seconds;
    document.getElementById("timer").innerHTML = time;
}

function css(name) {
    return document.getElementById(name).style;
}

function updatePos(object) {
    css(object.name).top = (object.y * 75 + gameTop) + "px";
    css(object.name).left = object.x * 75 + "px";
}

function heldItemPos(object) {
    css(object.name).top = (playerOne.y * 75 + gameTop - 42) + "px";
    css(object.name).left = (playerOne.x * 75 + 12) + "px";
}

function heldItemSize(object) {
    css(object.name).height = "50px";
    css(object.name).width = "50px";
}

function normItemSize(object) {
    css(object.name).height = "75px";
    css(object.name).width = "75px";
}

function heldItemIconSize(object) {
    for (var i = 0; i < 3; i++) {
        document.getElementById(object.name).getElementsByClassName("item_icon")[i].style.height = "16px";
        document.getElementById(object.name).getElementsByClassName("item_icon")[i].style.width = "16px";
    }
}

function normItemIconSize(object) {
    for (var i = 0; i < 3; i++) {
        document.getElementById(object.name).getElementsByClassName("item_icon")[i].style.height = "25px";
        document.getElementById(object.name).getElementsByClassName("item_icon")[i].style.width = "25px";
    }
}

function executeAction(object) {
    object.process++;
}

function updateProcessBar(object) {
    //max process bar counter
    if (object.type == "ingredients") {
        var processMax = 20;
    }
    else if (object.type == "pots") {
        var processMax = 12;
    }
    //create process bar
    if (document.getElementById(object.name).getElementsByClassName("process_bar").length == 0) {
        if (object.type == "pots" && object.item.length == 0) {
            null;
        }
        else {
            document.getElementById(object.name).innerHTML += "<div class='process_bar'></div>";
        }
    }
    //update process bar
    else if (object.process > 0) {
        var processComplete = (object.process + 1) * (100 / processMax);
        var processIncomplete = 100 - processComplete;
        if (processComplete <= 50) {
            document.getElementById(object.name).getElementsByClassName("process_bar")[0].style.backgroundImage = "linear-gradient(to left, transparent " + processIncomplete + "%, green " + processComplete + "%)";
        }
        else if (processComplete > 50) {
            document.getElementById(object.name).getElementsByClassName("process_bar")[0].style.backgroundImage = "linear-gradient(to right, green " + processComplete + "%, transparent " + processIncomplete + "%)";
        }
    }
    if (playerOne.item != null && playerOne.item.name == object.name) {
        null;
    }
    else if (object.type == "pots" && object.item.length != 0 && object.process < processMax && world[object.y][object.x] == "2") {
        if (object.item.length == 1 && object.process == 4) {
            null;
        }
        else if (object.item.length == 2 && object.process == 8) {
            null;
        }
        else {
            object.process++;
            if (potTimer[object.id] != null) {
                clearTimeout(potTimer[object.id]);
            }
            potTimer[object.id] = setTimeout(function () { updateProcessBar(object) }, 1000);
        }
    }
}

function cuttingComplete(object) {
    css(object.name).backgroundImage = "url('../img/" + object.food + "_cut.png')";
    document.getElementById(object.name).innerHTML = null;
}

function emptyItem(object) {
    object.item = [];
    for (var i = 0; i < 3; i++) {
        document.getElementById(object.name).getElementsByClassName("item_icon")[i].style.backgroundImage = "url('../img/empty.png')";
    }
    if (object.type == "pots" && object.process != 0) {
        object.process = 0;
        var element = document.getElementById(object.name);
        element.removeChild(element.getElementsByClassName("process_bar")[0]);
        if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "dishes") {
            var element = document.getElementById(worldObject[playerOne.facing.y][playerOne.facing.x].name);
            element.removeChild(element.getElementsByClassName("process_bar")[0]);
        }
        else if (playerOne.item.type == "dishes") {
            var element = document.getElementById(playerOne.item.name);
            element.removeChild(element.getElementsByClassName("process_bar")[0]);
        }
    }
}

/***Player Movement***/
//player 1
document.onkeydown = function (e) {
    if (!gameOver) {
        if (playerOne.step == 1) {
            playerOne.step = 2;
        }
        else {
            playerOne.step = 1;
        }
        //left movement
        if (e.keyCode == 37) {
            playerOne.direction = "left";
            playerOne.css.backgroundImage = "url('../img/" + playerOne.direction + playerOne.step + ".png')";
            if (world[playerOne.y][playerOne.x - 1] == 0) {
                playerOne.x -= 1;
            }
            playerOne.facing = {
                world: world[playerOne.y][playerOne.x - 1],
                x: playerOne.x - 1,
                y: playerOne.y
            };
        }
        //up movement
        else if (e.keyCode == 38) {
            playerOne.direction = "top";
            playerOne.css.backgroundImage = "url('../img/" + playerOne.direction + playerOne.step + ".png')";
            if (world[playerOne.y - 1][playerOne.x] == 0) {
                playerOne.y--;
            }
            playerOne.facing = {
                world: world[playerOne.y - 1][playerOne.x],
                x: playerOne.x,
                y: playerOne.y - 1
            };
        }
        //right movement
        else if (e.keyCode == 39) {
            playerOne.direction = "right";
            playerOne.css.backgroundImage = "url('../img/" + playerOne.direction + playerOne.step + ".png')";
            if (world[playerOne.y][playerOne.x + 1] == 0) {
                playerOne.x++;
            }
            playerOne.facing = {
                world: world[playerOne.y][playerOne.x + 1],
                x: playerOne.x + 1,
                y: playerOne.y
            };
        }
        //down movement
        else if (e.keyCode == 40) {
            playerOne.direction = "down";
            playerOne.css.backgroundImage = "url('../img/" + playerOne.direction + playerOne.step + ".png')";
            if (world[playerOne.y + 1][playerOne.x] == 0) {
                playerOne.y++;
            }
            playerOne.facing = {
                world: world[playerOne.y + 1][playerOne.x],
                x: playerOne.x,
                y: playerOne.y + 1
            };
        }
        //action key(x=88)
        else if (e.keyCode == 88) {
            if (worldObject[playerOne.facing.y][playerOne.facing.x] != null) {
                //cutting ingredients
                if (playerOne.facing.world == 3 && worldObject[playerOne.facing.y][playerOne.facing.x].type == "ingredients") {
                    if (worldObject[playerOne.facing.y][playerOne.facing.x].process < 20) {
                        updateProcessBar(worldObject[playerOne.facing.y][playerOne.facing.x]);
                        executeAction(worldObject[playerOne.facing.y][playerOne.facing.x]);
                    }
                    if (worldObject[playerOne.facing.y][playerOne.facing.x].process == 20) {
                        cuttingComplete(worldObject[playerOne.facing.y][playerOne.facing.x]);
                    }
                }
            }
        }
        //pickup key(z=90)
        else if (e.keyCode == 90) {
            //player 1 is not holding any item
            if (playerOne.item == null && playerOne.facing.world != 0) {
                //object to pick up
                if (worldObject[playerOne.facing.y][playerOne.facing.x] != null) {
                    playerOne.item = worldObject[playerOne.facing.y][playerOne.facing.x];
                    worldObject[playerOne.facing.y][playerOne.facing.x] = null;
                }
                //no object to pick up
                else {
                    //onion box
                    if (playerOne.facing.world == 10) {
                        var onionId = ingredients.length;
                        var newOnion = "onion" + onionId;
                        document.getElementById("ingredients").innerHTML += "<div id='" + newOnion + "'></div>";
                        ingredients.push({
                            name: newOnion,
                            type: "ingredients",
                            food: "onion",
                            x: null,
                            y: null,
                            process: 0
                        });
                        document.getElementById(newOnion).classList.add("onions");
                        playerOne.item = ingredients[onionId];
                    }
                }
            }
            //player 1 is holding an item
            else if (playerOne.item != null && playerOne.facing.world != 0) {
                //general
                if (worldObject[playerOne.facing.y][playerOne.facing.x] == null) {
                    var canPlace = true;
                    if (playerOne.item.type == "ingredients") {
                        if (playerOne.facing.world == 2 || playerOne.facing.world == 4 || playerOne.facing.world == 5 || playerOne.facing.world == 6) {
                            canPlace = false;
                        }
                    }
                    else if (playerOne.item.type == "pots") {
                        if (playerOne.facing.world == 3 || playerOne.facing.world == 4 || playerOne.facing.world == 5 || playerOne.facing.world == 6) {
                            canPlace = false;
                        }
                    }
                    else if (playerOne.item.type == "dishes") {
                        if (playerOne.facing.world == 2 || playerOne.facing.world == 3 || playerOne.facing.world == 4 || playerOne.facing.world == 5 || playerOne.facing.world == 6) {
                            canPlace = false;
                        }
                    }
                    else if (playerOne.item.type == "fire_exts") {
                        if (playerOne.facing.world == 2 || playerOne.facing.world == 3 || playerOne.facing.world == 4 || playerOne.facing.world == 5 || playerOne.facing.world == 6) {
                            canPlace = false;
                        }
                    }
                    if (canPlace) {
                        playerOne.item.x = playerOne.facing.x;
                        playerOne.item.y = playerOne.facing.y;
                        normItemSize(playerOne.item);
                        worldObject[playerOne.facing.y][playerOne.facing.x] = playerOne.item;
                        playerOne.item = null;
                        if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "pots") {
                            normItemIconSize(worldObject[playerOne.facing.y][playerOne.facing.x]);
                            updateProcessBar(worldObject[playerOne.facing.y][playerOne.facing.x]);
                        }
                        else if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "dishes" && worldObject[playerOne.facing.y][playerOne.facing.x].item.length > 0) {
                            normItemIconSize(worldObject[playerOne.facing.y][playerOne.facing.x]);
                        }
                        css(worldObject[playerOne.facing.y][playerOne.facing.x].name).display = "block";
                        updatePos(worldObject[playerOne.facing.y][playerOne.facing.x]);
                    }
                }
                //food held
                else if (playerOne.item.type == "ingredients") {
                    //pot in front
                    if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "pots" && playerOne.item.process == 0) {
                        //pot is not full
                        if (worldObject[playerOne.facing.y][playerOne.facing.x].item.length < 3) {
                            var element = document.getElementById(playerOne.item.name); element.parentNode.removeChild(element);
                            document.getElementById(worldObject[playerOne.facing.y][playerOne.facing.x].name).getElementsByClassName("item_icon")[worldObject[playerOne.facing.y][playerOne.facing.x].item.length].style.backgroundImage = "url('../img/" + playerOne.item.food + ".png')";
                            worldObject[playerOne.facing.y][playerOne.facing.x].item.push(playerOne.item);
                            playerOne.item = null;
                            updateProcessBar(worldObject[playerOne.facing.y][playerOne.facing.x]);
                        }
                    }
                    //trash in front
                    if (worldObject[playerOne.facing.y][playerOne.facing.x] == "trash") {
                        var element = document.getElementById(playerOne.item.name); element.parentNode.removeChild(element);
                        playerOne.item = null;
                    }
                }
                //pot held
                else if (playerOne.item.type == "pots") {
                    //trash in front
                    if (worldObject[playerOne.facing.y][playerOne.facing.x] == "trash") {
                        emptyItem(playerOne.item);
                    }
                    //dish in front
                    else if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "dishes") {
                        if (worldObject[playerOne.facing.y][playerOne.facing.x].clean && worldObject[playerOne.facing.y][playerOne.facing.x].item.length == 0 && playerOne.item.process == 12) {
                            worldObject[playerOne.facing.y][playerOne.facing.x].item = playerOne.item.item;
                            document.getElementById(worldObject[playerOne.facing.y][playerOne.facing.x].name).innerHTML = document.getElementById(playerOne.item.name).innerHTML;
                            normItemIconSize(worldObject[playerOne.facing.y][playerOne.facing.x]);
                            emptyItem(playerOne.item);
                        }
                    }
                }
                //dish held
                else if (playerOne.item.type == "dishes") {
                    //trash in front
                    if (worldObject[playerOne.facing.y][playerOne.facing.x] == "trash") {
                        emptyItem(playerOne.item);
                        document.getElementById(playerOne.item.name).innerHTML = null;
                    }
                    //pot in front
                    else if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "pots") {
                        if (playerOne.item.clean && playerOne.item.item.length == 0 && worldObject[playerOne.facing.y][playerOne.facing.x].process == 12) {
                            playerOne.item.item = worldObject[playerOne.facing.y][playerOne.facing.x].item;
                            document.getElementById(playerOne.item.name).innerHTML = document.getElementById(worldObject[playerOne.facing.y][playerOne.facing.x].name).innerHTML;
                            emptyItem(worldObject[playerOne.facing.y][playerOne.facing.x]);
                        }
                    }
                    else if (worldObject[playerOne.facing.y][playerOne.facing.x] == "food_out") {

                    }
                }
            }
        }

        //update held item
        if (playerOne.item != null) {
            heldItemSize(playerOne.item);
            heldItemPos(playerOne.item);
            //pot held
            if (playerOne.item.type == "pots") {
                heldItemIconSize(playerOne.item);
            }
            //dish held
            else if (playerOne.item.type == "dishes" && playerOne.item.item.length > 0) {
                heldItemIconSize(playerOne.item);
            }
        }
        //update player position
        updatePos(playerOne);
    }
}

/***Game Initiation***/
drawWorld();
gameTime();
setTimeout(startGame, 1000);