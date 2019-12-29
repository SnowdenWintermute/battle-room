const Orb = require("../classes/Orb");

function startGame(io, gameRoom) {
  console.log(gameRoom.roomNumber + "started");
  io.to(`game-${gameRoom.roomNumber}`).emit("serverInitsGame");
  for (let i = 0; i < 5; i++) {
    let startingX = (i + 1) * 50 + 75;
    gameRoom.orbs.hostOrbs.push(
      new Orb(startingX, 50, 5, gameRoom.players.hostUid, i + 1)
    );
    gameRoom.orbs.challengerOrbs.push(
      new Orb(startingX, 650, 5, gameRoom.players.hostUid, i + 1)
    );
  }
  let serverGameTick = setInterval(() => {
    // updateOrbPositions()
    io.to(`game-${gameRoom.roomNumber}`).emit("tickFromServer", gameRoom);
  }, 33);
  return serverGameTick;
}

module.exports = startGame;
