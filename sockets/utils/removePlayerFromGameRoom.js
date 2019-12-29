function removePlayerFromGameRoom(
  io,
  socket,
  playerLeavingRoomUid,
  gameRooms,
  playersArray,
  gameRoomTicks
) {
  gameRooms.forEach((room, i) => {
    // handle HOST leaving a game (remove all players and destroy the room)
    if (room.players.hostUid == playerLeavingRoomUid) {
      // remove all players and spectators that joined from the game before it is destroyed
      // first remove the challenger and host from the GameRoom socketio room and update their isInGame status
      clearInterval(gameRoomTicks[room.roomNumber]);
      playersArray.forEach(playerInArray => {
        if (
          playerInArray.uid == room.players.challengerUid ||
          playerInArray.uid == room.players.hostUid
        ) {
          if (io.sockets.sockets[playerInArray.socketId]) {
            // if they disconnected their socket will not exist
            // tell clients in this room to get the f out
            playerInArray.isInGame = false;
            io.sockets.sockets[playerInArray.socketId].emit(
              "updatePlayerInGameStatus",
              false
            );
            io.to(`game-${room.roomNumber}`).emit(
              "currentGameRoomUpdate",
              null
            );
            io.sockets.sockets[playerInArray.socketId].leave(
              `game-${room.roomNumber}`
            );
          }
        }
      });
      // once all players are out of the room, remove it
      gameRooms.splice(i, 1);
    } else {
      // handle player leaving a game they are not hosting
      if (playerLeavingRoomUid == room.players.challengerUid) {
        room.players.challengerUid = null;
        playersArray.forEach(playerInArray => {
          if (playerInArray.uid == playerLeavingRoomUid) {
            if (io.sockets.sockets[playerInArray.socketId]) {
              // they used leave button, not disconnected
              io.sockets.sockets[playerInArray.socketId].leave(
                `game-${room.roomNumber}`
              );
              playerInArray.isInGame = false;
              io.sockets.sockets[playerInArray.socketId].emit(
                "updatePlayerInGameStatus",
                false
              );
            }
            // make everyone not ready
            room.playersReady = [];
          }
        });
      }
    }
    socket.emit("currentGameRoomUpdate", null);
    io.to(`game-${room.roomNumber}`).emit("currentGameRoomUpdate", room);
  });
  io.sockets.emit("gameListUpdate", gameRooms);
  io.sockets.emit("updateOfPlayersArray", playersArray);
  return gameRooms;
}

module.exports = removePlayerFromGameRoom;
