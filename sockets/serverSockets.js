const io = require("../servers").io;
const uuidv4 = require("uuid/v4");

const Player = require("./classes/Player");

const clientHostsNewGameRoom = require("./lobbyFunctions/clientHostsNewGameRoom");
const clientJoinsGame = require("./lobbyFunctions/clientJoinsGame");
const clientPlayerClicksReady = require("./lobbyFunctions/clientPlayerClicksReady");

const removePlayerFromGameRoom = require("./utils/removePlayerFromGameRoom");
const randomName = require("./utils/randomName");
const makePlayerForClient = require("./utils/makePlayerForClient");

let gameRooms = {};
let gameUpdatePackets = {};
let gameRoomCountdownIntervals = {};
let gameRoomTicks = {};
let gameEndingTicks = {};
let nextRoomNumber = 1;
let connectedPlayers = {};

const defaultCountdownNumber = 1;

io.sockets.on("connect", socket => {
  // create a player object for the connecting client
  console.log(socket.id + " connected to the main namespace");
  let serverSidePlayer = new Player(socket.id, randomName());
  connectedPlayers[socket.id] = serverSidePlayer;
  const playerForClient = makePlayerForClient(serverSidePlayer);
  socket.emit("serverSendsPlayerData", playerForClient);
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
    clientJoinsGame(
      connectedPlayers,
      socket,
      io,
      gameRooms,
      roomNumberToJoin,
      connectedPlayers
    );
  });

  // client clicks ready
  socket.on("clientPlayerClicksReady", currentGameRoom => {
    clientPlayerClicksReady(
      currentGameRoom,
      gameRooms,
      connectedPlayers,
      gameRoomCountdownIntervals,
      socket,
      io,
      defaultCountdownNumber,
      gameRoomTicks,
      gameEndingTicks,
      gameUpdatePackets
    );
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
    // TODO: check for correct ownership
    // roomNumber, ownerOfOrbs, orbsToBeUpdated
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

  socket.on("clientSubmitsMoveCommand", data => {
    const { orbsClientWantsToMove, gameRoomNumber } = data;
    let whichPlayerOrbs;
    if (
      gameRooms[gameRoomNumber].players.hostUid ==
      connectedPlayers[socket.id].uid
    )
      whichPlayerOrbs = "hostOrbs";
    if (
      gameRooms[gameRoomNumber].players.challengerUid ==
      connectedPlayers[socket.id].uid
    )
      whichPlayerOrbs = "challengerOrbs";

    gameRooms[gameRoomNumber].orbs[whichPlayerOrbs] = orbsClientWantsToMove;
  });
});
