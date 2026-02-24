# LoreJS Text Engine Documentation Introduction
LoreJS is a powerful, cross-platform text adventure engine that works in both browser and Node.js environments. It provides a complete framework for creating interactive fiction games with rich formatting, character interactions, inventory systems, and more.

Play Demo LoreJS is under active development. Features and APIs may change between versions. Always check the GitHub repository for the latest documentation and release notes.

## Quick Start Installation

Include LoreJS in your project:

```
<script src="lore.js"></script>
<script>
    const game = new LORE.Game();
</script>
```
```
// Node.js
const LORE = require('./lore.js');
const game = new LORE.Game();
```
Basic Usage
```
// Create a game instance
const game = new LORE.Game({
    prompt: "> ",
    typingSpeed: 30,
    autosave: true
});
    
// Load a novel/game
game.loadNovel({
    title: "My Adventure",
    startRoom: "room1",
    rooms: [
        {
            id: "room1",
            name: "Starting Room",
            description: "You are in a small room.",
            exits: { north: "room2" }
        }
    ]
});
    
// Start the game
game.start();
```

Core Concepts Game Structure
LoreJS games are built around several key components:

Rooms: Locations the player can navigate betweenItems: Objects that can be taken, used, or examinedCharacters: NPCs with dialog and interaction capabilitiesCommands: Player actions like 'look', 'take', 'use'Events: Conditional triggers for game progression State Management
The engine maintains comprehensive game state:

```
game.state = {
    currentRoom: "room1",      // Current location
    inventory: ["item1"],      // Player's items
    flags: {},                 // Game progression flags
    variables: {},             // Dynamic variables
    history: [],               // Command history
    gameTime: 0                // Game time counter
};
```

## Configuration Options 
### Game Configuration

Option: prompt / Type: string / Default: ">" / Description: Command prompt display

Option: typingSpeed / Type: number / Default: 30 / Description: Text animation speed (ms)

Option: autosave / Type: boolean / Default: false / Description: Auto-save on commands

Option: debug / Type: boolean / Default: false / Description: Enable debug output

Option: clearScreenOnNovelLoad / Type: boolean / Default: true / Description: Clear screen on game load

Option: disableTextAnimation / Type: boolean / Default: false / Description: Disable typing animation

### Theme Configuration
```
const theme = {
    "--lore-bg-color": "#000000",
    "--lore-text-color": "#ffffff", 
    "--lore-prompt-color": "#00ff00",
    "--lore-input-color": "#ffffff",
    "--lore-font-family": "monospace",
    "--lore-font-size": "16px"
};
    
game.loadTheme(theme);
```

## World Building
### Creating Rooms

```
game.addRoom({
    id: "forest",
    name: "{{bold}}{{green}}Mysterious Forest{{font_reset}}",
    description: "You are in a dense forest. Paths lead north and east.",
    exits: {
        north: "clearing",
        east: "river"
    },
    items: ["torch", "key"],
    characters: ["old_man"],
    onEnter: (state, engine) => {
        if (!state.flags.visitedForest) {
            engine.printLine("Birds chirp in the trees above.");
            state.flags.visitedForest = true;
        }
    }
});
```

### Adding Items

```
game.addItem({
    id: "torch",
    name: "{{yellow}}Wooden Torch{{color_reset}}",
    aliases: ["light", "flare"],
    takeable: true,
    description: "A sturdy wooden torch that could provide light.",
    use: (state, engine) => {
        engine.printLine("The torch flickers to life, casting warm light.");
        return true;
    },
    look: (state, engine) => {
        engine.printLine("The torch is made of aged wood and cloth.");
    }
});
```

(Items without takeable: true cannot be picked up but can still be used in their location.)

### Creating Characters

