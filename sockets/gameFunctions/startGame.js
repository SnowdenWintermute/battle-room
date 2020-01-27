const _ = require("lodash");

const Orb = require("../classes/Orb");

const moveOrbs = require("./moveOrbs");
const handleOrbCollisions = require("./handleOrbCollisions");
const handleScoringPoints = require("./handleScoringPoints");

function startGame(
  io,
  gameRooms,
  gameRoom,
  connectedPlayers,
  socket,
  gameRoomTicks,
  gameEndingTicks,
  gameUpdatePackets
) {
  const { roomNumber } = gameRoom;
  console.log(roomNumber + "started");
  io.to(`game-${roomNumber}`).emit("serverInitsGame");
  for (let i = 0; i < 5; i++) {
    let startingX = (i + 1) * 50 + 75;
    gameRoom.orbs.hostOrbs.push(
      new Orb(
        startingX,
        100,
        gameRoom.orbRadius,
        gameRoom.players.hostUid,
        i + 1,
        "0, 153, 0"
      )
    );
    gameRoom.orbs.challengerOrbs.push(
      new Orb(
        startingX,
        600,
        gameRoom.orbRadius,
        gameRoom.players.challengerUid,
        i + 1,
        "89, 0, 179"
      )
    );
  }
  gameUpdatePackets[roomNumber] = {};
  gameUpdatePackets[roomNumber] = _.cloneDeep(gameRoom);
  io.to(`game-${roomNumber}`).emit("tickFromServer", gameRoom);
  let serverGameTick = setInterval(() => {
    moveOrbs(gameRoom);
    handleOrbCollisions(gameRoom);
    handleScoringPoints(
      io,
      gameRooms,
      gameRoom,
      connectedPlayers,
      socket,
      gameRoomTicks,
      gameEndingTicks
    );
    let newPacket = {};
    Object.keys(gameUpdatePackets[roomNumber]).forEach(key => {
      if (!_.isEqual(gameUpdatePackets[roomNumber][key], gameRoom[key])) {
        if (
          typeof gameRoom[key] === "object" ||
          typeof gameRoom[key] === "array"
        ) {
          newPacket[key] = _.cloneDeep(gameRoom[key]);
          gameUpdatePackets[roomNumber][key] = _.cloneDeep(gameRoom[key]);
        } else {
          newPacket[key] = gameRoom[key];
          gameUpdatePackets[roomNumber][key] = gameRoom[key];
        }
      }
    });
    io.to(`game-${roomNumber}`).emit("tickFromServer", newPacket);
  }, 33);
  return serverGameTick;
}

module.exports = startGame;
