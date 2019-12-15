let socket = io.connect("http://localhost:8080");

function hostNewGame() {
  socket.emit("clientStartsNewGame", {
    socketId: socket.id,
    hostingPlayer: clientPlayer.name
  });
}
