// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/***Player Movement***/
var player = [playerOne, playerTwo];
var left = [37, 65];
var up = [38, 87];
var right = [39, 68];
var down = [40, 83];
var action = [190, 86];
var pickup = [188, 67];
var map = {};

document.onkeydown = function (e) {
    if (!gameOver) {
        for (var pc = 0; pc < 2; pc++) {
            if (player[pc].step == 1) {
                player[pc].step = 2;
            }
            else {
                player[pc].step = 1;
            }
            //left movement
            if (e.keyCode == left[pc]) {
                player[pc].direction = "left";
                player[pc].css.backgroundImage = "url('../img/" + player[pc].direction + (pc+1) + "_" + player[pc].step + ".png')";
                if (world[player[pc].y][player[pc].x - 1] == 0 && worldObject[player[pc].y][player[pc].x - 1] == null) {
                    worldObject[player[pc].y][player[pc].x] = null;
                    player[pc].x -= 1;
                    worldObject[player[pc].y][player[pc].x] = "player";
                }
                player[pc].facing = {
                    world: world[player[pc].y][player[pc].x - 1],
                    x: player[pc].x - 1,
                    y: player[pc].y
                };
            }
            //up movement
            else if (e.keyCode == up[pc]) {
                player[pc].direction = "top";
                player[pc].css.backgroundImage = "url('../img/" + player[pc].direction + (pc+1) + "_" + player[pc].step + ".png')";
                if (world[player[pc].y - 1][player[pc].x] == 0 && worldObject[player[pc].y - 1][player[pc].x] == null) {
                    worldObject[player[pc].y][player[pc].x] = null;
                    player[pc].y--;
                    worldObject[player[pc].y][player[pc].x] = "player";
                }
                player[pc].facing = {
                    world: world[player[pc].y - 1][player[pc].x],
                    x: player[pc].x,
                    y: player[pc].y - 1
                };
            }
            //right movement
            else if (e.keyCode == right[pc]) {
                player[pc].direction = "right";
                player[pc].css.backgroundImage = "url('../img/" + player[pc].direction + (pc+1) + "_" + player[pc].step + ".png')";
                if (world[player[pc].y][player[pc].x + 1] == 0 && worldObject[player[pc].y][player[pc].x + 1] == null) {
                    worldObject[player[pc].y][player[pc].x] = null;
                    player[pc].x++;
                    worldObject[player[pc].y][player[pc].x] = "player";
                }
                player[pc].facing = {
                    world: world[player[pc].y][player[pc].x + 1],
                    x: player[pc].x + 1,
                    y: player[pc].y
                };
            }
            //down movement
            else if (e.keyCode == down[pc]) {
                player[pc].direction = "down";
                player[pc].css.backgroundImage = "url('../img/" + player[pc].direction + (pc+1) + "_" + player[pc].step + ".png')";
                if (world[player[pc].y + 1][player[pc].x] == 0 && worldObject[player[pc].y + 1][player[pc].x] == null) {
                    worldObject[player[pc].y][player[pc].x] = null;
                    player[pc].y++;
                    worldObject[player[pc].y][player[pc].x] = "player";
                }
                player[pc].facing = {
                    world: world[player[pc].y + 1][player[pc].x],
                    x: player[pc].x,
                    y: player[pc].y + 1
                };
            }
            //action key
            else if (e.keyCode == action[pc]) {
                if (worldObject[player[pc].facing.y][player[pc].facing.x] != null) {
                    //cutting ingredients
                    if (player[pc].facing.world == 3 && worldObject[player[pc].facing.y][player[pc].facing.x].type == "ingredients") {
                        if (worldObject[player[pc].facing.y][player[pc].facing.x].process < cutTimer) {
                            updateProcessBar(player[pc], worldObject[player[pc].facing.y][player[pc].facing.x]);
                            executeAction(worldObject[player[pc].facing.y][player[pc].facing.x]);
                        }
                        if (worldObject[player[pc].facing.y][player[pc].facing.x].process == cutTimer) {
                            cuttingComplete(worldObject[player[pc].facing.y][player[pc].facing.x]);
                        }
                    }
                    //cleaning dishes
                    else if (player[pc].facing.world == 4 && sink.item.length != 0) {
                        if (sink.item[sink.item.length - 1].process < cleanTimer) {
                            updateProcessBar(player[pc], sink.item[sink.item.length - 1]);
                            executeAction(sink.item[sink.item.length - 1]);
                        }
                        if (sink.item[sink.item.length - 1].process == cleanTimer) {
                            cleaningComplete(sink.item[sink.item.length - 1]);
                        }
                    }
                }
            }
            //pickup key
            else if (e.keyCode == pickup[pc]) {
                //player is not holding any item
                if (player[pc].item == null && player[pc].facing.world != 0) {
                    //object to pick up
                    if (worldObject[player[pc].facing.y][player[pc].facing.x] != null && worldObject[player[pc].facing.y][player[pc].facing.x] != "dirty_dish" && worldObject[player[pc].facing.y][player[pc].facing.x] != "sink" && worldObject[player[pc].facing.y][player[pc].facing.x] != "sink_dish" && worldObject[player[pc].facing.y][player[pc].facing.x] != "trash" && worldObject[player[pc].facing.y][player[pc].facing.x] != "food_out") {
                        player[pc].item = worldObject[player[pc].facing.y][player[pc].facing.x];
                        worldObject[player[pc].facing.y][player[pc].facing.x] = null;
                    }
                    //no object to pick up
                    else {
                        //sink dish
                        if (player[pc].facing.world == 5 && sinkDish.item.length != 0) {
                            player[pc].item = sinkDish.item.pop();
                        }
                        //dirty dish
                        else if (player[pc].facing.world == 6 && dirtyDish.item.length != 0) {
                            player[pc].item = dirtyDish.item.pop();
                        }
                        //onion box
                        else if (player[pc].facing.world == 13) {
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
                            player[pc].item = ingredients[onionId];
                        }
                        //tomato box
                        else if (player[pc].facing.world == 14) {
                            var tomatoId = ingredients.length;
                            var newTomato = "tomato" + tomatoId;
                            document.getElementById("ingredients").innerHTML += "<div id='" + newTomato + "'></div>";
                            ingredients.push({
                                name: newTomato,
                                type: "ingredients",
                                food: "tomato",
                                x: null,
                                y: null,
                                process: 0
                            });
                            document.getElementById(newTomato).classList.add("tomatoes");
                            player[pc].item = ingredients[tomatoId];
                        }
                    }
                }
                //player is holding an item
                else if (player[pc].item != null && player[pc].facing.world != 0) {
                    //general
                    if (worldObject[player[pc].facing.y][player[pc].facing.x] == null) {
                        var canPlace = true;
                        if (player[pc].item.type == "ingredients") {
                            if (player[pc].facing.world == 2) {
                                canPlace = false;
                            }
                        }
                        else if (player[pc].item.type == "pots") {
                            if (player[pc].facing.world == 3) {
                                canPlace = false;
                            }
                        }
                        else if (player[pc].item.type == "dishes" || player[pc].item.type == "fire_exts") {
                            if (player[pc].facing.world == 2 || player[pc].facing.world == 3) {
                                canPlace = false;
                            }
                        }
                        if (canPlace) {
                            player[pc].item.x = player[pc].facing.x;
                            player[pc].item.y = player[pc].facing.y;
                            normItemSize(player[pc].item);
                            worldObject[player[pc].facing.y][player[pc].facing.x] = player[pc].item;
                            player[pc].item = null;
                            if (worldObject[player[pc].facing.y][player[pc].facing.x].type == "pots") {
                                normItemIconSize(worldObject[player[pc].facing.y][player[pc].facing.x]);
                                if (world[player[pc].facing.y][player[pc].facing.x] == 2) {
                                    updateProcessBar(player[pc], worldObject[player[pc].facing.y][player[pc].facing.x]);
                                }
                            }
                            else if (worldObject[player[pc].facing.y][player[pc].facing.x].type == "dishes" && worldObject[player[pc].facing.y][player[pc].facing.x].item.length > 0) {
                                normItemIconSize(worldObject[player[pc].facing.y][player[pc].facing.x]);
                            }
                            updatePos(worldObject[player[pc].facing.y][player[pc].facing.x]);
                        }
                    }
                    //food held
                    else if (player[pc].item.type == "ingredients") {
                        //pot in front
                        if (worldObject[player[pc].facing.y][player[pc].facing.x].type == "pots" && player[pc].item.process == cutTimer) {
                            //pot is not full
                            if (worldObject[player[pc].facing.y][player[pc].facing.x].item.length < 3) {
                                foodToPot(worldObject[player[pc].facing.y][player[pc].facing.x], player[pc].item);
                                player[pc].item = null;
                                if (world[player[pc].facing.y][player[pc].facing.x] == 2) {
                                    updateProcessBar(player[pc], worldObject[player[pc].facing.y][player[pc].facing.x]);
                                }
                            }
                        }
                        //trash in front
                        if (worldObject[player[pc].facing.y][player[pc].facing.x] == "trash") {
                            var element = document.getElementById(player[pc].item.name); element.parentNode.removeChild(element);
                            player[pc].item = null;
                        }
                    }
                    //pot held
                    else if (player[pc].item.type == "pots") {
                        //trash in front
                        if (worldObject[player[pc].facing.y][player[pc].facing.x] == "trash") {
                            emptyItem(player[pc], player[pc].item);
                        }
                        //food in front
                        else if (worldObject[player[pc].facing.y][player[pc].facing.x].type == "ingredients" && worldObject[player[pc].facing.y][player[pc].facing.x] == cutTimer) {
                            //pot not full
                            if (player[pc].item.item.length < 3) {
                                foodToPot(player[pc].item, worldObject[player[pc].facing.y][player[pc].facing.x]);
                                worldObject[player[pc].facing.y][player[pc].facing.x] = null;
                            }
                        }
                        //dish in front
                        else if (worldObject[player[pc].facing.y][player[pc].facing.x].type == "dishes") {
                            if (worldObject[player[pc].facing.y][player[pc].facing.x].clean && worldObject[player[pc].facing.y][player[pc].facing.x].item.length == 0 && player[pc].item.process == cookTimer) {
                                worldObject[player[pc].facing.y][player[pc].facing.x].item = player[pc].item.item;
                                document.getElementById(worldObject[player[pc].facing.y][player[pc].facing.x].name).innerHTML = document.getElementById(player[pc].item.name).innerHTML;
                                normItemIconSize(worldObject[player[pc].facing.y][player[pc].facing.x]);
                                emptyItem(player[pc], player[pc].item);
                            }
                        }
                    }
                    //dish held
                    else if (player[pc].item.type == "dishes") {
                        //trash in front
                        if (worldObject[player[pc].facing.y][player[pc].facing.x] == "trash" && player[pc].item.item.length != 0) {
                            emptyItem(player[pc], player[pc].item);
                            removeIcons(player[pc].item)
                        }
                        //pot in front
                        else if (worldObject[player[pc].facing.y][player[pc].facing.x].type == "pots") {
                            if (player[pc].item.clean && player[pc].item.item.length == 0 && worldObject[player[pc].facing.y][player[pc].facing.x].process == cookTimer) {
                                player[pc].item.item = worldObject[player[pc].facing.y][player[pc].facing.x].item;
                                document.getElementById(player[pc].item.name).innerHTML = document.getElementById(worldObject[player[pc].facing.y][player[pc].facing.x].name).innerHTML;
                                emptyItem(player[pc], worldObject[player[pc].facing.y][player[pc].facing.x]);
                            }
                        }
                        //food out in front
                        else if (worldObject[player[pc].facing.y][player[pc].facing.x] == "food_out") {
                            if (player[pc].item.item.length != 0) {
                                var foodGood = false;
                                for (var q = 0; q < foodOrders.length; q++) {
                                    var foodCheck = [];
                                    //check correct order length
                                    if (foodOrders[q].order.length == player[pc].item.item.length) {
                                        var foodLength = player[pc].item.item.length;
                                        foodGood = true;
                                        //organize item and order to check
                                        for (var o = 0; o < foodLength; o++) {
                                            foodCheck.push(player[pc].item.item[o].food);
                                        }
                                        for (var o = 0; o < foodLength; o++) {
                                            //check correct order
                                            if (foodOrders[q].order[o] != foodCheck[o]) {
                                                foodGood = false;
                                            }
                                        }
                                        if (foodGood) {
                                            var bonus = Math.round(6 * (50-foodOrders[q].process)/orderExpires);
                                            points += (20 + bonus);
                                            pointUpdate();
                                            emptyItem(player[pc], player[pc].item);
                                            removeIcons(player[pc].item)
                                            dishComplete(player[pc].item, sinkExists);
                                            var element = document.getElementById("orders");
                                            element.removeChild(element.getElementsByClassName("order_queue")[q]);
                                            foodOrders.splice(q, 1);
                                            player[pc].item = null;
                                            break;
                                        }
                                    }
                                }
                                if (!foodGood) {
                                    points -= 20;
                                    if (points < 0) {
                                        points = 0;
                                    }
                                    pointUpdate();
                                    emptyItem(player[pc], player[pc].item);
                                    removeIcons(player[pc].item)
                                    dishComplete(player[pc].item, sinkExists);
                                    player[pc].item = null;
                                }
                            }
                        }
                        else if (worldObject[player[pc].facing.y][player[pc].facing.x] == "sink") {
                            if (!player[pc].item.clean) {
                                player[pc].item.x = player[pc].facing.x;
                                player[pc].item.y = player[pc].facing.y;
                                updatePos(player[pc].item);
                                normItemSize(player[pc].item);
                                sink.item.push(player[pc].item);
                                player[pc].item = null;
                            }
                        }
                    }
                }
            }

            //update held item
            if (player[pc].item != null) {
                heldItemSize(player[pc].item);
                heldItemPos(player[pc]);
                //pot held
                if (player[pc].item.type == "pots") {
                    heldItemIconSize(player[pc].item);
                }
                //dish held
                else if (player[pc].item.type == "dishes" && player[pc].item.item.length > 0) {
                    heldItemIconSize(player[pc].item);
                }
            }

            //update player position
            updatePos(player[pc]);
        }
    }
}