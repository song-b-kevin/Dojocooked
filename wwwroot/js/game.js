// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/***TO DO
 * extra points for early finish
***/

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
var orderTimer = null;
var cutTimer = 15;
var cleanTimer = 15;
var cookTimer = 12;
var newOrderTimer = 15;
var orderExpires = 50;
var points = 0;
var sinkExists = false;
var sink = null;
var sinkDish = null;
var dirtyDish = null;

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
    13: "floor" //player_two
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
                //sink
                else if (world[row][column] == 4) {
                    sinkExists = true;
                    sink = {
                        item: [],
                        x: column,
                        y: row
                    }
                    worldObject[row][column] = "sink";
                }
                //sink dish
                else if (world[row][column] == 5) {
                    sinkDish = {
                        item: [],
                        x: column,
                        y: row
                    }
                    worldObject[row][column] = "sink_dish";
                }
                //dirty dish
                else if (world[row][column] == 6) {
                    dirtyDish = {
                        item: [],
                        x: column,
                        y: row
                    }
                    worldObject[row][column] = "dirty_dish";
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
                        process: 0,
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
                //player 2
                else if (world[row][column] == 13) {
                    playerTwo = {
                        name: "player_two",
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
                        css: document.getElementById("player_two").style
                    }
                    updatePos(playerTwo);
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

function pointUpdate() {
    document.getElementById("scoreboard").innerHTML = points;
}

function makeOrders() {
    //randomize order
    var randomNum = Math.floor(Math.random() * orderOptions.length);
    foodOrders.push(Object.assign({}, orderOptions[randomNum]));
    var orderInQueue = foodOrders.length - 1;
    var element = document.getElementById("orders");
    element.innerHTML += "<div class='order_queue row'></div>";
    element.getElementsByClassName("order_queue")[orderInQueue].innerHTML = "<div class='order_process col-12'></div>";
    element.getElementsByClassName("order_queue")[orderInQueue].innerHTML += "<div class='order_img col-12' style=\"background-image: url('../img/" + foodOrders[orderInQueue].type + ".png');\"></div>";
    //order has 1 ingredient
    if (foodOrders[orderInQueue].order.length == 1) {
        for (var i = 0; i < foodOrders[orderInQueue].order.length; i++) {
            element.getElementsByClassName("order_queue")[orderInQueue].innerHTML += "<div class='order_icon col-12' style=\"background-image: url('../img/" + foodOrders[orderInQueue].order[i] + ".png');\"></div>";
        }
    }
    //order has 3 ingredients
    else if (foodOrders[orderInQueue].order.length == 2) {
        for (var i = 0; i < foodOrders[orderInQueue].order.length; i++) {
            element.getElementsByClassName("order_queue")[orderInQueue].innerHTML += "<div class='order_icon col-6' style=\"background-image: url('../img/" + foodOrders[orderInQueue].order[i] + ".png');\"></div>";
        }
    }
    //order has 2 ingredients
    else if (foodOrders[orderInQueue].order.length == 3) {
        for (var i = 0; i < foodOrders[orderInQueue].order.length; i++) {
            element.getElementsByClassName("order_queue")[orderInQueue].innerHTML += "<div class='order_icon col-4' style=\"background-image: url('../img/" + foodOrders[orderInQueue].order[i] + ".png');\"></div>";
        }
    }
    //order has 4 ingredients
    else if (foodOrders[orderInQueue].order.length == 4) {
        for (var i = 0; i < foodOrders[orderInQueue].order.length; i++) {
            element.getElementsByClassName("order_queue")[orderInQueue].innerHTML += "<div class='order_icon col-3' style=\"background-image: url('../img/" + foodOrders[orderInQueue].order[i] + ".png');\"></div>";
        }
    }

    foodOrders[orderInQueue].timer = setTimeout(function () { orderCountdown(foodOrders[orderInQueue]) }, 1000);
    setTimeout(makeOrders, newOrderTimer * 1000);
}

function css(name) {
    return document.getElementById(name).style;
}

function updatePos(object) {
    css(object.name).top = (object.y * 75 + gameTop) + "px";
    css(object.name).left = object.x * 75 + "px";
}

function heldItemPos(player) {
    css(player.item.name).top = (player.y * 75 + gameTop - 42) + "px";
    css(player.item.name).left = (player.x * 75 + 12) + "px";
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

function removeIcons(object) {
    document.getElementById(object.name).innerHTML = null;
}

function executeAction(object) {
    object.process++;
}

function orderCountdown(object) {
    if (object.process < orderExpires) {
        object.process++;
        setTimeout(function () { orderCountdown(object) }, 1000);;
    }
}

function updateOrderProcessBar() {
    if (foodOrders.length != 0) {
        for (var i = 0; i < foodOrders.length; i++) {
            var processComplete = (foodOrders[i].process) * (100 / orderExpires);
            var processIncomplete = 100 - processComplete;
            if (processComplete == 100) {
                clearTimeout(foodOrders[i].timer);
                foodOrders.splice(i, 1);
                document.getElementById("orders").removeChild(document.getElementsByClassName("order_queue")[i]);
            }
            else if (processComplete <= 50) {
                document.getElementsByClassName("order_process")[i].style.backgroundImage = "linear-gradient(to right, green " + processIncomplete + "%, transparent " + processComplete + "%)";
            }
            else if (processComplete > 50) {
                document.getElementsByClassName("order_process")[i].style.backgroundImage = "linear-gradient(to left, transparent " + processComplete + "%, green " + processIncomplete + "%)";
            }
        }
    }
    setTimeout(updateOrderProcessBar, 100);
}

function updateProcessBar(player, object) {
    //max process bar counter
    if (object.type == "ingredients") {
        var processMax = cutTimer;
    }
    else if (object.type == "pots") {
        var processMax = cookTimer;
    }
    else if (object.type == "dishes") {
        var processMax = cleanTimer;
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
    if (player.item != null && player.item.name == object.name) {
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
            potTimer[object.id] = setTimeout(function () { updateProcessBar(player, object) }, 1000);
        }
    }
}

function foodToPot(pot, ingredient) {
    var element = document.getElementById(ingredient.name);
    element.parentNode.removeChild(element);
    document.getElementById(pot.name).getElementsByClassName("item_icon")[pot.item.length].style.backgroundImage = "url('../img/" + ingredient.food + ".png')";
    pot.item.push(ingredient);
}

function cuttingComplete(object) {
    css(object.name).backgroundImage = "url('../img/" + object.food + "_cut.png')";
    document.getElementById(object.name).innerHTML = null;
}

function cleaningComplete(object) {
    object.clean = true;
    object.process = 0;
    css(object.name).backgroundImage = "url('../img/plate.png')";
    object.x = sinkDish.x;
    object.y = sinkDish.y;
    document.getElementById(object.name).innerHTML = null;
    updatePos(object);
    document.getElementById(object.name).innerHTML = null;
    sinkDish.item.push(sink.item.pop());
}

function returnPlate(object) {
    object.x = dirtyDish.x;
    object.y = dirtyDish.y;
    updatePos(object);
    normItemSize(object);
    css(object.name).display = "block";
    dirtyDish.item.push(object);
}

function dishComplete(object, sinkExists) {
    if (sinkExists) {
        object.clean = false;
        css(object.name).backgroundImage = "url('../img/plate_dirty.png')";
    }
    else {
        object.clean = true;
    }
    css(object.name).display = "none";
    setTimeout(function () { returnPlate(object) }, 10000);
}

function emptyItem(player, object) {
    object.item = [];
    for (var i = 0; i < 3; i++) {
        document.getElementById(object.name).getElementsByClassName("item_icon")[i].style.backgroundImage = "url('../img/empty.png')";
    }
    if (object.type == "pots" && object.process != 0) {
        object.process = 0;
        var element = document.getElementById(object.name);
        element.removeChild(element.getElementsByClassName("process_bar")[0]);
        if (worldObject[player.facing.y][player.facing.x].type == "dishes") {
            var element = document.getElementById(worldObject[player.facing.y][player.facing.x].name);
            element.removeChild(element.getElementsByClassName("process_bar")[0]);
        }
        else if (player.item.type == "dishes") {
            var element = document.getElementById(player.item.name);
            element.removeChild(element.getElementsByClassName("process_bar")[0]);
        }
    }
}

/***Game Initiation***/
drawWorld();
gameTime();
setTimeout(startGame, 1000);
makeOrders();
updateOrderProcessBar();