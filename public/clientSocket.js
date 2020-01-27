let socket = io.connect("192.168.29.149:8080");

function hostNewGame() {
  socket.emit("clientHostsNewGameRoom");
}

function leaveGame() {
  clearInterval(clientTick);
  socket.emit("clientLeavesGame");
}

function joinGame(roomNumber) {
  if (!clientPlayer.isInGame) {
    socket.emit("clientJoinsGame", roomNumber);
  } else {
    console.log("You are already in a game.");
  }
}

function clientPlayerClicksReady(currentGameRoom) {
  socket.emit("clientPlayerClicksReady", currentGameRoom);
}

function requestUpdateOfPlayersObject() {
  socket.emit("requestUpdateOfPlayersObject");
}

socket.on("gameListUpdate", newListOfGameRooms => {
  updateLobbyGamesList(newListOfGameRooms);
});

socket.on("currentGameRoomUpdate", currentGameRoom => {
  currentClientGameRoom = currentGameRoom;
  if (!currentGameRoom) menuOpen = true;
  if (drawInterval) clearInterval(drawInterval);
  updateClientCurrentGameRoom(currentGameRoom);
});

socket.on("currentGameRoomCountdown", countdown => {
  currentClientGameRoom.countdown = countdown;
  updateClientCurrentGameRoom(currentClientGameRoom);
});

socket.on("updateOfPlayersObject", playersObjectForClient => {
  clientPlayersObject = playersObjectForClient;
});

socket.on("serverSendsPlayerData", data => {
  clientPlayer = data;
});

socket.on("updatePlayerInGameStatus", status => {
  clientPlayer.isInGame = status;
});

socket.on("serverInitsGame", () => {
  let htmlCanvas = document.getElementById("the-canvas");
  htmlCanvas.setAttribute("style", "display: block");
  clientTick = clientStartsTicking();
  menuOpen = false;
  drawInterval = setInterval(() => {
    requestAnimationFrame(draw);
  }, 33);
});

socket.on("gameEndingCountdown", countdownNum => {
  currentClientGameRoom.endingStateCountdown = countdownNum;
});

socket.on("showEndScreen", gameRoom => {
  currentClientGameRoom = gameRoom;
  console.log("game ended ");
  let htmlCanvas = document.getElementById("the-canvas");
  htmlCanvas.setAttribute("style", "display: none");
  clearInterval(clientTick);
  clearInterval(drawInterval);
});

socket.on("tickFromServer", gameRoom => {
  currentClientGameRoom = gameRoom;
  // updateGameField()
});
