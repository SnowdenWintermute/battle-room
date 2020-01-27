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
  console.log(gameRoom.roomNumber + "started");
  io.to(`game-${gameRoom.roomNumber}`).emit("serverInitsGame");
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
    const { roomNumber } = gameRoom;
    if (!gameUpdatePackets[roomNumber]) {
      // make initial packets object for this room
      console.log("initial packet made for room " + roomNumber);
      gameUpdatePackets[roomNumber] = {
        prevGameRoomState: {},
        currPacket: {}
      };
      // set the previous and current packet to the gameRoom object
      Object.keys(gameRoom).forEach(key => {
        gameUpdatePackets[roomNumber].prevGameRoomState[key] = gameRoom[key];
        gameUpdatePackets[roomNumber].currPacket[key] = gameRoom[key];
      });
      console.log(gameUpdatePackets[roomNumber].prevGameRoomState);
    } else {
      // check gameRoom object against prevPacket and only give currPacket what is different
      gameUpdatePackets[roomNumber].currPacket = {};
      Object.keys(gameRoom).forEach(key => {
        if (
          gameRoom[key] !== gameUpdatePackets[roomNumber].prevGameRoomState[key]
        ) {
          gameUpdatePackets[roomNumber].currPacket[key] = gameRoom[key];
        }
        gameUpdatePackets[roomNumber].prevGameRoomState[key] = gameRoom[key];
      });
    }
    io.to(`game-${roomNumber}`).emit(
      "tickFromServer",
      gameUpdatePackets[roomNumber].currPacket
    );
  }, 33);
  return serverGameTick;
}

module.exports = startGame;
