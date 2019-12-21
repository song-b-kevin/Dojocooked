// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/***Game Variables***/
var gameTimeLimit = 150;
var orderOptions = [onionSoup]

/***Generate World***/
var world = [
    [1, 1, 1, 10, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [1, 0, 0, 12, 0, 0, 0, 0, 13, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 5],
    [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
    [1, 1, 1, 3, 1, 3, 1, 1, 1, 11, 11, 1, 1]
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
    10: "onion_box",
    11: "table", //dishes
    12: "floor", //player_one
    13: "floor" //player_two
***/