function randomName() {
  let names = [
    "Orby Joe",
    "Bean",
    "Bun",
    "Zidane",
    "Aragorn",
    "Cloud",
    "Tidus",
    "Luke"
  ];
  return names[Math.round(Math.random() * names.length - 1)];
}

module.exports = randomName;
