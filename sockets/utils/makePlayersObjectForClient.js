// makes player object without socket id for client to use
function makePlayersObjectForClient(connectedPlayers) {
  let playersObjectForClient = {};
  for (let connectedPlayer in connectedPlayers) {
    let playerForClient = {};
    Object.keys(connectedPlayers[connectedPlayer]).forEach(key => {
      if (key != "socketId")
        playerForClient[key] = connectedPlayers[connectedPlayer][key];
    });
    playersObjectForClient[
      connectedPlayers[connectedPlayer].uid
    ] = playerForClient;
  }
  return playersObjectForClient;
}
module.exports = makePlayersObjectForClient;
