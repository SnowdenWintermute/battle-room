function randomName() {
  let names = [
    "Orby Joe",
    "Bean",
    "Bun",
    "Zidane",
    "Aragorn",
    "Cloud",
    "Tidus",
    "Luke",
    "Hebrewhammer",
    "Samuel"
  ];
  const r = Math.round(Math.random() * (names.length - 1));
  return names[r];
}

module.exports = randomName;
