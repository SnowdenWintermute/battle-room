let wHeight = document.body.clientHeight;
let wWidth = document.body.clientWidth;
let canvas = document.querySelector("#the-canvas");
let context = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 700;
let mouseData = {
  leftPressedAtX: 0,
  leftPressedAtY: 0,
  leftReleasedAtX: 0,
  leftReleasedAtY: 0,
  leftCurrentlyPressed: false,
  xPos: 0,
  yPos: 0
};
let clientPlayer = {
  name: "Orby Joe",
  playerNumber: 0,
};
