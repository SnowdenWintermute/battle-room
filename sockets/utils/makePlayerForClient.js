function makePlayerForClient(serverSidePlayer) {
  let playerForClient = {};
  Object.keys(serverSidePlayer).forEach(key => {
    if (key !== "socketId") {
      playerForClient[key] = serverSidePlayer[key];
    }
  });
  return playerForClient;
}
module.exports = makePlayerForClient;
