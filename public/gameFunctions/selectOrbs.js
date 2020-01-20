function selectOrbs(startX, startY, currX, currY) {
  console.log("selecting");
  let playerOrbsToSelect;
  if (clientPlayer.uid == currentClientGameRoom.players.hostUid)
    playerOrbsToSelect = "hostOrbs";
  else playerOrbsToSelect = "challengerOrbs";
  currentClientGameRoom.orbs[playerOrbsToSelect].forEach((orb, i) => {
    if (
      ((orb.xPos + orb.radius >= startX &&
        orb.xPos - orb.radius <= currX &&
        orb.yPos + orb.radius >= startY &&
        orb.yPos - orb.radius <= currY) ||
        (orb.xPos - orb.radius <= startX &&
          orb.xPos + orb.radius >= currX &&
          orb.yPos - orb.radius <= startY &&
          orb.yPos + orb.radius >= currY) ||
        (orb.xPos - orb.radius <= startX &&
          orb.xPos + orb.radius >= currX &&
          orb.yPos + orb.radius >= startY &&
          orb.yPos - orb.radius <= currY) ||
        (orb.xPos + orb.radius >= startX &&
          orb.xPos - orb.radius <= currX &&
          orb.yPos - orb.radius <= startY &&
          orb.yPos + orb.radius >= currY) ||
        (currX + orb.radius >= orb.xPos &&
          currX - orb.radius <= orb.xPos &&
          currY + orb.radius >= orb.yPos &&
          currY - orb.radius <= orb.yPos)) &&
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
