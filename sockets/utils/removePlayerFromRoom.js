function removePlayerFromGameRoom(
  io,
  playerLeavingRoomUid,
  gameRooms,
  playersArray
) {
  gameRooms.forEach((room, i) => {
    // handle HOST leaving a game (remove all players and destroy the room)
    if (room.players.hostUid == playerLeavingRoomUid) {
      console.log("client leaving a game they are hosting");
      // remove all players and spectators that joined from the game before it is destroyed
      // first remove the challenger and host from the GameRoom socketio room and update their isInGame status
      playersArray.forEach(playerInArray => {
        if (
          playerInArray.uid == room.players.challengerUid ||
          playerInArray.uid == room.players.hostUid
        ) {
          if (io.sockets.sockets[playerInArray.socketId]) {
            // if they disconnected their socket will not exist
            io.sockets.sockets[playerInArray.socketId].leave(
              `game-${room.roomNumber}`
            );
            playerInArray.isInGame = false;
            io.sockets.sockets[playerInArray.socketId].emit(
              "updatePlayerInGameStatus",
              false
            );
          }
        }
      });
      // once all players are out of the room, remove it
      gameRooms.splice(i, 1);
    } else {
      // handle player leaving a game they are not hosting
      console.log("client leaving game they not host of");
      if (playerLeavingRoomUid == room.players.challengerUid) {
        room.players.challengerUid = null;
        playersArray.forEach(playerInArray => {
          if (playerInArray.uid == playerLeavingRoomUid) {
            io.sockets.sockets[playerInArray.socketId].leave(
              `game-${room.roomNumber}`
            );
            playerInArray.isInGame = false;
            io.sockets.sockets[playerInArray.socketId].emit(
              "updatePlayerInGameStatus",
              false
            );
          }
        });
      }
    }
  });
  io.sockets.emit("gameListUpdate", gameRooms);
  return gameRooms;
}

module.exports = removePlayerFromGameRoom;
