class Orb {
  constructor(xPos, yPos, radius, owner, num) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.destination = {
      xPos: this.xPos,
      yPos: this.yPos
    };
    this.radius = radius;
    this.owner = owner;
    this.num = num;
    this.isGhost = false;
    this.isDashing = false;
    this.isSelected = false;
  }
}

module.exports = Orb;
