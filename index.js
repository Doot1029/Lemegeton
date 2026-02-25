const LORE = require("./node_modules/lorejs/lore.js");
const game = new LORE.Game();

// Load the game
game.loadNovel("./node_modules/lorejs/games/lemegeton.js").then(() => {
    // Game starts automatically in loadNovel
});
