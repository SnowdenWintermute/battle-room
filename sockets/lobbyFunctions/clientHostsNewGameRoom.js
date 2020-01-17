const GameRoom = require("../classes/GameRoom");

function clientHostsNewGameRoom(
  playersArray,
  gameRooms,
  nextRoomNumber,
  io,
  socket
) {
  // check if client is already hosting or playing a game
  playersArray.forEach(playerInArray => {
    if (playerInArray.socketId == socket.id) {
      if (!playerInArray.isInGame) {
        // create new game room
        let newGameRoom = new GameRoom(
          nextRoomNumber,
          playerInArray.uid,
          playerInArray.name
        );
        gameRooms[nextRoomNumber] = newGameRoom;
        // join their socket to the new game room
        socket.join(`game-${newGameRoom.roomNumber}`);
        nextRoomNumber++;
        playerInArray.isInGame = true;
        socket.emit("updatePlayerInGameStatus", true);
        io.sockets.emit("gameListUpdate", gameRooms);
        io.to(`game-${newGameRoom.roomNumber}`).emit(
          "currentGameRoomUpdate",
          newGameRoom
        );
      } else {
        console.log("You can't host a game if you are already in one.");
      }
    }
  });
  return nextRoomNumber;
}

module.exports = clientHostsNewGameRoom;
