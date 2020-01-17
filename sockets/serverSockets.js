const io = require("../servers").io;
const uuidv4 = require("uuid/v4");

const Player = require("./classes/Player");

const clientHostsNewGameRoom = require("./lobbyFunctions/clientHostsNewGameRoom");

const removePlayerFromGameRoom = require("./utils/removePlayerFromGameRoom");
const randomName = require("./utils/randomName");
const startGame = require("./gameFunctions/startGame");

let gameRooms = {};
let gameRoomTicks = {};
let nextRoomNumber = 1;
let playersArray = [];
let a = { b: 1 };

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
    nextRoomNumber = clientHostsNewGameRoom(
      playersArray,
      gameRooms,
      nextRoomNumber,
      io,
      socket
    );
  });

  // client requests to join a game
  socket.on("clientJoinsGame", roomNumberToJoin => {
    // check if client is already hosting or playing a game
    playersArray.forEach(playerInArray => {
      if (playerInArray.socketId == socket.id) {
        if (!playerInArray.isInGame) {
          // check if there is already not a challenger
          if (!gameRooms[roomNumberToJoin].players.challengerUid) {
            // room is not full
            gameRooms[roomNumberToJoin].players.challengerUid =
              playerInArray.uid;
            socket.join(`game-${gameRooms[roomNumberToJoin].roomNumber}`);

            playerInArray.isInGame = true;
            socket.emit("updatePlayerInGameStatus", true);
            io.sockets.emit("gameListUpdate", gameRooms);
            io.sockets.emit("updateOfPlayersArray", playersArray);
            io.to(`game-${gameRooms[roomNumberToJoin].roomNumber}`).emit(
              "currentGameRoomUpdate",
              gameRooms[roomNumberToJoin]
            );
          } else {
            console.log("That room is full.");
          }
        } else {
          console.log("You are already in a game.");
        }
      }
    });
  });

  // client clicks ready
  socket.on("clientPlayerClicksReady", currentGameRoom => {
    const roomNumber = currentGameRoom.roomNumber;
    playersArray.forEach(playerInArray => {
      if (playerInArray.socketId == socket.id) {
        if (
          gameRooms[roomNumber].players.hostUid ==
            currentGameRoom.players.hostUid &&
          currentGameRoom.players.challengerUid
        ) {
          if (!gameRooms[roomNumber].playersReady.includes(playerInArray.uid)) {
            gameRooms[roomNumber].playersReady.push(playerInArray.uid);
          } else {
            gameRooms[roomNumber].playersReady.splice(
              gameRooms[roomNumber].playersReady.indexOf(playerInArray.uid),
              1
            );
          }
          let countDownInterval = 0;

          // if both players are ready, start the countdown / or cancel it
          if (
            gameRooms[roomNumber].playersReady.includes(
              gameRooms[roomNumber].players.hostUid
            ) &&
            gameRooms[roomNumber].playersReady.includes(
              gameRooms[roomNumber].players.challengerUid
            )
          ) {
            gameRooms[roomNumber].gameStatus = "countingDown";
            countDownInterval = setInterval(() => {
              io.to(`game-${currentGameRoom.roomNumber}`).emit(
                "currentGameRoomCountdown",
                gameRooms[roomNumber].countdown
              );
              if (gameRooms[roomNumber].countdown <= 0) {
                gameRooms[roomNumber].gameStatus = "inProgress";
                // send out the room data
                io.to(`game-${currentGameRoom.roomNumber}`).emit(
                  "currentGameRoomUpdate",
                  gameRooms[roomNumber]
                );
                gameRoomTicks[gameRooms[roomNumber].roomNumber] = startGame(
                  io,
                  gameRooms[roomNumber]
                );
              }
              gameRooms[roomNumber].countdown--;
              if (gameRooms[roomNumber].gameStatus != "countingDown") {
                clearInterval(countDownInterval);
                gameRooms[roomNumber].countdown = 1;
                io.to(`game-${currentGameRoom.roomNumber}`).emit(
                  "currentGameRoomCountdown",
                  gameRooms[roomNumber].countdown
                );
              }
            }, 1000);
          } else {
            gameRooms[roomNumber].gameStatus = "inLobby";
          }
          // send out the room data
          io.to(`game-${currentGameRoom.roomNumber}`).emit(
            "currentGameRoomUpdate",
            gameRooms[roomNumber]
          );
        }
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

  // game
  socket.on("clientSendsOrbSelections", data => {
    // roomNumber, ownerOfOrbs, orbsToBeUpdated
    console.log(data);
    const { roomNumber, ownerOfOrbs, orbsToBeUpdated } = data;
    if (gameRooms[roomNumber]) {
      gameRooms[roomNumber].orbs[ownerOfOrbs].forEach(orb => {
        orbsToBeUpdated.forEach(selectedOrb => {
          if (selectedOrb.num === orb.num) {
            orb.isSelected = selectedOrb.isSelected;
          }
        });
      });
    }
  });
});
