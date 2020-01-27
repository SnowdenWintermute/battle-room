// if (!gameUpdatePackets[roomNumber]) {
//   // make initial packets object for this room
//   console.log("initial packet made for room " + roomNumber);
//   gameUpdatePackets[roomNumber] = {
//     prevGameRoomState: {},
//     currPacket: {}
//   };
//   // set the previous and current packet to the gameRoom object
//   Object.keys(gameRoom).forEach(key => {
//     gameUpdatePackets[roomNumber].prevGameRoomState[key] = gameRoom[key];
//   });
// } else {
//   // check gameRoom object against prevPacket and only give currPacket what is different
//   gameUpdatePackets[roomNumber].currPacket = {};
//   Object.keys(gameRoom).forEach(key => {
//     //
//     if (key == "orbs") {
//       console.log(gameRoom.orbs.hostOrbs[0].xPos);
//       console.log(
//         gameUpdatePackets[roomNumber].prevGameRoomState[key].hostOrbs[0]
//           .xPos
//       );
//     }
//     //
//     if (
//       !_.isEqual(
//         gameRoom[key],
//         gameUpdatePackets[roomNumber].prevGameRoomState[key]
//       )
//     ) {
//       // console.log(gameRoom[key]);
//       gameUpdatePackets[roomNumber].currPacket[key] = gameRoom[key];
//     }
//     gameUpdatePackets[roomNumber].prevGameRoomState[key] = gameRoom[key];
//   });
// }
