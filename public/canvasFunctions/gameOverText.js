function gameOverText() {
  if (currentClientGameRoom.gameStatus == "ending") {
    context.beginPath();
    context.fillStyle = "rgb(255,255,255)";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 12px Arial";
    context.fillText(
      `Winner: ${currentClientGameRoom.winner}`,
      currentClientGameRoom.width / 2,
      currentClientGameRoom.height / 2
    );
    context.fillText(
      "Score screen in " + currentClientGameRoom.endingStateCountdown,
      currentClientGameRoom.width / 2,
      currentClientGameRoom.height / 2 + 20
    );
  }
}
