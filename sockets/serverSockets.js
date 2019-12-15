const io = require("../servers").io;
const uuidv4 = require("uuid/v4");

let gameRooms = [];
let nextRoomNumber = 1;

io.sockets.on("connect", socket => {
  console.log(socket.id + " connected to the main namespace");
  socket.on("clientStartsNewGame", data => {
    gameRooms.push({
      roomNumber: nextRoomNumber,
      hostedBy: data.hostingPlayer
    });
    console.log(gameRooms);
  });
});
