// setup & initilize
var userInputRange = {};
var inpX = document.getElementById("x");
var inpY = document.getElementById("y");
var inpWidth = document.getElementById("width");
var inpHeight = document.getElementById("height");
var blackColor = "#2f2f2f";
var whiteColor = "#fdfdfd";
var enlargedCircleSize = "10"; // circle size for a hovered leaf node
var normalCircleSize = "5";
var defaultTimerWait = 20;
var timerWait = 1000;

// globals for explaination
var numMessage = 0;
var startingMessageX = 10;
var startingMessageY = 20;
var messageRange = 18;

var planeSVG = d3.select("#plane");
var treeSVG = d3.select("#tree");

const timer = (ms) => new Promise((res) => setTimeout(res, ms));
// stores the data used to draw the tree nodes
var treeData = [];
// stores the data used to draw the tree branch
var treeBranch = [];

// points are stored in dps -> data points;
var dps = [];

var leafNodeID = {};
// treeNodeID starts from 0 and increase
var treeNodeID = 0;
// leafIDCounter starts from -1 and decrease
var leafIDCounter = -1;
