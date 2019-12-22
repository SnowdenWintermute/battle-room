function updateListOfGamesInDOM(gameRooms) {
  console.log(gameRooms);
  document.getElementById("game-rooms").innerHTML = "";
  // show host or leave button at top
  let currentGameUi = document.getElementById("current-game");
  if (clientPlayer.isInGame) {
    currentGameUi.innerHTML = `<Button id="leave-room" class='room-button red-button'>LEAVE</Button>`;
    currentGameUi.innerHTML += `
      <div id="current-game-lobby-room">
        <div id="">${""}</div>
        <div id="">${""}</div>
        <div id="">${""}</div>
        <div id="">${""}</div>
        <div id="">${""}</div>
        <div id="">${""}</div>
      </div>`;
  } else {
    currentGameUi.innerHTML = `<button id="host-game-button" class='room-button green-button'>NEW GAME</button>`;
  }
  if (clientPlayer.isInGame) {
    document.getElementById(`leave-room`).addEventListener("click", e => {
      console.log("clicked to leave room ");
      leaveGame();
    });
  } else {
    document
      .getElementById("host-game-button")
      .addEventListener("click", () => {
        console.log("host new game button pressed");
        hostNewGame();
      });
  }

  gameRooms.forEach(room => {
    // make the buttons
    let joinButton;
    if (
      room.hostUid !== clientPlayer.uid &&
      !room.players.challengerUid &&
      !clientPlayer.isInGame
    ) {
      joinButton = `<Button id="join-room-${room.roomNumber}" class='room-button dark-button'>JOIN</Button>`;
    } else {
      joinButton = "";
    }
    let spectateButton;
    if (clientPlayer.isInGame) spectateButton = "";
    else
      spectateButton = `<Button id="spectate-room-${room.roomNumber}" class='room-button green-button'>WATCH</Button>`;

    // update the list of games in html
    let numberOfPlayersInRoom;
    if (room.players.challengerUid) numberOfPlayersInRoom = 2;
    else numberOfPlayersInRoom = 1;
    const newRoomHTML = `
    <tr class="game-room">
      <td class="room-number">ROOM ${room.roomNumber}</td>
      <td class="room-host">${room.gameName.toUpperCase()}</td>
      <td class="room-players">${numberOfPlayersInRoom}/2</td>
      <td class="room-spectators">SPECTATORS 0</td>
      <td class="room-buttons-holder">
        ${joinButton}
        ${spectateButton}
      </td>
    </tr>`;
    document.getElementById("game-rooms").innerHTML += newRoomHTML;
    // add listeners to the buttons
    if (joinButton) {
      document
        .getElementById(`join-room-${room.roomNumber}`)
        .addEventListener("click", e => {
          console.log("clicked to join room " + room.roomNumber);
          joinGame(room.roomNumber);
        });
    }
    if (spectateButton) {
      document
        .getElementById(`spectate-room-${room.roomNumber}`)
        .addEventListener("click", e => {
          console.log("clicked to spectate room " + room.roomNumber);
        });
    }
  });
}
