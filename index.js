const LORE = require("lorejs");
const novelData = require("./lemegeton.js");

// Create a new game instance
const game = new LORE.Game({
  disableTextAnimation: true
});

// Start the game
game.loadNovel(novelData);
