canvas.addEventListener("mousedown", e => {
  if (e.button == 0) {
    mouseData.leftCurrentlyPressed = true;
    mouseData.leftPressedAtX = e.offsetX;
    mouseData.leftPressedAtY = e.offsetY;
  }
  console.log(e);
});
canvas.addEventListener("mouseup", e => {
  if (e.button == 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAtX = e.offsetX;
    mouseData.leftReleasedAtY = e.offsetY;
  }
});
canvas.addEventListener("mousemove", e => {
  mouseData.xPos = e.offsetX;
  mouseData.yPos = e.offsetY;
  console.log(e);
});
