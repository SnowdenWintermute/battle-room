const Orb = require("../classes/Orb");

const moveOrbs = require("./moveOrbs");

function startGame(io, gameRoom) {
  console.log(gameRoom.roomNumber + "started");
  io.to(`game-${gameRoom.roomNumber}`).emit("serverInitsGame");
  for (let i = 0; i < 5; i++) {
    let startingX = (i + 1) * 50 + 75;
    gameRoom.orbs.hostOrbs.push(
      new Orb(
        startingX,
        50,
        gameRoom.orbRadius,
        gameRoom.players.hostUid,
        i + 1,
        "rgb(0, 153, 0)"
      )
    );
    gameRoom.orbs.challengerOrbs.push(
      new Orb(
        startingX,
        650,
        gameRoom.orbRadius,
        gameRoom.players.challengerUid,
        i + 1,
        "rgb(89, 0, 179)"
      )
    );
  }
  let serverGameTick = setInterval(() => {
    moveOrbs(gameRoom);
    io.to(`game-${gameRoom.roomNumber}`).emit("tickFromServer", gameRoom);
  }, 33);
  return serverGameTick;
}

module.exports = startGame;
