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
  }
});
canvas.addEventListener("mouseenter", e => {
  mouseData.mouseOnScreen = true;
});

// keys
window.addEventListener("keydown", e => {
  let keyPressed;
  switch (e.keyCode) {
    case 49: // 1
      keyPressed = 1;
      break;
    case 50: // 2
      keyPressed = 2;
      break;
    case 51: // 3
      keyPressed = 3;
      break;
    case 52: // 4
      keyPressed = 4;
      break;
    case 53: // 5
      keyPressed = 5;
      break;
    default:
      return;
  }
  if (keyPressed > 0 && keyPressed < 6) {
    selectOrbAndIssueMoveCommand(
      currentClientGameRoom,
      clientPlayer,
      keyPressed,
      mouseData
    );
  }
  console.log("keydown " + e.keyCode);
});
