const io = require("../servers").io;
const uuidv4 = require("uuid/v4");

const removePlayerFromGameRoom = require("./utils/removePlayerFromRoom");

let gameRooms = [];
let nextRoomNumber = 1;
let playersArray = [];

io.sockets.on("connect", socket => {
  console.log(socket.id + " connected to the main namespace");
  let serverSidePlayer = {
    socketId: socket.id,
    isHostingOrInGame: false,
    uid: uuidv4(),
    record: {
      wins: 0,
      losses: 0
    },
    orbs: []
  };
  playersArray.push(serverSidePlayer);
  socket.emit("serverSendsPlayerData", serverSidePlayer);
  // give client the list of games
  io.sockets.emit("gameListUpdate", gameRooms);
  // client requests to host new game
  socket.on("clientStartsNewGame", data => {
    // check if client is already hosting or playing a game
    if (!serverSidePlayer.isHostingOrInGame) {
      // create new game room
      let newGameRoom = {
        roomNumber: nextRoomNumber,
        hostedBy: data.hostingPlayerName,
        hostUid: serverSidePlayer.uid,
        gameStatus: "waiting for players",
        players: [serverSidePlayer],
        spectators: []
      };
      gameRooms.push(newGameRoom);
      nextRoomNumber++;
      // join their socket to the new game room
      socket.join(`game-${newGameRoom.roomNumber}`);
      serverSidePlayer.isHostingOrInGame = true;
      socket.emit("playerHostingOrInGameStatus", true);
      io.sockets.emit("gameListUpdate", gameRooms);
    } else {
      console.log("can't host more than one game at a time");
    }
  });
  socket.on("clientJoinsGame", data => {
    if (!serverSidePlayer.isHostingOrInGame) {
      if (data.clientPlayer.uid != data.room.hostUid) {
        gameRooms.forEach(room => {
          if (room.roomNumber == data.room.roomNumber) {
            if (room.players.length < 2) {
              room.players.push(serverSidePlayer);
              socket.join(`game-${room.roomNumber}`);
              serverSidePlayer.isHostingOrInGame = true;
              socket.emit("playerHostingOrInGameStatus", true);
              io.sockets.emit("gameListUpdate", gameRooms);
            } else {
              console.log("that room is full");
            }
          }
        });
      } else {
        console.log(" client tried to join a game they were already hosting");
      }
    }
  });
  socket.on("clientLeavesGame", clientPlayerLeaving => {
    console.log("client wants to lave game");
    gameRooms = removePlayerFromGameRoom(
      io,
      socket,
      serverSidePlayer,
      clientPlayerLeaving,
      gameRooms,
      playersArray
    );
  });
  socket.on("disconnect", () => {
    //something is wrong with this... i think
    removePlayerFromGameRoom(
      io,
      socket,
      serverSidePlayer,
      serverSidePlayer,
      gameRooms,
      playersArray
    );
  });
});
