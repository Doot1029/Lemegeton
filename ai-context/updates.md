# LoreJS Update Summary

## Version: 1.2.4

### Changes:
- **Default Talk Responses**: Added bespoke default `talk <character>` responses for every Clavicula character so each NPC now reacts even when no topic is specified.
- **Expanded Topic Coverage**: Gave each existing Clavicula character a broader mix of conversation topics covering characters, objects, locations, and concepts.
- **Random Topic Conversations**: Updated the talk system so `talk <character> about random` picks an available topic, prints a character-flavored intro line, and then delivers that topic's dialogue.

### Commit Message Ideas:
- `feat: add default talk dialogue for Clavicula characters`
- `feat: support random talk topics in LoreJS conversations`
- `lore: expand Clavicula NPC topics across characters objects and locations`

## Version: 1.2.3

### Changes:
- **Room Exit Summaries**: Added automatic exit summaries to every Clavicula room description so each location now tells players exactly which directions lead where.
- **Dynamic Destination Names**: Exit text is generated from the room graph itself, keeping descriptions aligned with room names without manually duplicating every destination.

### Commit Message Ideas:
- `feat: add exit summaries to Clavicula room descriptions`
- `refactor: generate Clavicula room exits from room metadata`
- `ux: show room destinations in Clavicula descriptions`

## Version: 1.2.2

### Changes:
- **Fixed MUD Command Registration**: Moved the `setupMUDCommands()` call to the beginning of the `startGame` process to ensure `join`, `public`, and `private` commands are registered immediately before the intro animation completes.
- **Robust Plugin Loading**: Updated `setupMUDCommands` to properly `await` the plugin registration and use `processInput` for command interception, resolving the issue where commands were reported as unknown.
- **Improved Command Interception**: Replaced the non-existent `game.interpret` override with a robust `game.processInput` wrapper to ensure all game actions are correctly broadcast to the MUD session.

### Commit Message Ideas:
- `fix: ensure MUD commands are registered before intro animation`
- `refactor: use processInput instead of interpret for command interception`
- `fix: await plugin loading in setupMUDCommands`

## Version: 1.2.1

### Changes:
- **Improved Connection Reliability**: Added a fallback mechanism for Socket.io to connect to `localhost:3000` even if the game is opened as a local file.
- **Enhanced Status Feedback**: Updated the connection status indicator to show "Connecting...", "Connected", and "Disconnected" states for better user feedback.
- **Robust Multiplayer Logic**: Added safety checks to ensure the game remains playable even if the multiplayer server is temporarily unavailable.

### Commit Message Ideas:
- `fix: add socket.io fallback for local file access`
- `ux: improve connection status feedback in info panel`
- `refactor: add safety checks for multiplayer socket emissions`

## Version: 1.2.0

### Changes:
- **MUD Multiplayer Implementation**: Replaced Discord Activity integration with a completely anonymous Multi-User Dungeon (MUD) mode using Socket.io.
- **Session Code System**: Every game session now generates a unique 6-character code (e.g., `YN6GEZ`) for both singleplayer and multiplayer.
- **Join Commands**: Added `join random` to enter any public MUD session and `join <code>` to join a specific session.
- **Privacy Toggling**: Implemented `public` and `private` commands to toggle session visibility.
- **Dual Autosave System**: New games now trigger two types of autosaves: "Local" and "MUD", clearly distinguished in the load menu.
- **Removed Discord Integration**: Uninstalled the Discord SDK and removed all Discord-specific logic to focus on the independent MUD experience.

### Commit Message Ideas:
- `feat: implement anonymous MUD multiplayer with session codes`
- `refactor: remove discord integration and move to socket.io MUD`
- `feat: add join random and session code commands`
- `feat: implement dual local/MUD autosave system`

## Version: 1.1.0

### Changes:
- **Kingdom of Clavicula Implementation**: Added a massive expansion with 50 unique rooms spanning 7 distinct regions (High Castle, Market, Library, Sewers, Cultist Society, Outskirts, and Forest).
- **Dark Fantasy Mechanics**: Implemented a personal Sanity system and a Sleep Paralysis mechanic where demons can attack or intimidate the player during rest.
- **Holy Protection System**: Added "Holy Salt" and other wards (via High Priest Valerius) to protect against nightly demon visitations.
- **Multiplayer Foundation**: Added the `follow` command for NPCs and prepared the structure for MUD-style Discord Activity integration.
- **Stepping Stone Lore**: Redefined demons as tools for cultists rather than deities, reflecting the cold, calculated nature of the Clavicula cult.
- **Expanded NPCs & Items**: Added King Solomonis, High Priest Valerius, and the Blind Beggar with complex conversation topics.

### Commit Message Ideas:
- `feat: implement 50 rooms for the Kingdom of Clavicula`
- `feat: add sleep paralysis and sanity mechanics`
- `feat: implement follow command and holy protection system`
- `lore: expand Clavicula world with 7 distinct regions and NPCs`

## Version: 1.0.6

### Changes:
- **Fixed Browser Compatibility**: Removed the failing `require("./clavicula.js")` in `lemegeton.js` that was preventing the script from loading in the web client.
- **Improved Test Reliability**: Increased the timeout in `playWright.js` to ensure the long intro narrative completes before screenshots are taken, providing better visual verification of game state.

### Commit Message Ideas:
- `fix: resolve browser crash caused by missing clavicula.js require`
- `test: increase playwright timeout for long intro text`
- `fix(web): ensure LemegetonNovel is correctly exposed to window`

## Version: 1.0.5

### Changes:
- **Global Typewriter Effect**: Applied the typewriter text animation effect to the rest of the game, including room descriptions, character dialogues, and command outputs.
- **Consistent Typing Speed**: Synchronized the `typingSpeed` between the Node.js and Browser versions of the game for a consistent experience.
- **Preserved Skip Functionality**: Ensured that the ability to skip text animations by pressing **Enter** remains active for all new animated segments.

### Commit Message Ideas:
- `feat: apply typewriter effect to all game text`
- `fix: synchronize typingSpeed across Node.js and Browser`
- `feat: ensure skip functionality works for all animated text`

## Version: 1.0.4

### Changes:
- **Improved Typewriter Skipping**: The typewriter effect now completes the current paragraph instantly instead of stopping mid-text when skipped.
- **Global Skip Input**: You can now skip text animations by pressing **Enter** or **Escape** at any time, even if the input field doesn't have focus.
- **Intro Narrative Skip**: Fixed an issue where the introduction narrative could not be skipped correctly in some scenarios.
- **UX Improvement**: The game input is now automatically focused when starting a new game or loading a save.

### Commit Message Ideas:
- `fix(lorejs): complete text animation instantly instead of stopping on skip`
- `feat(lorejs): add global keydown listener for skipping animations anywhere`
- `ux: automatically focus input field on game start`
- `fix: allow skipping of intro narrative via global skip listener`
