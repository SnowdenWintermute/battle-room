function selectOrbs(startX, startY, currX, currY) {
  console.log("selecting");
  let playerOrbsToSelect;
  if (clientPlayer.uid == currentClientGameRoom.players.hostUid)
    playerOrbsToSelect = "hostOrbs";
  else playerOrbsToSelect = "challengerOrbs";
  currentClientGameRoom.orbs[playerOrbsToSelect].forEach((orb, i) => {
    if (
      ((orb.xPos >= startX &&
        orb.xPos <= currX &&
        orb.yPos >= startY &&
        orb.yPos <= currY) ||
        (orb.xPos <= startX &&
          orb.xPos >= currX &&
          orb.yPos <= startY &&
          orb.yPos >= currY) ||
        (orb.xPos <= startX &&
          orb.xPos >= currX &&
          orb.yPos >= startY &&
          orb.yPos <= currY) ||
        (orb.xPos >= startX &&
          orb.xPos <= currX &&
          orb.yPos <= startY &&
          orb.yPos >= currY)) &&
      orb.owner === clientPlayer.uid
    ) {
      orb.isSelected = true;
    } else {
      orb.isSelected = false;
    }
  });
  socket.emit("clientSendsOrbSelections", {
    roomNumber: currentClientGameRoom.roomNumber,
    ownerOfOrbs: playerOrbsToSelect,
    orbsToBeUpdated: currentClientGameRoom.orbs[playerOrbsToSelect]
  });
}
