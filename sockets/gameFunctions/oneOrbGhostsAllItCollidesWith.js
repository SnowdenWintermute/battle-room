// for (let i = 0; i < 5; i++) {
//   let orb = gameRoom.orbs["hostOrbs"][i];
//   gameRoom.orbs["challengerOrbs"].forEach(orbToCheckCollisionWith => {
//     if (
//       Math.abs(orb.xPos - orbToCheckCollisionWith.xPos) <=
//         orb.radius + orbToCheckCollisionWith.radius &&
//       Math.abs(orb.yPos - orbToCheckCollisionWith.yPos) <=
//         orb.radius + orbToCheckCollisionWith.radius
//     ) {
//       if (!orb.isGhosting) {
//         orb.isGhosting = true;
//         orbToCheckCollisionWith.isGhosting = true;
//       }
//     }
//   });
//   // take turns
//   orb = gameRoom.orbs["challengerOrbs"][i];
//   gameRoom.orbs["hostOrbs"].forEach(orbToCheckCollisionWith => {
//     if (
//       Math.abs(orb.xPos - orbToCheckCollisionWith.xPos) <=
//         orb.radius + orbToCheckCollisionWith.radius &&
//       Math.abs(orb.yPos - orbToCheckCollisionWith.yPos) <=
//         orb.radius + orbToCheckCollisionWith.radius
//     ) {
//       if (!orb.isGhosting) {
//         orb.isGhosting = true;
//         orbToCheckCollisionWith.isGhosting = true;
//       }
//     }
//   });
// }
