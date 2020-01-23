function orbMoveCommand(headingX, headingY) {
  let hostOrChallenger;
  if (currentClientGameRoom.players.hostUid == clientPlayer.uid)
    hostOrChallenger = "hostOrbs";
  if (currentClientGameRoom.players.challengerUid == clientPlayer.uid)
    hostOrChallenger = "challengerOrbs";
  currentClientGameRoom.orbs[hostOrChallenger].forEach(orb => {
    if (orb.isSelected) {
      orb.heading.xPos = headingX;
      orb.heading.yPos = headingY;
    }
  });

  const dataForServer = {
    orbsClientWantsToMove: currentClientGameRoom.orbs[hostOrChallenger],
    gameRoomNumber: currentClientGameRoom.roomNumber
  };
  socket.emit("clientSubmitsMoveCommand", dataForServer);
}