```
game.addCharacter({
    id: "old_man",
    name: "{{gray}}Old Man{{font_reset}}",
    aliases: ["man", "elder"],
    genre: "male",
    description: "An elderly man with a long beard.",
    talk: (state, engine) => {
        engine.printLine("Old Man: 'The forest holds many secrets, traveler.'");
    },
    topics: {
        forest: {
            aliases: ["woods", "trees"],
            dialog: (state, engine) => {
                engine.printLine("Old Man: 'Beware the whispering trees after dark.'");
            }
        }
    },
    onSay: (text, state, engine) => {
        if (text.toLowerCase().includes("help")) {
            engine.printLine("Old Man: 'I can tell you about the forest if you ask.'");
        }
    }
});
```

## Text Formatting System
### Formatting Tags
LoreJS supports rich text formatting using double-brace syntax:

Tag: {{color}}, Description: Set text color Example: {{red}}Red text{{color_reset}}

Tag: {{bold}} Description: Bold text Example: {{bold}}Bold Text{{font_reset}}

Tag: {{italic}} Description: Italic text Example: {{italic}}Italic text{{font_reset}}

Tag: {{underline}} Description: Underlined text Example: {{underline}}Underlined text{{font_reset}}

Tag: {{newline}} Description: Line break Example: Line1{{newline}}Line2

Tag: {{tabulator}} Description: Tab space Example: {{tabulator}}Indented

Tag: {{instant}} Description: Skip animation Example: {{instant}}Fast text{{/instant}}

### Available Colors

* {{red}}red{{color_reset}}
* {{green}}green{{color_reset}}
* {{blue}}blue{{color_reset}}
* {{yellow}}yellow{{color_reset}}
* {{magenta}}magenta{{color_reset}}
* {{cyan}}cyan{{color_reset}}
* {{white}}white{{color_reset}}
* {{black}}black{{color_reset}}

## Command System
### Built-in Commands

Command: help / Aliases: h, ? / Purpose: Show available commands

Command: look / Aliases: l, see, examine / Purpose: Look around or examine items

Command: go / Aliases: n, s, e, w or [direction] / Purpose: Move between rooms

Command: take / Aliases: none / Purpose: Pick up items

Command: drop / Aliases: none / Purpose: Drop inventory items

Command: inventory / Aliases: i / Purpose: Show carried items

Command: use / Aliases: none / Purpose: Use items or environmental objects

Command: say / Aliases: none / Purpose: Speak (characters may react)

Command: talk / Aliases: none / Purpose: Talk to characters with topics

Command: save / Aliases: none / Purpose: Save game progress

Command: load / Aliases: none / Purpose: Load saved game

Command: restart / Aliases: none / Purpose: Restart the game

Command: quit / Aliases: exit / Purpose: Exit the game

### Movement Shortcuts

* north, south, east, west (n, s, e, w)
* northeast, northwest (ne, nw)
* southeast, southwest (se, sw)
* up, down, in, out (u, d, i, o)

### Custom Commands

```
game.registerCommand({
    name: "dance",
    aliases: ["boogie"],
    help: "Perform a dance",
    purpose: "express yourself through movement", 
    weight: 50,
    fn: (args, engine) => {
        engine.printLine("You dance joyfully!");
        return true;
    }
});
```

## Advanced Features
### Room Locking System

```
// Lock a room with a condition
game.lockRoom("treasure_room", 
    (state) => state.inventory.includes("gold_key"),
    "The door is locked. You need a golden key."
);
    
// Unlock dynamically
game.unlockRoom("treasure_room");
Copy Event System
game.addEvent({
    id: "sunset",
    condition: (state) => state.gameTime > 100,
    trigger: (state, engine) => {
        engine.printLine("The sun begins to set...");
        // Game state changes
    }
});
```

### Plugin System

```
const myPlugin = {
    id: "magic-system",
    name: "Magic System",
    commands: [
        {
            name: "cast",
            help: "Cast a spell",
            fn: (args, engine) => { /* spell logic */ }
        }
    ],
    items: [/* magical items */],
    init: (engine) => {
        engine.printLine("Magic system loaded!");
    }
};
    
game.loadPlugin(myPlugin);
```

