class Orb {
  constructor(xPos, yPos, radius, controllingPlayer, rosterNumber) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
    this.controllingPlayer = controllingPlayer;
    this.rosterNumber = rosterNumber;
    this.isSelected = false;
  }
}

module.exports = Orb;
