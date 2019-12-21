// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/***Player Movement***/
document.onkeydown = function (e) {
    if (!gameOver) {
        /***Player One***/
        if (playerOne.step == 1) {
            playerOne.step = 2;
        }
        else {
            playerOne.step = 1;
        }
        //left movement (left=37)
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
        //up movement (up=38)
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
        //right movement (right=39)
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
        //down movement (down=40)
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
        //action key(>=190)
        else if (e.keyCode == 190) {
            if (worldObject[playerOne.facing.y][playerOne.facing.x] != null) {
                //cutting ingredients
                if (playerOne.facing.world == 3 && worldObject[playerOne.facing.y][playerOne.facing.x].type == "ingredients") {
                    if (worldObject[playerOne.facing.y][playerOne.facing.x].process < cutTimer) {
                        updateProcessBar(playerOne, worldObject[playerOne.facing.y][playerOne.facing.x]);
                        executeAction(worldObject[playerOne.facing.y][playerOne.facing.x]);
                    }
                    if (worldObject[playerOne.facing.y][playerOne.facing.x].process == cutTimer) {
                        cuttingComplete(worldObject[playerOne.facing.y][playerOne.facing.x]);
                    }
                }
                //cleaning dishes
                else if (playerOne.facing.world == 4 && sink.item.length != 0) {
                    if (sink.item[sink.item.length - 1].process < cleanTimer) {
                        updateProcessBar(playerOne, sink.item[sink.item.length - 1]);
                        executeAction(sink.item[sink.item.length - 1]);
                    }
                    if (sink.item[sink.item.length - 1].process == cleanTimer) {
                        cleaningComplete(sink.item[sink.item.length - 1]);
                    }
                }
            }
        }
        //pickup key(<=188)
        else if (e.keyCode == 188) {
            //player is not holding any item
            if (playerOne.item == null && playerOne.facing.world != 0) {
                //object to pick up
                if (worldObject[playerOne.facing.y][playerOne.facing.x] != null && worldObject[playerOne.facing.y][playerOne.facing.x] != "dirty_dish" && worldObject[playerOne.facing.y][playerOne.facing.x] != "sink" && worldObject[playerOne.facing.y][playerOne.facing.x] != "sink_dish") {
                    playerOne.item = worldObject[playerOne.facing.y][playerOne.facing.x];
                    worldObject[playerOne.facing.y][playerOne.facing.x] = null;
                }
                //no object to pick up
                else {
                    //sink dish
                    if (playerOne.facing.world == 5 && sinkDish.item.length != 0) {
                        playerOne.item = sinkDish.item.pop();
                    }
                    //dirty dish
                    else if (playerOne.facing.world == 6 && dirtyDish.item.length != 0) {
                        playerOne.item = dirtyDish.item.pop();
                    }
                    //onion box
                    else if (playerOne.facing.world == 10) {
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
            //player is holding an item
            else if (playerOne.item != null && playerOne.facing.world != 0) {
                //general
                if (worldObject[playerOne.facing.y][playerOne.facing.x] == null) {
                    var canPlace = true;
                    if (playerOne.item.type == "ingredients") {
                        if (playerOne.facing.world == 2) {
                            canPlace = false;
                        }
                    }
                    else if (playerOne.item.type == "pots") {
                        if (playerOne.facing.world == 3) {
                            canPlace = false;
                        }
                    }
                    else if (playerOne.item.type == "dishes" || playerOne.item.type == "fire_exts") {
                        if (playerOne.facing.world == 2 || playerOne.facing.world == 3) {
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
                            if (world[playerOne.facing.y][playerOne.facing.x] == 2) {
                                updateProcessBar(playerOne, worldObject[playerOne.facing.y][playerOne.facing.x]);
                            }
                        }
                        else if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "dishes" && worldObject[playerOne.facing.y][playerOne.facing.x].item.length > 0) {
                            normItemIconSize(worldObject[playerOne.facing.y][playerOne.facing.x]);
                        }
                        updatePos(worldObject[playerOne.facing.y][playerOne.facing.x]);
                    }
                }
                //food held
                else if (playerOne.item.type == "ingredients") {
                    //pot in front
                    if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "pots" && playerOne.item.process == cutTimer) {
                        //pot is not full
                        if (worldObject[playerOne.facing.y][playerOne.facing.x].item.length < 3) {
                            foodToPot(worldObject[playerOne.facing.y][playerOne.facing.x], playerOne.item);
                            playerOne.item = null;
                            if (world[playerOne.facing.y][playerOne.facing.x] == 2) {
                                updateProcessBar(playerOne, worldObject[playerOne.facing.y][playerOne.facing.x]);
                            }
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
                        emptyItem(playerOne, playerOne.item);
                    }
                    //food in front
                    else if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "ingredients" && worldObject[playerOne.facing.y][playerOne.facing.x] == cutTimer) {
                        //pot not full
                        if (playerOne.item.item.length < 3) {
                            foodToPot(playerOne.item, worldObject[playerOne.facing.y][playerOne.facing.x]);
                            worldObject[playerOne.facing.y][playerOne.facing.x] = null;
                        }
                    }
                    //dish in front
                    else if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "dishes") {
                        if (worldObject[playerOne.facing.y][playerOne.facing.x].clean && worldObject[playerOne.facing.y][playerOne.facing.x].item.length == 0 && playerOne.item.process == cookTimer) {
                            worldObject[playerOne.facing.y][playerOne.facing.x].item = playerOne.item.item;
                            document.getElementById(worldObject[playerOne.facing.y][playerOne.facing.x].name).innerHTML = document.getElementById(playerOne.item.name).innerHTML;
                            normItemIconSize(worldObject[playerOne.facing.y][playerOne.facing.x]);
                            emptyItem(playerOne, playerOne.item);
                        }
                    }
                }
                //dish held
                else if (playerOne.item.type == "dishes") {
                    //trash in front
                    if (worldObject[playerOne.facing.y][playerOne.facing.x] == "trash" && playerOne.item.item.length != 0) {
                        emptyItem(playerOne, playerOne.item);
                        removeIcons(playerOne.item)
                    }
                    //pot in front
                    else if (worldObject[playerOne.facing.y][playerOne.facing.x].type == "pots") {
                        if (playerOne.item.clean && playerOne.item.item.length == 0 && worldObject[playerOne.facing.y][playerOne.facing.x].process == cookTimer) {
                            playerOne.item.item = worldObject[playerOne.facing.y][playerOne.facing.x].item;
                            document.getElementById(playerOne.item.name).innerHTML = document.getElementById(worldObject[playerOne.facing.y][playerOne.facing.x].name).innerHTML;
                            emptyItem(playerOne, worldObject[playerOne.facing.y][playerOne.facing.x]);
                        }
                    }
                    //food out in front
                    else if (worldObject[playerOne.facing.y][playerOne.facing.x] == "food_out") {
                        if (playerOne.item.item.length != 0) {
                            var foodGood = false;
                            var foodCheck = [];
                            for (var q = 0; q < foodOrders.length; q++) {
                                //check correct order length
                                if (foodOrders[q].order.length == playerOne.item.item.length) {
                                    var foodLength = playerOne.item.item.length;
                                    foodGood = true;
                                    //organize item and order to check
                                    for (var o = 0; o < foodLength; o++) {
                                        foodCheck.push(playerOne.item.item[o].food);
                                    }
                                    for (var o = 0; o < foodLength; o++) {
                                        //check correct order
                                        if (foodOrders[q].order[o] != foodCheck[0]) {
                                            foodCheck = false;
                                        }
                                    }
                                    if (foodGood) {
                                        points += 20;
                                        pointUpdate();
                                        emptyItem(playerOne, playerOne.item);
                                        removeIcons(playerOne.item)
                                        dishComplete(playerOne.item, sinkExists);
                                        var element = document.getElementById("orders");
                                        element.removeChild(element.getElementsByClassName("order_queue")[q]);
                                        foodOrders.splice(q, 1);
                                        playerOne.item = null;
                                        break;
                                    }
                                }
                            }
                            if (!foodGood) {
                                points -= 20;
                                pointUpdate();
                                emptyItem(playerOne, playerOne.item);
                                removeIcons(playerOne.item)
                                dishComplete(playerOne.item, sinkExists);
                                playerOne.item = null;
                            }
                        }
                    }
                    else if (worldObject[playerOne.facing.y][playerOne.facing.x] == "sink") {
                        if (!playerOne.item.clean) {
                            playerOne.item.x = playerOne.facing.x;
                            playerOne.item.y = playerOne.facing.y;
                            updatePos(playerOne.item);
                            normItemSize(playerOne.item);
                            sink.item.push(playerOne.item);
                            playerOne.item = null;
                        }
                    }
                }
            }
        }

        //update held item
        if (playerOne.item != null) {
            heldItemSize(playerOne.item);
            heldItemPos(playerOne);
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

        /***Player Two***/
        if (playerTwo.step == 1) {
            playerTwo.step = 2;
        }
        else {
            playerTwo.step = 1;
        }
        //left movement (a=65)
        if (e.keyCode == 65) {
            playerTwo.direction = "left";
            playerTwo.css.backgroundImage = "url('../img/" + playerTwo.direction + playerTwo.step + "_2.png')";
            if (world[playerTwo.y][playerTwo.x - 1] == 0) {
                playerTwo.x -= 1;
            }
            playerTwo.facing = {
                world: world[playerTwo.y][playerTwo.x - 1],
                x: playerTwo.x - 1,
                y: playerTwo.y
            };
        }
        //up movement (w=87)
        else if (e.keyCode == 87) {
            playerTwo.direction = "top";
            playerTwo.css.backgroundImage = "url('../img/" + playerTwo.direction + playerTwo.step + "_2.png')";
            if (world[playerTwo.y - 1][playerTwo.x] == 0) {
                playerTwo.y--;
            }
            playerTwo.facing = {
                world: world[playerTwo.y - 1][playerTwo.x],
                x: playerTwo.x,
                y: playerTwo.y - 1
            };
        }
        //right movement (d=68)
        else if (e.keyCode == 68) {
            playerTwo.direction = "right";
            playerTwo.css.backgroundImage = "url('../img/" + playerTwo.direction + playerTwo.step + "_2.png')";
            if (world[playerTwo.y][playerTwo.x + 1] == 0) {
                playerTwo.x++;
            }
            playerTwo.facing = {
                world: world[playerTwo.y][playerTwo.x + 1],
                x: playerTwo.x + 1,
                y: playerTwo.y
            };
        }
        //down movement (s=83)
        else if (e.keyCode == 83) {
            playerTwo.direction = "down";
            playerTwo.css.backgroundImage = "url('../img/" + playerTwo.direction + playerTwo.step + "_2.png')";
            if (world[playerTwo.y + 1][playerTwo.x] == 0) {
                playerTwo.y++;
            }
            playerTwo.facing = {
                world: world[playerTwo.y + 1][playerTwo.x],
                x: playerTwo.x,
                y: playerTwo.y + 1
            };
        }
        //action key(v=86)
        else if (e.keyCode == 86) {
            if (worldObject[playerTwo.facing.y][playerTwo.facing.x] != null) {
                //cutting ingredients
                if (playerTwo.facing.world == 3 && worldObject[playerTwo.facing.y][playerTwo.facing.x].type == "ingredients") {
                    if (worldObject[playerTwo.facing.y][playerTwo.facing.x].process < cutTimer) {
                        updateProcessBar(playerTwo, worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                        executeAction(worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                    }
                    if (worldObject[playerTwo.facing.y][playerTwo.facing.x].process == cutTimer) {
                        cuttingComplete(worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                    }
                }
                //cleaning dishes
                else if (playerTwo.facing.world == 4 && sink.item.length != 0) {
                    if (sink.item[sink.item.length - 1].process < cleanTimer) {
                        updateProcessBar(playerTwo, sink.item[sink.item.length - 1]);
                        executeAction(sink.item[sink.item.length - 1]);
                    }
                    if (sink.item[sink.item.length - 1].process == cleanTimer) {
                        cleaningComplete(sink.item[sink.item.length - 1]);
                    }
                }
            }
        }
        //pickup key(c=67)
        else if (e.keyCode == 67) {
            //player is not holding any item
            if (playerTwo.item == null && playerTwo.facing.world != 0) {
                //object to pick up
                if (worldObject[playerTwo.facing.y][playerTwo.facing.x] != null && worldObject[playerTwo.facing.y][playerTwo.facing.x] != "dirty_dish" && worldObject[playerTwo.facing.y][playerTwo.facing.x] != "sink" && worldObject[playerTwo.facing.y][playerTwo.facing.x] != "sink_dish") {
                    playerTwo.item = worldObject[playerTwo.facing.y][playerTwo.facing.x];
                    worldObject[playerTwo.facing.y][playerTwo.facing.x] = null;
                }
                //no object to pick up
                else {
                    //sink dish
                    if (playerTwo.facing.world == 5 && sinkDish.item.length != 0) {
                        playerTwo.item = sinkDish.item.pop();
                    }
                    //dirty dish
                    else if (playerTwo.facing.world == 6 && dirtyDish.item.length != 0) {
                        playerTwo.item = dirtyDish.item.pop();
                    }
                    //onion box
                    else if (playerTwo.facing.world == 10) {
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
                        playerTwo.item = ingredients[onionId];
                    }
                }
            }
            //player is holding an item
            else if (playerTwo.item != null && playerTwo.facing.world != 0) {
                //general
                if (worldObject[playerTwo.facing.y][playerTwo.facing.x] == null) {
                    var canPlace = true;
                    if (playerTwo.item.type == "ingredients") {
                        if (playerTwo.facing.world == 2) {
                            canPlace = false;
                        }
                    }
                    else if (playerTwo.item.type == "pots") {
                        if (playerTwo.facing.world == 3) {
                            canPlace = false;
                        }
                    }
                    else if (playerTwo.item.type == "dishes" || playerTwo.item.type == "fire_exts") {
                        if (playerTwo.facing.world == 2 || playerTwo.facing.world == 3) {
                            canPlace = false;
                        }
                    }
                    if (canPlace) {
                        playerTwo.item.x = playerTwo.facing.x;
                        playerTwo.item.y = playerTwo.facing.y;
                        normItemSize(playerTwo.item);
                        worldObject[playerTwo.facing.y][playerTwo.facing.x] = playerTwo.item;
                        playerTwo.item = null;
                        if (worldObject[playerTwo.facing.y][playerTwo.facing.x].type == "pots") {
                            normItemIconSize(worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                            if (world[playerTwo.facing.y][playerTwo.facing.x] == 2) {
                                updateProcessBar(playerTwo, worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                            }
                        }
                        else if (worldObject[playerTwo.facing.y][playerTwo.facing.x].type == "dishes" && worldObject[playerTwo.facing.y][playerTwo.facing.x].item.length > 0) {
                            normItemIconSize(worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                        }
                        updatePos(worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                    }
                }
                //food held
                else if (playerTwo.item.type == "ingredients") {
                    //pot in front
                    if (worldObject[playerTwo.facing.y][playerTwo.facing.x].type == "pots" && playerTwo.item.process == cutTimer) {
                        //pot is not full
                        if (worldObject[playerTwo.facing.y][playerTwo.facing.x].item.length < 3) {
                            foodToPot(worldObject[playerTwo.facing.y][playerTwo.facing.x], playerTwo.item);
                            playerTwo.item = null;
                            if (world[playerTwo.facing.y][playerTwo.facing.x] == 2) {
                                updateProcessBar(playerTwo, worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                            }
                        }
                    }
                    //trash in front
                    if (worldObject[playerTwo.facing.y][playerTwo.facing.x] == "trash") {
                        var element = document.getElementById(playerTwo.item.name); element.parentNode.removeChild(element);
                        playerTwo.item = null;
                    }
                }
                //pot held
                else if (playerTwo.item.type == "pots") {
                    //trash in front
                    if (worldObject[playerTwo.facing.y][playerTwo.facing.x] == "trash") {
                        emptyItem(playerTwo, playerTwo.item);
                    }
                    //food in front
                    else if (worldObject[playerTwo.facing.y][playerTwo.facing.x].type == "ingredients" && worldObject[playerTwo.facing.y][playerTwo.facing.x].process == cutTimer) {
                        //pot not full
                        if (playerTwo.item.item.length < 3) {
                            foodToPot(playerTwo.item, worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                            worldObject[playerTwo.facing.y][playerTwo.facing.x] = null;
                        }
                    }
                    //dish in front
                    else if (worldObject[playerTwo.facing.y][playerTwo.facing.x].type == "dishes") {
                        if (worldObject[playerTwo.facing.y][playerTwo.facing.x].clean && worldObject[playerTwo.facing.y][playerTwo.facing.x].item.length == 0 && playerTwo.item.process == cookTimer) {
                            worldObject[playerTwo.facing.y][playerTwo.facing.x].item = playerTwo.item.item;
                            document.getElementById(worldObject[playerTwo.facing.y][playerTwo.facing.x].name).innerHTML = document.getElementById(playerTwo.item.name).innerHTML;
                            normItemIconSize(worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                            emptyItem(playerTwo, playerTwo.item);
                        }
                    }
                }
                //dish held
                else if (playerTwo.item.type == "dishes") {
                    //trash in front
                    if (worldObject[playerTwo.facing.y][playerTwo.facing.x] == "trash" && playerTwo.item.item.length != 0) {
                        emptyItem(player, playerTwo.item);
                        removeIcons(playerTwo.item)
                    }
                    //pot in front
                    else if (worldObject[playerTwo.facing.y][playerTwo.facing.x].type == "pots") {
                        if (playerTwo.item.clean && playerTwo.item.item.length == 0 && worldObject[playerTwo.facing.y][playerTwo.facing.x].process == cookTimer) {
                            playerTwo.item.item = worldObject[playerTwo.facing.y][playerTwo.facing.x].item;
                            document.getElementById(playerTwo.item.name).innerHTML = document.getElementById(worldObject[playerTwo.facing.y][playerTwo.facing.x].name).innerHTML;
                            emptyItem(playerTwo, worldObject[playerTwo.facing.y][playerTwo.facing.x]);
                        }
                    }
                    //food out in front
                    else if (worldObject[playerTwo.facing.y][playerTwo.facing.x] == "food_out") {
                        if (playerTwo.item.item.length != 0) {
                            var foodGood = false;
                            var foodCheck = [];
                            for (var q = 0; q < foodOrders.length; q++) {
                                //check correct order length
                                if (foodOrders[q].order.length == playerTwo.item.item.length) {
                                    var foodLength = playerTwo.item.item.length;
                                    foodGood = true;
                                    //organize item and order to check
                                    for (var o = 0; o < foodLength; o++) {
                                        foodCheck.push(playerTwo.item.item[o].food);
                                    }
                                    for (var o = 0; o < foodLength; o++) {
                                        //check correct order
                                        if (foodOrders[q].order[o] != foodCheck[0]) {
                                            foodCheck = false;
                                        }
                                    }
                                    if (foodGood) {
                                        points += 20;
                                        pointUpdate();
                                        emptyItem(playerTwo, playerTwo.item);
                                        removeIcons(playerTwo.item)
                                        dishComplete(playerTwo.item, sinkExists);
                                        var element = document.getElementById("orders");
                                        element.removeChild(element.getElementsByClassName("order_queue")[q]);
                                        foodOrders.splice(q, 1);
                                        playerTwo.item = null;
                                        break;
                                    }
                                }
                            }
                            if (!foodGood) {
                                points -= 20;
                                pointUpdate();
                                emptyItem(playerTwo, playerTwo.item);
                                removeIcons(playerTwo.item)
                                dishComplete(playerTwo.item, sinkExists);
                                playerTwo.item = null;
                            }
                        }
                    }
                    else if (worldObject[playerTwo.facing.y][playerTwo.facing.x] == "sink") {
                        if (!playerTwo.item.clean) {
                            playerTwo.item.x = playerTwo.facing.x;
                            playerTwo.item.y = playerTwo.facing.y;
                            updatePos(playerTwo.item);
                            normItemSize(playerTwo.item);
                            sink.item.push(playerTwo.item);
                            playerTwo.item = null;
                        }
                    }
                }
            }
        }

        //update held item
        if (playerTwo.item != null) {
            heldItemSize(playerTwo.item);
            heldItemPos(playerTwo);
            //pot held
            if (playerTwo.item.type == "pots") {
                heldItemIconSize(playerTwo.item);
            }
            //dish held
            else if (playerTwo.item.type == "dishes" && playerTwo.item.item.length > 0) {
                heldItemIconSize(playerTwo.item);
            }
        }
        //update player position
        updatePos(playerTwo);
    }
}