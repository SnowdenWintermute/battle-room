const makePlayersObjectForClient = require("../utils/makePlayersObjectForClient");
function endGameCleanup(
  io,
  gameRoom,
  gameRooms,
  gameRoomTicks,
  gameEndingTicks,
  connectedPlayers
) {
  gameRoom.gameStatus = "ending";
  clearInterval(gameRoomTicks[gameRoom.roomNumber]);
  delete gameRoomTicks[gameRoom.roomNumber];
  gameEndingTicks[gameRoom.roomNumber] = setInterval(() => {
    if (gameRoom.endingStateCountdown < 2) {
      io.to(`game-${gameRoom.roomNumber}`).emit("showEndScreen", gameRoom);
      clearInterval(gameEndingTicks[gameRoom.roomNumber]);
      delete gameEndingTicks[gameRoom.roomNumber];
      // set players to not in game
      for (let playerUid in gameRoom.players) {
        for (let connectedPlayer in connectedPlayers) {
          if (
            connectedPlayers[connectedPlayer].uid ===
            gameRoom.players[playerUid]
          ) {
            connectedPlayers[connectedPlayer].isInGame = false;
            io.to(`game-${gameRoom.roomNumber}`).emit(
              "updatePlayerInGameStatus",
              false
            );
          }
        }
      }
      // remove the game room entirely
      delete gameRooms[gameRoom.roomNumber];
      const playersObjectForClient = makePlayersObjectForClient(
        connectedPlayers
      );
      io.sockets.emit("updateOfPlayersObject", playersObjectForClient);
      io.sockets.emit("gameListUpdate", gameRooms);
      io.to(`game-${gameRoom.roomNumber}`).emit("currentGameRoomUpdate", null);
    } else {
      gameRoom.endingStateCountdown -= 1;
      io.to(`game-${gameRoom.roomNumber}`).emit(
        "gameEndingCountdown",
        gameRoom.endingStateCountdown
      );
    }
  }, 1000);
}

module.exports = endGameCleanup;
