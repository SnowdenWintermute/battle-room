let wHeight = document.body.clientHeight;
let wWidth = document.body.clientWidth;
let canvas = document.querySelector("#the-canvas");
let context = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 700;
let mouseData = {
  leftPressedAtX: null,
  leftPressedAtY: null,
  leftReleasedAtX: null,
  leftReleasedAtY: null,
  leftCurrentlyPressed: false,
  xPos: 0,
  yPos: 0,
  mouseOnScreen: null
};
let clientPlayer = {};
let clientPlayersArray = [];
let clientGameRooms = {};
let currentClientGameRoom = {};
let selectedOrbs = [];
let menuOpen = true;
let clientTick;
let drawInterval;
