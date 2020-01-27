const startGame = require("../gameFunctions/startGame");

function clientPlayerClicksReady(
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
) {
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
            gameRoomTicks[roomNumber] = startGame(
              io,
              gameRooms,
              gameRooms[roomNumber],
              connectedPlayers,
              socket,
              gameRoomTicks,
              gameEndingTicks,
              gameUpdatePackets
            );
          }
          gameRooms[roomNumber].countdown--;
          if (gameRooms[roomNumber].gameStatus != "countingDown") {
            clearInterval(gameRoomCountdownIntervals[roomNumber]);
            delete gameRoomCountdownIntervals[roomNumber];
            gameRooms[roomNumber].countdown = defaultCountdownNumber;
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
}

module.exports = clientPlayerClicksReady;
