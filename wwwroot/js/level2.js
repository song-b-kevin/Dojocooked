// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/***Game Variables***/
var gameTimeLimit = 240;

/***Generate World***/
var world = [
    [1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 9, 8, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 7],
    [1, 0, 0, 0, 0, 11, 0, 11, 0, 0, 0, 0, 7],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 6],
    [1, 0, 0, 12, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 3, 1, 3, 1, 1, 1, 10, 1, 10, 1, 1]
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
***/