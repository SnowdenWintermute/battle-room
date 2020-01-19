class Orb {
  constructor(xPos, yPos, radius, owner, num) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.heading = {
      xPos: this.xPos,
      yPos: this.yPos
    };
    this.velocity = {
      x: 0,
      y: 0
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
