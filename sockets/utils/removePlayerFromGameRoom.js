function removePlayerFromGameRoom(
  io,
  socket,
  playerLeavingRoomUid,
  gameRooms,
  playersArray,
  gameRoomTicks
) {
  for (let room in gameRooms) {
    let gameRoomChannel = `game-${gameRooms[room].roomNumber}`;
    // handle HOST leaving a game (remove all players and destroy the room)
    if (gameRooms[room].players.hostUid == playerLeavingRoomUid) {
      // remove all players and spectators that joined from the game before it is destroyed
      // first remove the challenger and host from the GameRoom socketio room and update their isInGame status
      clearInterval(gameRoomTicks[gameRooms[room].roomNumber]);
      playersArray.forEach(playerInArray => {
        if (
          playerInArray.uid == gameRooms[room].players.challengerUid ||
          playerInArray.uid == gameRooms[room].players.hostUid
        ) {
          if (io.sockets.sockets[playerInArray.socketId]) {
            // if they disconnected their socket will not exist
            // tell clients in this room to get the f out
            playerInArray.isInGame = false;
            io.sockets.sockets[playerInArray.socketId].emit(
              "updatePlayerInGameStatus",
              false
            );
            io.to(`game-${gameRooms[room].roomNumber}`).emit(
              "currentGameRoomUpdate",
              null
            );
            io.sockets.sockets[playerInArray.socketId].leave(
              `game-${gameRooms[room].roomNumber}`
            );
          }
        }
      });
      // once all players are out of the room, remove it
      delete gameRooms[room];
    } else {
      // handle player leaving a game they are not hosting
      if (playerLeavingRoomUid == gameRooms[room].players.challengerUid) {
        gameRooms[room].players.challengerUid = null;
        playersArray.forEach(playerInArray => {
          if (playerInArray.uid == playerLeavingRoomUid) {
            if (io.sockets.sockets[playerInArray.socketId]) {
              // they used leave button, not disconnected
              io.sockets.sockets[playerInArray.socketId].leave(
                `game-${gameRooms[room].roomNumber}`
              );
              playerInArray.isInGame = false;
              io.sockets.sockets[playerInArray.socketId].emit(
                "updatePlayerInGameStatus",
                false
              );
            }
            // make everyone not ready
            gameRooms[room].playersReady = [];
          }
        });
      }
    }
    socket.emit("currentGameRoomUpdate", null);
    io.to(gameRoomChannel).emit("currentGameRoomUpdate", gameRooms[room]);
  }
  io.sockets.emit("gameListUpdate", gameRooms);
  io.sockets.emit("updateOfPlayersArray", playersArray);
  return gameRooms;
}

module.exports = removePlayerFromGameRoom;
