// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/***Game Variables***/
var gameTimeLimit = 240;
var orderOptions = [onionSoup, tomatoSoup, mushroomSoup]

/***Generate World***/
var world = [
    [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
    [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
    [20, 0, 0, 0, 2, 1, 2, 1, 1, 7, 7, 6, 9, 0, 20],
    [20, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 20],
    [20, 0, 10, 0, 0, 11, 0, 1, 0, 0, 0, 12, 0, 0, 20],
    [20, 0, 10, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 20],
    [20, 0, 10, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 20],
    [20, 0, 8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 20],
    [20, 0, 1, 3, 1, 3, 1, 1, 13, 14, 15, 0, 0, 0, 20],
    [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
    [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
];

/***
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
    10: "table", //dishes
    11: "floor", //player_one
    12: "floor", //player_two
    13: "onion_box",
    14: "tomato_box",
    15: "mushroom_box",
    20: "wall"
***/