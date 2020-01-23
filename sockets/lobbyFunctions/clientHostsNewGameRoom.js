const GameRoom = require("../classes/GameRoom");

const settings = {
  width: 450,
  height: 700
};

function clientHostsNewGameRoom(
  connectedPlayers,
  serverSidePlayer,
  gameRooms,
  nextRoomNumber,
  io,
  socket,
  defaultCountdownNumber
) {
  if (!connectedPlayers[socket.id].isInGame) {
    // create new game room
    let newGameRoom = new GameRoom(
      nextRoomNumber,
      connectedPlayers[socket.id].uid,
      connectedPlayers[socket.id].name,
      defaultCountdownNumber,
      settings.width,
      settings.height
    );
    gameRooms[nextRoomNumber] = newGameRoom;
    // join their socket to the new game room
    socket.join(`game-${newGameRoom.roomNumber}`);
    nextRoomNumber++;
    connectedPlayers[socket.id].isInGame = true;
    socket.emit("updatePlayerInGameStatus", true);
    io.sockets.emit("gameListUpdate", gameRooms);
    io.to(`game-${newGameRoom.roomNumber}`).emit(
      "currentGameRoomUpdate",
      newGameRoom
    );
  } else {
    console.log("You can't host a game if you are already in one.");
  }
  return nextRoomNumber;
}

module.exports = clientHostsNewGameRoom;
