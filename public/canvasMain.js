let testOrb = {
  xPos: 30,
  yPos: 50,
  radius: 10,
  color: "rgb(10,10,10)",
  isSelected: false
};

function draw() {
  // clear it out
  context.clearRect(0, 0, canvas.width, canvas.height);
  // draw all orbs
  currentClientGameRoom.orbs.hostOrbs.forEach(orb => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.xPos, orb.yPos, orb.radius, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "rgb(30,70,30)";
    context.stroke();
  });
  currentClientGameRoom.orbs.challengerOrbs.forEach(orb => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.xPos, orb.yPos, orb.radius, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "rgb(30,30,70)";
    context.stroke();
  });

  // selection box
  if (mouseData.leftCurrentlyPressed) {
    const selectionBoxSize = getSelectionBoxSize();
    // console.log(mouseData.leftPressedAtX);
    context.beginPath();
    context.strokeStyle = "rgb(103,191,104)";
    context.rect(
      mouseData.leftPressedAtX,
      mouseData.leftPressedAtY,
      selectionBoxSize.width,
      selectionBoxSize.height
    );
    context.lineWidth = 3;
    context.stroke();
    selectOrbs(
      mouseData.leftPressedAtX,
      mouseData.leftPressedAtY,
      selectionBoxSize.width,
      selectionBoxSize.height
    );
  }
}

function getSelectionBoxSize() {
  const width = mouseData.xPos - mouseData.leftPressedAtX;
  const height = mouseData.yPos - mouseData.leftPressedAtY;
  return {
    width,
    height
  };
}
