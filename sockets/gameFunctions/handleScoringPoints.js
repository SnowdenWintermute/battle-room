const endGameCleanup = require("./endGameCleanup");

function handleScoringPoints(
  io,
  gameRooms,
  gameRoom,
  connectedPlayers,
  socket,
  gameRoomTicks,
  gameEndingTicks
) {
  for (let orbSet in gameRoom.orbs) {
    gameRoom.orbs[orbSet].forEach(orb => {
      if (!orb.isGhosting) {
        switch (orbSet) {
          case "hostOrbs":
            if (orb.yPos >= gameRoom.endzones.challenger.y) {
              gameRoom.score.host += 1;
              orb.isGhosting = true;
            }
            break;
          case "challengerOrbs":
            if (
              orb.yPos <=
              gameRoom.endzones.host.y + gameRoom.endzones.host.height
            ) {
              gameRoom.score.challenger += 1;
              orb.isGhosting = true;
            }
        }
      }
    });
  }
  if (
    gameRoom.score.challenger >= gameRoom.score.neededToWin &&
    gameRoom.score.host >= gameRoom.score.neededToWin
  ) {
    gameRoom.winner = "tie";
  } else {
    if (gameRoom.score.challenger >= gameRoom.score.neededToWin) {
      gameRoom.winner = "challenger";
    }
    if (gameRoom.score.host >= gameRoom.score.neededToWin) {
      gameRoom.winner = "host";
    }
  }
  if (
    gameRoom.score.challenger >= gameRoom.score.neededToWin ||
    gameRoom.score.host >= gameRoom.score.neededToWin
  ) {
    endGameCleanup(
      io,
      gameRoom,
      gameRooms,
      gameRoomTicks,
      gameEndingTicks,
      connectedPlayers
    );
  }
}

module.exports = handleScoringPoints;
