function updateClientCurrentGameRoom(currentGameRoom) {
  let currentGameUi = document.getElementById("current-game");
  // if not in game, give new game button
  if (!clientPlayer.isInGame) {
    currentGameUi.innerHTML = `<button id="host-game-button" class='room-button green-button'>NEW GAME</button>`;
    document.getElementById("host-game-button").addEventListener("click", e => {
      hostNewGame();
    });
  }
  // if in game, display the leave button and current game room info
  else if (currentGameRoom) {
    // client is in game, make the room
    // make leave button
    currentGameUi.innerHTML = `<Button id="leave-room" class='room-button red-button'>LEAVE</Button>`;

    // make the displayed names and room number
    let currentRoomHostName, currentRoomChallengerName;
    // determine if this client is host or challenger (later spectator as well)
    if (currentGameRoom.players.hostUid == clientPlayer.uid)
      currentRoomHostName = clientPlayer.name;
    if (currentGameRoom.players.challengerUid == clientPlayer.uid) {
      currentRoomHostName = currentGameRoom.gameName;
      currentRoomChallengerName = clientPlayer.name;
    } else if (currentGameRoom.players.challengerUid) {
      clientPlayersArray.forEach(playerInArray => {
        if (playerInArray.uid == currentGameRoom.players.challengerUid)
          currentRoomChallengerName = playerInArray.name;
      });
    }
    if (!currentRoomChallengerName) currentRoomChallengerName = "";

    currentGameUi.innerHTML += `
          <div id="current-game-lobby-room">
            <div id="current-game-room-number">Room ${
              currentGameRoom.roomNumber
            }</div>
            <div id="current-game-host">Host: ${currentRoomHostName}</div>
            <div id="current-game-challenger">Challenger: ${currentRoomChallengerName}</div>
            <div id="ready-button">${""}</div>
            <div id="">${""}</div>
            <div id="">${""}</div>
          </div>`;

    // events have to go at bottom (below any +=)
    document.getElementById(`leave-room`).addEventListener("click", e => {
      leaveGame();
    });
  }
}
