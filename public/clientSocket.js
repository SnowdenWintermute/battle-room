let socket = io.connect("http://localhost:8080");

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

function requestUpdateOfPlayersArray() {
  socket.emit("requestUpdateOfPlayersArray");
}

socket.on("gameListUpdate", newListOfGameRooms => {
  updateLobbyGamesList(newListOfGameRooms);
});

socket.on("currentGameRoomUpdate", currentGameRoom => {
  currentClientGameRoom = currentGameRoom;
  updateClientCurrentGameRoom(currentGameRoom);
});

socket.on("currentGameRoomCountdown", countdown => {
  currentClientGameRoom.countdown = countdown;
  updateClientCurrentGameRoom(currentClientGameRoom);
});

socket.on("updateOfPlayersArray", playersArrayForClient => {
  clientPlayersArray = playersArrayForClient;
});

socket.on("serverSendsPlayerData", data => {
  clientPlayer = data;
  console.log(data);
});

socket.on("updatePlayerInGameStatus", status => {
  clientPlayer.isInGame = status;
});

socket.on("serverInitsGame", () => {
  clientTick = clientStartsTicking();
  menuOpen = false;
  drawInterval = setInterval(() => {
    requestAnimationFrame(draw);
  }, 33);
  document.getElementById("the-canvas").setAttribute("style", "display:block");
});

socket.on("tickFromServer", gameRoom => {
  currentClientGameRoom = gameRoom;
  // updateGameField()
});
