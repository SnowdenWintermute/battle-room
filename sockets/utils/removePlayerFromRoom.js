function removePlayerFromGameRoom(
  io,
  socket,
  serverSidePlayer,
  clientPlayerLeaving,
  gameRooms,
  playersArray
) {
  if (serverSidePlayer.isHostingOrInGame) {
    // do I need to loop every gameRoom or just specify it?
    gameRooms.forEach((room, i) => {
      // handle HOST leaving a game
      if (room.hostUid == clientPlayerLeaving.uid) {
        // remove all players and spectators that joined from the game before it is destroyed
        room.players.forEach(playerInRoom => {
          playersArray.forEach(p => {
            if (playerInRoom.uid == p.uid) {
              p.isHostingOrInGame = false;
              if (io.sockets.sockets[p.socketId]) {
                io.sockets.sockets[p.socketId].emit(
                  "playerHostingOrInGameStatus",
                  false
                );
              }
            }
          });
        });
        io.sockets.in(`game-${room.roomNumber}`).clients((error, socketIds) => {
          if (error) throw error;
          socketIds.forEach(id => {
            io.sockets.sockets[id].leave(`game-${room.roomNumber}`);
            io.sockets.sockets[id].emit("playerHostingOrInGameStatus", false);
          });
        });
        gameRooms.splice(i, 1);
      } else {
        // handle player leaving a game they are not hosting
        room.players.forEach((p, i) => {
          if (p.uid == clientPlayerLeaving.uid) {
            room.players.splice(i, 1);
            serverSidePlayer.isHostingOrInGame = false;
            socket.leave(`game-${room.roomNumber}`);
            socket.emit("playerHostingOrInGameStatus", false);
          }
        });
      }
      io.sockets.emit("gameListUpdate", gameRooms);
    });
  }
  return gameRooms;
}

module.exports = removePlayerFromGameRoom;
