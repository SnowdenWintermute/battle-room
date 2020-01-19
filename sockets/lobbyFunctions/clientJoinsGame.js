function clientJoinsGame(
  connectedPlayers,
  socket,
  io,
  gameRooms,
  roomNumberToJoin,
  connectedPlayers
) {
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
}

module.exports = clientJoinsGame;
