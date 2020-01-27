function selectOrbs(startX, startY, currX, currY) {
  let playerOrbsToSelect;
  let stackedOrbHighestIndex;
  if (clientPlayer.uid == currentClientGameRoom.players.hostUid)
    playerOrbsToSelect = "hostOrbs";
  else playerOrbsToSelect = "challengerOrbs";
  currentClientGameRoom.orbs[playerOrbsToSelect].forEach((orb, i) => {
    if (
      // clicking directly on, select only highest index stacked orb
      currX + orb.radius >= orb.xPos &&
      currX - orb.radius <= orb.xPos &&
      currY + orb.radius >= orb.yPos &&
      currY - orb.radius <= orb.yPos &&
      // not drawing a small ass box with the end corner on the stack of orbs
      Math.abs(currX - startX) < 3 &&
      Math.abs(currY - startY) < 3 &&
      orb.owner === clientPlayer.uid
    ) {
      if (!stackedOrbHighestIndex) {
        stackedOrbHighestIndex = orb.num;
        orb.isSelected = true;
      } else if (orb.num > stackedOrbHighestIndex) {
        currentClientGameRoom.orbs[playerOrbsToSelect].forEach(orb => {
          orb.isSelected = false;
          console.log("orb unselected " + orb.num);
        });
        stackedOrbHighestIndex = orb.num;
        orb.isSelected = true;
      }
    } else if (
      // drawing box
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
          orb.yPos + orb.radius >= currY)) &&
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
