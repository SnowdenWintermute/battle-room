function removePlayerFromGameRoom(
  io,
  socket,
  playerLeavingRoomUid,
  gameRooms,
  connectedPlayers,
  gameRoomTicks,
  gameRoomCountdownIntervals,
  defaultCountdownNumber
) {
  for (let room in gameRooms) {
    const hostUid = gameRooms[room].players.hostUid;
    let hostSocketId;
    const challengerUid = gameRooms[room].players.challengerUid;
    let challengerSocketId;
    for (const connectedPlayer in connectedPlayers) {
      if (connectedPlayers[connectedPlayer].uid === hostUid)
        hostSocketId = connectedPlayers[connectedPlayer].socketId;
      if (connectedPlayers[connectedPlayer].uid === challengerUid)
        challengerSocketId = connectedPlayers[connectedPlayer].socketId;
    }

    const gameRoomChannel = `game-${gameRooms[room].roomNumber}`;
    // handle HOST leaving a game (remove all players and destroy the room)
    if (gameRooms[room].players.hostUid == playerLeavingRoomUid) {
      console.log("host left their game");
      // remove all players and spectators that joined from the game before it is destroyed
      // first remove the challenger and host from the GameRoom socketio room and update their isInGame status
      clearInterval(gameRoomTicks[gameRooms[room].roomNumber]);
      clearInterval(gameRoomCountdownIntervals[gameRooms[room].roomNumber]);

      // remove challenger first
      if (io.sockets.sockets[challengerSocketId]) {
        // if they disconnected their socket will not exist
        // tell clients in this room to get the f out
        connectedPlayers[challengerSocketId].isInGame = false;
        io.sockets.sockets[challengerSocketId].emit(
          "updatePlayerInGameStatus",
          false
        );
        // wipe the game room on client
        io.to(gameRoomChannel).emit("currentGameRoomUpdate", null);
        io.sockets.sockets[challengerSocketId].leave(gameRoomChannel);
      }
      // remove host
      if (io.sockets.sockets[hostSocketId]) {
        // if they disconnected their socket will not exist
        // tell clients in this room to get the f out
        connectedPlayers[hostSocketId].isInGame = false;
        io.sockets.sockets[hostSocketId].emit(
          "updatePlayerInGameStatus",
          false
        );
        io.sockets.sockets[hostSocketId].leave(gameRoomChannel);
      }

      // once all players are out of the room, remove it
      delete gameRooms[room];
    } else {
      // handle player leaving a game they are not hosting
      if (playerLeavingRoomUid == gameRooms[room].players.challengerUid) {
        clearInterval(gameRoomCountdownIntervals[gameRooms[room].roomNumber]);
        gameRooms[room].countdown = defaultCountdownNumber;

        gameRooms[room].players.challengerUid = null;

        if (io.sockets.sockets[challengerSocketId]) {
          // they used leave button, not disconnected
          io.sockets.sockets[challengerSocketId].leave(gameRoomChannel);
          connectedPlayers[challengerSocketId].isInGame = false;
          io.sockets.sockets[challengerSocketId].emit(
            "updatePlayerInGameStatus",
            false
          );
        }
        // make everyone not ready
        gameRooms[room].playersReady = [];
      }
    }
    socket.emit("currentGameRoomUpdate", null);
    io.to(gameRoomChannel).emit("currentGameRoomUpdate", gameRooms[room]);
  }
  io.sockets.emit("gameListUpdate", gameRooms);
  io.sockets.emit("updateOfPlayersObject", connectedPlayers);
  return gameRooms;
}

module.exports = removePlayerFromGameRoom;
