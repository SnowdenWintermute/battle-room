function drawScore() {
  context.beginPath();
  context.fillStyle = "rgb(255,255,255)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "bold 12px Arial";
  context.fillText(`${currentClientGameRoom.score.host}`, 20, 20);
  context.fillText(
    `${currentClientGameRoom.score.challenger}`,
    20,
    currentClientGameRoom.height - 20
  );
}
