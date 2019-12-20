const uuidv4 = require("uuid/v4");

class Player {
  constructor(socketId, playerName, playerNumber) {
    this.uid = uidv4();
    this.socketId = socketId;
    this.name = playerName;
    this.isInGame = false;
  }
}

module.exports = Player;
