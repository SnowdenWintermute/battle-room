let socket = io.connect("http://localhost:8080");

function hostNewGame() {
  socket.emit("clientStartsNewGame");
}

function leaveGame() {
  socket.emit("clientLeavesGame");
}

function joinGame(roomNumber) {
  if (!clientPlayer.isInGame) {
    socket.emit("clientJoinsGame", roomNumber);
  } else {
    console.log("You are already in a game.");
  }
}

function requestUpdateOfPlayersArray() {
  socket.emit("requestUpdateOfPlayersArray");
}

socket.on("gameListUpdate", newListOfGameRooms => {
  updateLobbyGamesList(newListOfGameRooms);
});

socket.on("currentGameRoomUpdate", currentGameRoom => {
  updateClientCurrentGameRoom(currentGameRoom);
});

socket.on("updateOfPlayersArray", playersArrayForClient => {
  clientPlayersArray = playersArrayForClient;
});

socket.on("serverSendsPlayerData", data => {
  clientPlayer = data;
});

socket.on("updatePlayerInGameStatus", status => {
  clientPlayer.isInGame = status;
});
