const io = require("../servers").io;
const uuidv4 = require("uuid/v4");

const Player = require("./classes/Player");
const GameRoom = require("./classes/GameRoom");

const removePlayerFromGameRoom = require("./utils/removePlayerFromRoom");
const randomName = require("./utils/randomName");

let gameRooms = [];
let nextRoomNumber = 1;
let playersArray = [];

io.sockets.on("connect", socket => {
  // create a player object for the connecting client
  console.log(socket.id + " connected to the main namespace");
  let serverSidePlayer = new Player(socket.id, randomName());
  playersArray.push(serverSidePlayer);
  socket.emit("serverSendsPlayerData", serverSidePlayer);
  // give client the list of games that may already exist
  io.sockets.emit("gameListUpdate", gameRooms);

  // client requests to host new game
  socket.on("clientStartsNewGame", noData => {
    // check if client is already hosting or playing a game
    playersArray.forEach(playerInArray => {
      if (playerInArray.socketId == socket.id) {
        if (!playerInArray.isInGame) {
          // create new game room
          let newGameRoom = new GameRoom(
            nextRoomNumber,
            playerInArray.uid,
            playerInArray.name
          );
          gameRooms.push(newGameRoom);
          // join their socket to the new game room
          socket.join(`game-${newGameRoom.nextRoomNumber}`);
          nextRoomNumber++;
          playerInArray.isInGame = true;
          socket.emit("updatePlayerInGameStatus", true);
          io.sockets.emit("gameListUpdate", gameRooms);
        } else {
          console.log("You can't host a game if you are already in one.");
        }
      }
    });
  });

  // client requests to join a game
  socket.on("clientJoinsGame", roomNumberToJoin => {
    // check if client is already hosting or playing a game
    playersArray.forEach(playerInArray => {
      if (playerInArray.socketId == socket.id) {
        // found client player in players array
        console.log("found client player in players array");
        if (!playerInArray.isInGame) {
          // client player is not in game already
          console.log("client player is not in game");
          gameRooms.forEach(room => {
            if (room.roomNumber == roomNumberToJoin) {
              // check if there is already not a challenger
              if (!room.players.challengerUid) {
                // room is not full
                room.players.challengerUid = playerInArray.uid;
                socket.join(`game-${room.roomNumber}`);
                playerInArray.isInGame = true;
                socket.emit("updatePlayerInGameStatus", true);
                io.sockets.emit("gameListUpdate", gameRooms);
              } else {
                console.log("That room is full.");
              }
            }
          });
        } else {
          console.log("You are already in a game.");
        }
      }
    });
  });

  socket.on("clientLeavesGame", noData => {
    let clientPlayerLeavingUid;
    playersArray.forEach(playerInArray => {
      if (socket.id == playerInArray.socketId) {
        clientPlayerLeavingUid = playerInArray.uid;
      }
    });
    gameRooms = removePlayerFromGameRoom(
      io,
      clientPlayerLeavingUid,
      gameRooms,
      playersArray
    );
  });
  socket.on("disconnect", () => {
    //something is wrong with this... i think
    let clientPlayerLeavingUid;
    playersArray.forEach(playerInArray => {
      if (socket.id == playerInArray.socketId) {
        clientPlayerLeavingUid = playerInArray.uid;
      }
    });
    removePlayerFromGameRoom(
      io,
      clientPlayerLeavingUid,
      gameRooms,
      playersArray
    );
  });
});
