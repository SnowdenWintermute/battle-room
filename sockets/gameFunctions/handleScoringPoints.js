function handleScoringPoints(gameRoom) {
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
}

module.exports = handleScoringPoints;
