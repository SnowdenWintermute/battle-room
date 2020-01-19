class GameRoom {
  constructor(roomNumber, hostUid, gameName, defaultCountdownNumber) {
    this.roomNumber = roomNumber;
    this.gameName = gameName;
    this.players = {
      hostUid: hostUid,
      challengerUid: null // uid
    };
    this.spectators = [];
    this.gameStatus = "inLobby"; // inLobby, countingDown, inProgress, gameOverScreen
    this.countdown = defaultCountdownNumber;
    this.speed = 2;
    this.orbs = {
      hostOrbs: [],
      challengerOrbs: []
    };
    (this.playersReady = []), (this.messages = []); // {author: uid, msgText: String}
    this.score = {
      host: 0,
      challenger: 0
    };
    this.dashes = {
      host: {
        dashes: 3,
        recharging: false,
        cooldown: 3
      },
      challenger: {
        dashes: 3,
        recharging: false,
        cooldown: 3
      }
    };
    this.endzones = {
      host: {
        // xStart,yStart,width,height
      },
      challenger: {
        // xStart,yStart,width,height
      }
    };
  }
}
module.exports = GameRoom;
