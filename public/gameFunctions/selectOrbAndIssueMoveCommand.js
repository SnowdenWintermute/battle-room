function selectOrbAndIssueMoveCommand(
  currentClientGameRoom,
  clientPlayer,
  keyPressed,
  mouseData
) {
  let playerOrbsToSelect;
  if (clientPlayer.uid == currentClientGameRoom.players.hostUid)
    playerOrbsToSelect = "hostOrbs";
  else playerOrbsToSelect = "challengerOrbs";
  currentClientGameRoom.orbs[playerOrbsToSelect].forEach(orb => {
    orb.isSelected = false;
    console.log("orb unselected " + orb.num);
  });
  if (
    currentClientGameRoom.orbs[playerOrbsToSelect][keyPressed - 1].owner ===
    clientPlayer.uid
  ) {
    currentClientGameRoom.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].isSelected = true;
    currentClientGameRoom.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.xPos = mouseData.xPos;
    currentClientGameRoom.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.yPos = mouseData.yPos;
  }
  socket.emit("clientSendsOrbSelections", {
    roomNumber: currentClientGameRoom.roomNumber,
    ownerOfOrbs: playerOrbsToSelect,
    orbsToBeUpdated: currentClientGameRoom.orbs[playerOrbsToSelect]
  });
  orbMoveCommand(
    (currentClientGameRoom.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.xPos = mouseData.xPos),
    (currentClientGameRoom.orbs[playerOrbsToSelect][
      keyPressed - 1
    ].heading.yPos = mouseData.yPos)
  );
}
