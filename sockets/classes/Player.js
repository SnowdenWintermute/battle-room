class Player {
  constructor(socketId, playerName, playerNumber) {
    this.socketId = socketId;
    this.name = playerName;
    this.playerNumber = playerNumber;
  }
}

module.exports = Player;
