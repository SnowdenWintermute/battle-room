const io = require("../servers").io;
const uuidv4 = require("uuid/v4");

const Player = require("./classes/Player");
const GameRoom = require("./classes/GameRoom");

const removePlayerFromGameRoom = require("./utils/removePlayerFromGameRoom");
const randomName = require("./utils/randomName");
const startGame = require("./gameFunctions/startGame");

let gameRooms = [];
let gameRoomTicks = {};
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
  socket.emit("currentGameRoomUpdate", {});

  // client requests to host new game
  socket.on("clientHostsNewGameRoom", noData => {
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
          socket.join(`game-${newGameRoom.roomNumber}`);
          nextRoomNumber++;
          playerInArray.isInGame = true;
          socket.emit("updatePlayerInGameStatus", true);
          io.sockets.emit("gameListUpdate", gameRooms);
          io.to(`game-${newGameRoom.roomNumber}`).emit(
            "currentGameRoomUpdate",
            newGameRoom
          );
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
        if (!playerInArray.isInGame) {
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
                io.sockets.emit("updateOfPlayersArray", playersArray);
                io.to(`game-${room.roomNumber}`).emit(
                  "currentGameRoomUpdate",
                  room
                );
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

  // client clicks ready
  socket.on("clientPlayerClicksReady", currentGameRoom => {
    playersArray.forEach(playerInArray => {
      if (playerInArray.socketId == socket.id) {
        gameRooms.forEach(room => {
          if (
            room.players.hostUid == currentGameRoom.players.hostUid &&
            currentGameRoom.players.challengerUid
          ) {
            if (!room.playersReady.includes(playerInArray.uid)) {
              room.playersReady.push(playerInArray.uid);
            } else {
              room.playersReady.splice(
                room.playersReady.indexOf(playerInArray.uid),
                1
              );
            }
            let countDownInterval = 0;

            // if both players are ready, start the countdown / or cancel it
            if (
              room.playersReady.includes(room.players.hostUid) &&
              room.playersReady.includes(room.players.challengerUid)
            ) {
              room.gameStatus = "countingDown";
              countDownInterval = setInterval(() => {
                io.to(`game-${currentGameRoom.roomNumber}`).emit(
                  "currentGameRoomCountdown",
                  room.countdown
                );
                if (room.countdown <= 0) {
                  room.gameStatus = "inProgress";
                  // send out the room data
                  io.to(`game-${currentGameRoom.roomNumber}`).emit(
                    "currentGameRoomUpdate",
                    room
                  );
                  gameRoomTicks[room.roomNumber] = startGame(io, room);
                }
                room.countdown--;
                if (room.gameStatus != "countingDown") {
                  clearInterval(countDownInterval);
                  room.countdown = 1;
                  io.to(`game-${currentGameRoom.roomNumber}`).emit(
                    "currentGameRoomCountdown",
                    room.countdown
                  );
                }
              }, 1000);
            } else {
              room.gameStatus = "inLobby";
            }
            // send out the room data
            io.to(`game-${currentGameRoom.roomNumber}`).emit(
              "currentGameRoomUpdate",
              room
            );
          }
        });
      }
    });
  });

  // client requests update of players array
  socket.on("requestUpdateOfPlayersArray", () => {
    let playersArrayForClient = [];
    playersArray.forEach(playerInArray => {
      let playerForClient = {};
      Object.keys(playerInArray).forEach(key => {
        if (key != "socketId") playerForClient[key] = playerInArray[key];
      });
      playersArrayForClient.push(playerForClient);
    });
    socket.emit("updateOfPlayersArray", playersArrayForClient);
  });

  socket.on("clientLeavesGame", () => {
    let clientPlayerLeavingUid;
    playersArray.forEach(playerInArray => {
      if (socket.id == playerInArray.socketId) {
        clientPlayerLeavingUid = playerInArray.uid;
      }
    });
    gameRooms = removePlayerFromGameRoom(
      io,
      socket,
      clientPlayerLeavingUid,
      gameRooms,
      playersArray,
      gameRoomTicks
    );
  });

  socket.on("disconnect", () => {
    let clientPlayerLeavingUid;
    let indexOfPlayerLeaving;
    playersArray.forEach((playerInArray, i) => {
      if (socket.id == playerInArray.socketId) {
        clientPlayerLeavingUid = playerInArray.uid;
        indexOfPlayerLeaving = i;
      }
    });
    removePlayerFromGameRoom(
      io,
      socket,
      clientPlayerLeavingUid,
      gameRooms,
      playersArray,
      gameRoomTicks
    );
    playersArray.splice(indexOfPlayerLeaving, 1);
  });
});
