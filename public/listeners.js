canvas.addEventListener("mousedown", e => {
  if (e.button == 0) {
    mouseData.leftCurrentlyPressed = true;
    mouseData.leftPressedAtX = e.offsetX;
    mouseData.leftPressedAtY = e.offsetY;
  }
});
canvas.addEventListener("mouseup", e => {
  if (e.button == 2) {
    mouseData.rightReleasedAtY = mouseData.yPos;
    mouseData.rightReleasedAtX = mouseData.xPos;
    orbMoveCommand(mouseData.rightReleasedAtX, mouseData.rightReleasedAtY);
  }
  if (e.button == 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAtX = e.offsetX;
    mouseData.leftReleasedAtY = e.offsetY;
    const { leftPressedAtX, leftPressedAtY, xPos, yPos } = mouseData;
    selectOrbs(leftPressedAtX, leftPressedAtY, xPos, yPos);
  }
});

canvas.addEventListener("contextmenu", e => {
  e.preventDefault();
});

canvas.addEventListener("mousemove", e => {
  mouseData.xPos = e.offsetX;
  mouseData.yPos = e.offsetY;
});

canvas.addEventListener("mouseleave", e => {
  mouseData.mouseOnScreen = false;
  if (mouseData.leftCurrentlyPressed) {
    const { leftPressedAtX, leftPressedAtY, xPos, yPos } = mouseData;
    selectOrbs(leftPressedAtX, leftPressedAtY, xPos, yPos);
    console.log(currentClientGameRoom.orbs);
  }
});
canvas.addEventListener("mouseenter", e => {
  mouseData.mouseOnScreen = true;
});
