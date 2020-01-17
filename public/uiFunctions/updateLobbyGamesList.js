function updateLobbyGamesList(gameRooms) {
  clientGameRooms = gameRooms;
  let gameRoomsUi = document.getElementById("game-rooms");
  if (gameRoomsUi) gameRoomsUi.innerHTML = "";

  if (!clientPlayer.isInGame) {
    for (let room in clientGameRooms) {
      // make the buttons
      let joinButton = "",
        spectateButton = "";
      if (
        !clientPlayer.isInGame &&
        !clientGameRooms[room].players.challengerUid
      ) {
        joinButton = `<Button id="join-room-${clientGameRooms[room].roomNumber}" class='room-button dark-button'>JOIN</Button>`;
      }
      if (!clientPlayer.isInGame) {
        spectateButton = `<Button id="spectate-room-${clientGameRooms[room].roomNumber}" class='room-button green-button'>WATCH</Button>`;
      }

      let numberOfPlayersInRoom;
      if (clientGameRooms[room].players.challengerUid)
        numberOfPlayersInRoom = 2;
      else numberOfPlayersInRoom = 1;
      const newRoomHTML = `
        <tr class="game-room">
          <td class="room-number">ROOM ${clientGameRooms[room].roomNumber}</td>
          <td class="room-host">${clientGameRooms[
            room
          ].gameName.toUpperCase()}</td>
          <td class="room-players">${numberOfPlayersInRoom}/2</td>
          <td class="room-spectators">SPECTATORS 0</td>
          <td class="room-buttons-holder">
            ${joinButton}
            ${spectateButton}
          </td>
        </tr>`;
      document.getElementById("game-rooms").innerHTML += newRoomHTML;
    }
    for (let room in gameRooms) {
      let joinButton = document.getElementById(
        `join-room-${clientGameRooms[room].roomNumber}`
      );
      let spectateButton = document.getElementById(
        `spectate-room-${clientGameRooms[room].roomNumber}`
      );
      // add listeners to the buttons
      if (joinButton) {
        joinButton.addEventListener("click", e => {
          joinGame(clientGameRooms[room].roomNumber);
        });
      }
      if (spectateButton) {
        spectateButton.addEventListener("click", e => {
          console.log(
            "clicked to spectate room " + clientGameRooms[room].roomNumber
          );
        });
      }
    }
  }
}
