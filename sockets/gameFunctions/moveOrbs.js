function moveOrbs(gameRoom) {
  for (let orbSet in gameRoom.orbs) {
    gameRoom.orbs[orbSet].forEach(orb => {
      if (orb.isGhosting) {
        orb.heading.xPos = orb.xPos;
        switch (orbSet) {
          case "hostOrbs":
            orb.heading.yPos =
              gameRoom.endzones.host.y + gameRoom.endzones.host.height;
            if (
              orb.yPos <=
              gameRoom.endzones.host.y +
                gameRoom.endzones.host.height +
                orb.radius
            )
              orb.isGhosting = false;
            break;
          case "challengerOrbs":
            orb.heading.yPos = gameRoom.endzones.challenger.y;
            if (orb.yPos >= gameRoom.endzones.challenger.y - orb.radius)
              orb.isGhosting = false;
            break;
        }
      }
      let tx = orb.heading.xPos - orb.xPos;
      let ty = orb.heading.yPos - orb.yPos;
      let dist = Math.sqrt(tx * tx + ty * ty);
      const velX = (tx / dist) * gameRoom.speed;
      const velY = (ty / dist) * gameRoom.speed;

      if (dist >= orb.radius) {
        orb.xPos += velX;
        orb.yPos += velY;
      } else {
        orb.xPos = orb.heading.xPos;
        orb.yPos = orb.heading.yPos;
      }
    });
  }
}

module.exports = moveOrbs;
