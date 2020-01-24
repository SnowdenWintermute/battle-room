function draw() {
  // clear it out
  context.clearRect(0, 0, canvas.width, canvas.height);

  // endzones
  let { x, y, width, height } = currentClientGameRoom.endzones.host;
  context.beginPath();
  context.fillStyle = "rgb(50,50,70)";
  context.fillRect(x, y, width, height);
  x = currentClientGameRoom.endzones.challenger.x;
  y = currentClientGameRoom.endzones.challenger.y;
  width = currentClientGameRoom.endzones.challenger.width;
  height = currentClientGameRoom.endzones.challenger.height;
  context.beginPath();
  context.fillStyle = "rgb(50,70,50)";
  context.fillRect(x, y, width, height);

  // score
  drawScore();

  drawOrbs();

  // selection box
  if (mouseData.leftCurrentlyPressed) {
    if (!mouseData.mouseOnScreen) {
      mouseData.leftCurrentlyPressed = false;
    }
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
