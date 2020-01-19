const io = require("../servers").io;
const uuidv4 = require("uuid/v4");

const Player = require("./classes/Player");

const clientHostsNewGameRoom = require("./lobbyFunctions/clientHostsNewGameRoom");

const removePlayerFromGameRoom = require("./utils/removePlayerFromGameRoom");
const randomName = require("./utils/randomName");
const startGame = require("./gameFunctions/startGame");

let gameRooms = {};
let gameRoomCountdownIntervals = {};
let gameRoomTicks = {};
let nextRoomNumber = 1;
let connectedPlayers = {};

const defaultCountdownNumber = 1;

io.sockets.on("connect", socket => {
  // create a player object for the connecting client
  console.log(socket.id + " connected to the main namespace");
  let serverSidePlayer = new Player(socket.id, randomName());
  connectedPlayers[socket.id] = serverSidePlayer;
  socket.emit("serverSendsPlayerData", serverSidePlayer);
  // give client the list of games that may already exist
  io.sockets.emit("gameListUpdate", gameRooms);
  socket.emit("currentGameRoomUpdate", {});

  // client requests to host new game
  socket.on("clientHostsNewGameRoom", noData => {
    nextRoomNumber = clientHostsNewGameRoom(
      connectedPlayers,
      serverSidePlayer,
      gameRooms,
      nextRoomNumber,
      io,
      socket,
      defaultCountdownNumber
    );
  });

  // client requests to join a game
  socket.on("clientJoinsGame", roomNumberToJoin => {
    // check if client is already hosting or playing a game
    if (!connectedPlayers[socket.id].isInGame) {
      // check if there is already not a challenger
      if (!gameRooms[roomNumberToJoin].players.challengerUid) {
        // room is not full
        gameRooms[roomNumberToJoin].players.challengerUid =
          connectedPlayers[socket.id].uid;
        socket.join(`game-${gameRooms[roomNumberToJoin].roomNumber}`);
        connectedPlayers[socket.id].isInGame = true;
        socket.emit("updatePlayerInGameStatus", true);
        io.sockets.emit("gameListUpdate", gameRooms);
        // create a playersObject for client with Uid instead of socket.id
        let playersObjectForClient = {};
        for (let connectedPlayer in connectedPlayers) {
          let playerForClient = {};
          Object.keys(connectedPlayers[connectedPlayer]).forEach(key => {
            if (key != "socketId")
              playerForClient[key] = connectedPlayers[connectedPlayer][key];
          });
          console.log(playerForClient);
          playersObjectForClient[
            connectedPlayers[connectedPlayer].uid
          ] = playerForClient;
        }
        io.sockets.emit("updateOfPlayersObject", playersObjectForClient);

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
  });

  // client clicks ready
  socket.on("clientPlayerClicksReady", currentGameRoom => {
    const roomNumber = currentGameRoom.roomNumber;
    // check if this room still exists or it will crash server
    if (gameRooms[roomNumber]) {
      if (
        gameRooms[roomNumber].players.hostUid ==
          currentGameRoom.players.hostUid &&
        currentGameRoom.players.challengerUid
      ) {
        if (
          !gameRooms[roomNumber].playersReady.includes(
            connectedPlayers[socket.id].uid
          )
        ) {
          gameRooms[roomNumber].playersReady.push(
            connectedPlayers[socket.id].uid
          );
        } else {
          gameRooms[roomNumber].playersReady.splice(
            gameRooms[roomNumber].playersReady.indexOf(
              connectedPlayers[socket.id].uid
            ),
            1
          );
        }

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
          console.log(gameRooms[roomNumber].countdown);
          gameRoomCountdownIntervals[roomNumber] = setInterval(() => {
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
              gameRoomTicks[roomNumber] = startGame(io, gameRooms[roomNumber]);
            }
            gameRooms[roomNumber].countdown--;
            if (gameRooms[roomNumber].gameStatus != "countingDown") {
              clearInterval(gameRoomCountdownIntervals[roomNumber]);
              gameRooms[roomNumber].countdown = defaultCountdownNumber;
              io.to(`game-${currentGameRoom.roomNumber}`).emit(
                "currentGameRoomCountdown",
                gameRooms[roomNumber].countdown
              );
            }
            console.log(gameRooms[roomNumber].countdown);
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

  // client requests update of players array
  // we will send them everything about the players, except for their socket ids
  socket.on("requestupdateOfPlayersObject", () => {
    let playersObjectForClient = {};
    for (let connectedPlayer in connectedPlayers) {
      let playerForClient = {};
      Object.keys(connectedPlayers[connectedPlayer]).forEach(key => {
        if (key != "socketId")
          playerForClient[key] = connectedPlayers[connectedPlayer][key];
      });
      playersObjectForClient[
        connectedPlayers[connectedPlayer].uid
      ] = playerForClient;
    }

    socket.emit("updateOfPlayersObject", playersObjectForClient);
  });

  socket.on("clientLeavesGame", () => {
    const playerLeavingRoomUid = connectedPlayers[socket.id].uid;

    gameRooms = removePlayerFromGameRoom(
      io,
      socket,
      playerLeavingRoomUid,
      gameRooms,
      connectedPlayers,
      gameRoomTicks,
      gameRoomCountdownIntervals,
      defaultCountdownNumber
    );
  });

  socket.on("disconnect", () => {
    const playerLeavingRoomUid = connectedPlayers[socket.id].uid;
    removePlayerFromGameRoom(
      io,
      socket,
      playerLeavingRoomUid,
      gameRooms,
      connectedPlayers,
      gameRoomTicks,
      gameRoomCountdownIntervals,
      defaultCountdownNumber
    );
    delete connectedPlayers[socket.id];
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
