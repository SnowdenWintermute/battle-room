function handleOrbCollisions(gameRoom) {
  gameRoom.orbs["hostOrbs"].forEach(orb => {
    let orbsCollidedNums = [];
    if (!orb.isGhosting) {
      gameRoom.orbs["challengerOrbs"].forEach(orbToCheckCollisionWith => {
        if (
          Math.abs(orb.xPos - orbToCheckCollisionWith.xPos) <=
            orb.radius + orbToCheckCollisionWith.radius &&
          Math.abs(orb.yPos - orbToCheckCollisionWith.yPos) <=
            orb.radius + orbToCheckCollisionWith.radius
        ) {
          if (!orbToCheckCollisionWith.isGhosting) {
            orbsCollidedNums.push(orbToCheckCollisionWith.num);
          }
        }
      });
    }
    if (orbsCollidedNums[0]) {
      gameRoom.orbs["challengerOrbs"][
        orbsCollidedNums[0] - 1
      ].isGhosting = true;
      orb.isGhosting = true;
    }
  });
}

module.exports = handleOrbCollisions;
