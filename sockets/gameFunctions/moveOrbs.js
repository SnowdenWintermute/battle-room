function moveOrbs(gameRoom) {
  for (let orbSet in gameRoom.orbs) {
    gameRoom.orbs[orbSet].forEach(orb => {
      let tx = orb.heading.xPos - orb.xPos;
      let ty = orb.heading.yPos - orb.yPos;
      let dist = Math.sqrt(tx * tx + ty * ty);
      const velX = (tx / dist) * gameRoom.speed;
      const velY = (ty / dist) * gameRoom.speed;

      if (dist > 1) {
        orb.xPos += velX;
        orb.yPos += velY;
      }
    });
  }
}

module.exports = moveOrbs;
