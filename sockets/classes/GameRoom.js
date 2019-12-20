class GameRoom {
  constructor(roomNumber) {
    this.roomNumber = roomNumber;
    this.players = {
      host: {},
      challenger: {}
    };
    this.spectators = [];
    this.gameStatus = "inLobby"; // inLobby, countingDown, inProgress, gameOverScreen
    this.countdown = 5;
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
