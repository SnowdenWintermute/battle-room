function updateClientCurrentGameRoom(currentGameRoom) {
  let currentGameUi = document.getElementById("current-game");
  let lobby = document.getElementById("lobby");
  let htmlCanvas = document.getElementById("the-canvas");
  if (!menuOpen) {
    lobby.setAttribute("style", "display:none");
    htmlCanvas.setAttribute("style", "display: block");
  } else {
    htmlCanvas.setAttribute("style", "display: none");
    lobby.setAttribute("style", "display:block");
    // if not in game, give new game button
    if (currentGameUi) {
      if (!clientPlayer.isInGame) {
        currentGameUi.innerHTML = `<button id="host-game-button" class='room-button green-button'>NEW GAME</button>`;
        document
          .getElementById("host-game-button")
          .addEventListener("click", e => {
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
          currentRoomChallengerName =
            clientPlayersObject[currentGameRoom.players.challengerUid].name;
        }
        if (!currentRoomChallengerName) currentRoomChallengerName = "";

        // show ready button and status
        let readyButton = `<button class="unclickable-button room-button green-button">Ready</button>`;
        let readyButtonIsClickable;
        let hostReadyStatus = "<div>not ready</div>";
        let challengerReadyStatus = "<div>not ready</div>";
        if (
          !currentGameRoom.playersReady.includes(clientPlayer.uid) &&
          currentGameRoom.players.challengerUid
        ) {
          readyButton = `<button id="ready-button" class="room-button green-button">Ready</button>`;
          readyButtonIsClickable = true;
        }
        if (currentGameRoom.playersReady.includes(clientPlayer.uid)) {
          readyButton = `<button id="ready-button" class="room-button green-button">Cancel Ready</button>`;
          readyButtonIsClickable = true;
        }

        if (
          currentGameRoom.playersReady.includes(currentGameRoom.players.hostUid)
        ) {
          hostReadyStatus = "<div>ready</div>";
        }
        if (
          currentGameRoom.playersReady.includes(
            currentGameRoom.players.challengerUid
          )
        ) {
          challengerReadyStatus = "<div>ready</div>";
        }

        currentGameUi.innerHTML += `
          <div id="current-game-lobby-room">
            <div id="current-game-room-number">Room ${currentGameRoom.roomNumber}</div>
            <div id="current-game-host">Host: ${currentRoomHostName} ${hostReadyStatus}</div>
            <div id="current-game-challenger">Challenger: ${currentRoomChallengerName} ${challengerReadyStatus}</div>
            <div id="ready-button-holder">${readyButton}</div>
            <div id="">${currentGameRoom.gameStatus}</div>
            <div id="">${currentGameRoom.countdown}</div>
          </div>`;

        // events have to go at bottom (below any +=)
        document.getElementById(`leave-room`).addEventListener("click", e => {
          leaveGame();
        });
        if (readyButtonIsClickable) {
          document
            .getElementById(`ready-button`)
            .addEventListener("click", e => {
              clientPlayerClicksReady(currentGameRoom);
            });
        }
      }
    }
  }
}
