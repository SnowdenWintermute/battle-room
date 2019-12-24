function updateLobbyGamesList(gameRooms) {
  clientGameRoomsArray = gameRooms;
  document.getElementById("game-rooms").innerHTML = "";

  gameRooms.forEach(room => {
    // make the buttons
    let joinButton = "",
      spectateButton = "";
    if (!clientPlayer.isInGame && !room.players.challengerUid) {
      joinButton = `<Button id="join-room-${room.roomNumber}" class='room-button dark-button'>JOIN</Button>`;
    }
    if (!clientPlayer.isInGame) {
      spectateButton = `<Button id="spectate-room-${room.roomNumber}" class='room-button green-button'>WATCH</Button>`;
    }

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
  });
  gameRooms.forEach(room => {
    let joinButton = document.getElementById(`join-room-${room.roomNumber}`);
    let spectateButton = document.getElementById(
      `spectate-room-${room.roomNumber}`
    );
    // add listeners to the buttons
    if (joinButton) {
      joinButton.addEventListener("click", e => {
        joinGame(room.roomNumber);
      });
    }
    if (spectateButton) {
      spectateButton.addEventListener("click", e => {
        console.log("clicked to spectate room " + room.roomNumber);
      });
    }
  });
}
