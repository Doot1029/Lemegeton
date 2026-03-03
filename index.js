const LORE = require("lorejs");
const { LemegetonNovel, registerLemegetonExtensions } = require("./lemegeton.js");
const fs = require("fs");
const path = require("path");

const game = new LORE.Game({
  prompt: "{{bold}}{{cyan}}LEMEGETON{{color_reset}} > ",
  typingSpeed: 20
});

async function start() {
  const saves = getSaves();
  const slots = Object.keys(saves);

  game.printLine("{{bold}}{{yellow}}--- GAME MENU ---{{font_reset}}");
  game.printLine("1. New Game");
  
  if (slots.length > 0) {
    slots.forEach((slot, index) => {
      const date = new Date(saves[slot].timestamp);
      game.printLine(`${index + 2}. Load Slot: ${slot} - ${date.toLocaleString()}`);
    });
  }

  game.rl.question("Select an option: ", async (answer) => {
    const choice = parseInt(answer);
    if (choice === 1) {
      await game.loadNovel(LemegetonNovel);
      await registerLemegetonExtensions(game);
      game.printLine(LemegetonNovel.introText);
    } else if (choice >= 2 && choice <= slots.length + 1) {
      const slot = slots[choice - 2];
      game.state.flags.loadingSave = true;
      await game.loadNovel(LemegetonNovel);
      await registerLemegetonExtensions(game);
      game.state.flags.loadingSave = false;
      game.loadGame(slot);
    } else {
      game.printLine("Invalid option.");
      start();
    }
  });
}

function getSaves() {
  const saves = {};
  const saveDir = path.join(__dirname, "node_modules", "lorejs", "saves");
  if (fs.existsSync(saveDir)) {
    const files = fs.readdirSync(saveDir);
    files.forEach(file => {
      if (file.startsWith("save_") && file.endsWith(".json")) {
        const slot = file.replace("save_", "").replace(".json", "");
        const savePath = path.join(saveDir, file);
        try {
          const saveData = JSON.parse(fs.readFileSync(savePath, "utf8"));
          saves[slot] = saveData;
        } catch (e) {}
      }
    });
  }
  return saves;
}

start();
