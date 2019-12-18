let socket = io.connect("http://localhost:8080");

function hostNewGame() {
  socket.emit("clientStartsNewGame", {
    socketId: socket.id,
    hostingPlayerName: clientPlayer.name
  });
}

function leaveGame() {
  socket.emit("clientLeavesGame", clientPlayer);
}
function joinGame(room) {
  if (clientPlayer.uid != room.hostUid) {
    socket.emit("clientJoinsGame", { clientPlayer, room });
  } else {
    console.log("client can not join a game they are already hosting");
  }
}

socket.on("gameListUpdate", newListOfGameRooms => {
  updateListOfGamesInDOM(newListOfGameRooms);
  console.log(clientPlayer);
});

socket.on("serverSendsPlayerData", data => {
  Object.keys(data).forEach(key => {
    clientPlayer[key] = data[key];
  });
});

socket.on("playerHostingOrInGameStatus", status => {
  console.log("host status updated " + status);
  clientPlayer.isHostingOrInGame = status;
});