## Input & Interaction
### Tab Completion
LoreJS provides intelligent tab completion for:

* Available commands and aliases
* Room exits and directions
* Items in current room and inventory
* Characters in current room
* Topics when using 'talk about'
* Save slots for save/load commands

### Character Interactions

```
// Basic conversation
talk old_man
    
// Topic-based conversation  
talk old_man about forest
    
// Genre pronouns (when only one character present)
talk him about secrets
talk her about future
```

## Save System
### Manual Saving/Loading

```
// Save to specific slot
game.saveGame("slot1");
    
// Load from slot
game.loadGame("slot1");
    
// List all saves
game.listSaves();
    
// Delete save
game.deleteSave("slot1");
```

### Auto-save
Enable automatic saving after each command:

```
const game = new LORE.Game({
    autosave: true  // Saves to 'autosave' slot
});
```

## Novel Structure
### Complete Game Example

```
module.exports = {
    title: "The Great Adventure",
    startRoom: "start",
    rooms: [
        {
            id: "start", 
            name: "Starting Point",
            description: "You stand at a crossroads.",
            exits: { north: "forest", east: "village" },
            items: ["map"],
            tutorial: ["look", "go"]
        }
    ],
    items: [
        {
            id: "map",
            name: "Old Map",
            takeable: true,
            description: "A faded map of the region.",
            use: (state, engine) => {
                engine.printLine("The map shows hidden paths...");
            }
        }
    ],
    characters: [
        {
            id: "guide",
            name: "Mysterious Guide", 
            talk: (state, engine) => {
                engine.printLine("Guide: 'Choose your path wisely.'");
            }
        }
    ],
    events: [
        {
            id: "victory",
            condition: (state) => state.flags.foundTreasure,
            trigger: (state, engine) => {
                engine.printLine("Congratulations! You won!");
            }
        }
    ]
};
```

## API Reference
### Core Methods

Method: print / Parameters: {text, instant} / Description: Output text with animation

Method: printLine / Parameters: {text, instant} / Description: Output text with newline

Method: clearScreen / Parameters: () / Description: Clear the terminal aka output

Method: move / Parameters: (direction) / Description: Move player to connected room

Method: look / Parameters: (silent) / Description: Describe current room

Method: takeItem / Parameters: (itemId) / Description: Add item to inventory

Method: useItem / Parameters: (itemId, targetId) / Description: Use item on target

Method: enterRoom / Parameters: (roomId) / Description: Move to specified room

### Utility Methods

Method: lockRoom / Description: Lock room with condition
Method: unlockRoom / Description: Remove room lock
Method: isRoomLocked / Description: Check if room is accessible
Method: registerCommand / Description: Add custom command
Method: loadNovel / Description: Load game data
Method: loadTheme / Description: Apply visual theme
Method: loadPlugin / Description: Load extension

## Browser vs Node.js
### Environment Detection

LoreJS automatically detects and adapts to its environment:

```
if (Utils.isBrowser) {
    // Browser-specific setup
} else if (Utils.isNode) {
    // Node.js-specific setup  
}
```

### Key Differences

* Browser: Uses DOM elements, CSS styling, event listeners
* Node.js: Uses readline, file system, process.stdout
* Both: Identical game logic and API 

## Best Practices
### Game Design Tips

* Use descriptive room names and detailed descriptions to create immersion.
* Test room connections thoroughly to avoid dead ends or circular references.
* Always provide clear feedback for player actions - silent failures frustrate users.

### Performance Considerations

* Use typingSpeed: 0 for instant text in action-heavy sequences
* Limit animation frames for complex ASCII art
* Use state.flags to track progression instead of complex conditions
* Preload large novels or split into modules

We don't just tell stories; we build worlds where stories can happen. The player becomes the author of their own experience.