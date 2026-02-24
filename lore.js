/**
* Copyright 2025 RetoraDev
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else {
    global.LORE = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  // ANSI color codes and style constants for Node.js
  const ANSI_COLORS = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    reset: "\x1b[0m"
  };
  const ANSI_STYLES = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    thick: "\x1b[1m",
    strong: "\x1b[1m",
    b: "\x1b[1m",
    italic: "\x1b[3m",
    cursive: "\x1b[3m",
    i: "\x1b[3m",
    underline: "\x1b[4m",
    u: "\x1b[4m",
    blink: "\x1b[5m",
    inverse: "\x1b[7m",
    hidden: "\x1b[8m"
  };

  // Constants
  const VERSION = "1.0.3";
  const STORAGE_KEY = "lore_save_data";
  const DEFAULT_PROMPT = "> ";
  const DEFAULT_THEME = {
    "--lore-bg-color": "#000000",
    "--lore-text-color": "#ffffff",
    "--lore-prompt-color": "#00ff00",
    "--lore-input-color": "#ffffff",
    "--lore-font-family": "monospace",
    "--lore-font-size": "16px",
    "--lore-border-color": "#333333"
  };
  const DEFAULT_CONFIG = {
    prompt: DEFAULT_PROMPT,
    autosave: false,
    typingSpeed: 30,
    debug: false,
    clearScreenOnNovelLoad: true,
    disableTextAnimation: false
  };

  // Utility functions
  const Utils = {
    isBrowser: typeof window !== "undefined" && typeof document !== "undefined",
    isNode: typeof process !== "undefined" && process.versions && process.versions.node,
    deepClone(obj) {
      return { ...obj };
    },
    uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    colorNameToHex(color) {
      const colors = {
        black: "#000000",
        red: "#ff0000",
        green: "#00ff00",
        yellow: "#ffff00",
        blue: "#0000ff",
        magenta: "#ff00ff",
        cyan: "#00ffff",
        white: "#ffffff"
      };
      return colors[color.toLowerCase()] || color;
    },
    isValidColor(color) {
      if (!color) return false;
      // Check if it's a named color
      const namedColors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
      if (namedColors.includes(color.toLowerCase())) return true;
      // Check if it's a hex color
      return /^#?([0-9A-F]{3}){1,2}$/i.test(color);
    },
    isURL(value) {
      return value.startsWith("file://") || value.startsWith("./") || value.startsWith("../") || value.startsWith("http://") || value.startsWith("https://");
    },
    deserializeFunction(func) {
      if (typeof func === "string") {
        return new Function(`const state = arguments[0]; const engine = arguments[1]; ${func}`);
      } else {
        return func;
      }
    },
    arraysEqual(a, b) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    },
    async loadModule(url) {
      try {
        const response = await fetch(url);
        const content = await response.text();
        if (!response.ok) {
          console.error("File at", url, "not found!");
          return {};
        }
        const module = new Function(`
            const module = {
              exports: {}
            };
            try {
              ${content}
            } catch(error) {
              return module;
              throw error;
            }
            return module;
          `)();
        return module.exports;
      } catch (error) {
        console.error("Error loading module from ", url, error);
        return {};
      }
    }
  };

  // Core Engine Class
  // @allow node
  class Game {
    constructor(options = {}) {
      this.state = {
        currentRoom: null,
        inventory: [],
        flags: {},
        variables: {},
        history: [],
        gameTime: 0
      };
      this.config = {
        ...DEFAULT_CONFIG,
        ...options
      };
      this.world = {
        rooms: new Map(),
        items: new Map(),
        characters: new Map(),
        events: new Map(),
        commands: new Map(),
        aliases: new Map(),
        keybindings: new Map()
      };
      this.plugins = new Map();
      this.theme = { ...DEFAULT_THEME };
      this.historyIndex = -1;
      this.queueIsRunning = false;
      this.isRunning = false;
      this.outputQueue = [];
      this.outputBuffer = [];
      this.animationFrames = new Map();
      this.animationIntervals = new Map();
      // Completion state
      this._completionState = null;
      this._nodeCompletionState = null;
      // Formatting state
      this.formattingState = {
        color: null,
        bold: false,
        italic: false,
        underline: false
      };
      // Animation state
      this.animationState = {
        isAnimating: false,
        currentAnimation: null
      };
      // Initialize based on environment
      if (Utils.isBrowser) {
        this.initBrowser();
      } else if (Utils.isNode) {
        this.initNode();
      }
      // Register default commands
      this.registerDefaultCommands();
    }
    // Environment initialization
    initBrowser() {
      this.env = "browser";
      // Find existing terminal or create one
      this.terminalElement = this.config.container ? document.querySelector(this.config.container) : document.querySelector(".lore-terminal");
      const isNewTerminal = !this.terminalElement;
      
      if (isNewTerminal) {
        this.terminalElement = document.createElement("div");
        this.terminalElement.className = "lore-terminal";
        this.terminalElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${this.theme["--lore-bg-color"]};
            color: ${this.theme["--lore-text-color"]};
            font-family: ${this.theme["--lore-font-family"]};
            font-size: ${this.theme["--lore-font-size"]};
            overflow: auto;
            padding: 20px;
            box-sizing: border-box;
          `;
      }

      this.outputElement = document.createElement("div");
      this.outputElement.className = "lore-output";
      if (isNewTerminal) {
        this.outputElement.style.cssText = `
            height: calc(100% - 60px);
            overflow-y: auto;
            margin-bottom: 20px;
            white-space: pre-wrap;
          `;
      } else {
        // Clear if reusing
        this.terminalElement.innerHTML = '';
      }
      this.inputContainer = document.createElement("div");
      this.inputContainer.className = "lore-input-container";
      if (isNewTerminal) {
        this.inputContainer.style.cssText = `
            display: flex;
            align-items: center;
            background: transparent;
          `;
      }
      this.promptElement = document.createElement("span");
      this.promptElement.className = "lore-prompt";
      this.promptElement.innerHTML = this.parseFormatting(this.config.prompt);
      this.inputElement = document.createElement("input");
      this.inputElement.className = "lore-input";
      this.inputElement.type = "text";
      if (isNewTerminal) {
        this.inputElement.style.cssText = `
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: ${this.theme["--lore-input-color"]};
            font-family: ${this.theme["--lore-font-family"]};
            font-size: ${this.theme["--lore-font-size"]};
            margin-left: 5px;
          `;
      }
      // Assemble terminal
      this.inputContainer.appendChild(this.promptElement);
      this.inputContainer.appendChild(this.inputElement);
      this.terminalElement.appendChild(this.outputElement);
      this.terminalElement.appendChild(this.inputContainer);
      
      // Add to document ONLY if new
      if (isNewTerminal) {
        document.body.appendChild(this.terminalElement);
        document.body.style.margin = "0";
        document.body.style.padding = "0";
      }
      // Set up event listeners
      this.setupBrowserEvents();
    }
    initNode() {
      this.env = "node";
      this.readline = require("readline");
      this.fs = require("fs");
      this.path = require("path");
      this.rl = this.readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: this.parseFormatting(this.config.prompt)
      });
      this.setupNodeEvents();
    }
    // Event setup
    setupBrowserEvents() {
        this.inputElement.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            if (!this.animationState.isAnimating) {
              this.processInput(this.inputElement.value);
              this.inputElement.value = '';
              e.preventDefault();
            } else {
              this.skipAnimation();
              e.preventDefault();
            }
          } else if (e.key === 'ArrowUp') {
            this.navigateHistory(-1);
            e.preventDefault();
          } else if (e.key === 'ArrowDown') {
            this.navigateHistory(1);
            e.preventDefault();
          } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
            this.autoComplete();
            e.preventDefault();
          } else if (e.key === 'Escape' && this.animationState.isAnimating) {
            this.skipAnimation();
            e.preventDefault();
          }
        });
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
          this.outputElement.scrollTop = this.outputElement.scrollHeight;
        }, 250));
        // Focus input on terminal click
        this.terminalElement.addEventListener('click', () => {
          this.inputElement.focus();
        });
        this.inputElement.addEventListener('dblclick', e => {
          this.autoComplete();
          e.preventDefault();
        });
      }
    setupNodeEvents() {
      this.rl.on('line', (input) => {
        if (this.animationState.isAnimating) {
          this.skipAnimation();
          this.rl.prompt();
        } else {
          this.processInput(input);
          this.rl.prompt();
        }
      }).on('close', () => {
        process.exit(0);
      });
      // Handle Tab key specifically for Node.js
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.on('data', (data) => {
          // Check if it's a Tab key (ASCII 9)
          if (data.length === 1 && data[0] === 9) { // Tab key
            // Get current line from readline
            const line = this.rl.line;
            // Use our completer
            const [completions, completed] = this.readlineCompleter(line);
            if (completions.length > 0 && completed !== line) {
              // Update the readline with the completed line
              this.rl.line = completed;
              this.rl.cursor = completed.length;
              this.rl._refreshLine();
            }
            return; // Prevent default behavior
          }
          // Check for Ctrl+C (SIGINT)
          if (data.length === 1 && data[0] === 3) {
            this.rl.emit('SIGINT');
            return;
          }
        });
      }
      // Set up tab completion for Node
      this.rl.on('SIGINT', () => {
        if (this.animationState.isAnimating) {
          this.skipAnimation();
          this.rl.prompt();
        } else {
          this.rl.question('Are you sure you want to exit? (y/n) ', (answer) => {
            if (answer.match(/^y(es)?$/i)) {
              this.rl.close();
            } else {
              this.rl.prompt();
            }
          });
        }
      });
    }
    // Formatting parser
    parseFormatting(text) {
      if (this.env === 'browser') {
        return this.parseFormattingBrowser(text);
      } else {
        return this.parseFormattingNode(text);
      }
    }
    parseFormattingBrowser(text) {
      const formatRegex = /\{\{([^}]+)\}\}/g;
      let lastIndex = 0;
      let result = '';
      let match;
      // Reset formatting state
      this.formattingState = {
        color: null,
        bold: false,
        italic: false,
        underline: false
      };
      while ((match = formatRegex.exec(text)) !== null) {
        // Add text before the formatting tag
        result += text.substring(lastIndex, match.index);
        lastIndex = match.index + match[0].length;
        // Process the formatting tag
        const tag = match[1].trim().toLowerCase();
        result += this.processSingleTag(tag);
      }
      // Add the remaining text
      result += text.substring(lastIndex);
      // Close any open formatting tags
      if (this.formattingState.underline) result += '</span>';
      if (this.formattingState.italic) result += '</em>';
      if (this.formattingState.bold) result += '</strong>';
      if (this.formattingState.color) result += '</span>';
      return result;
    }
    parseFormattingNode(text) {
      const formatRegex = /\{\{([^}]+)\}\}/g;
      let lastIndex = 0;
      let result = '';
      let match;
      // Reset formatting state
      this.formattingState = {
        color: null,
        bold: false,
        italic: false,
        underline: false
      };
      while ((match = formatRegex.exec(text)) !== null) {
        // Add text before the formatting tag
        result += text.substring(lastIndex, match.index);
        lastIndex = match.index + match[0].length;
        // Process the formatting tag
        const tag = match[1].trim().toLowerCase();
        result += this.processSingleTag(tag);
      }
      // Add the remaining text
      result += text.substring(lastIndex);
      // Reset formatting at the end
      if (this.formattingState.color || this.formattingState.bold ||
        this.formattingState.italic || this.formattingState.underline) {
        result += ANSI_STYLES.reset;
      }
      return result;
    }
    processSingleTag(tag) {
      let result = '';
      if (this.env === 'browser') {
        if (tag === 'font_reset' || tag === 'fr') {
          result += '</span>';
          this.formattingState = {
            color: null,
            bold: false,
            italic: false,
            underline: false
          };
        } else if (tag === 'color_reset') {
          if (this.formattingState.color) {
            result += '</span>';
            this.formattingState.color = null;
          }
        } else if (Utils.isValidColor(tag)) {
          // Close previous color span if exists
          if (this.formattingState.color) {
            result += '</span>';
          }
          const color = Utils.colorNameToHex(tag.replace('#', ''));
          result += `<span style="color: ${color}">`;
          this.formattingState.color = color;
        } else if (tag === 'bold' || tag === 'thick' || tag === 'strong' || tag === 'b') {
          if (!this.formattingState.bold) {
            result += '<span style="font-weight: bold">';
            this.formattingState.bold = true;
          }
        } else if (tag === 'italic' || tag === 'cursive' || tag === 'i') {
          if (!this.formattingState.italic) {
            result += '<span style="font-style: italic">';
            this.formattingState.italic = true;
          }
        } else if (tag === 'underline' || tag === 'u') {
          if (!this.formattingState.underline) {
            result += '<span style="text-decoration: underline">';
            this.formattingState.underline = true;
          }
        }
      } else {
        if (tag === 'font_reset' || tag === 'fr') {
          result += ANSI_STYLES.reset;
          this.formattingState = {
            color: null,
            bold: false,
            italic: false,
            underline: false
          };
        } else if (tag === 'color_reset') {
          if (this.formattingState.color) {
            result += ANSI_STYLES.reset;
            this.formattingState.color = null;
            // Re-apply other styles if necessary
            if (this.formattingState.bold) result += ANSI_STYLES.bold;
            if (this.formattingState.italic) result += ANSI_STYLES.italic;
            if (this.formattingState.underline) result += ANSI_STYLES.underline;
          }
        } else if (Utils.isValidColor(tag)) {
          const colorName = tag.replace('#', '').toLowerCase();
          if (ANSI_COLORS[colorName]) {
            result += ANSI_COLORS[colorName];
            this.formattingState.color = colorName;
          }
        } else if (tag === 'bold' || tag === 'thick' || tag === 'strong' || tag === 'b') {
          result += ANSI_STYLES.bold;
          this.formattingState.bold = true;
        } else if (tag === 'italic' || tag === 'cursive' || tag === 'i') {
          result += ANSI_STYLES.italic;
          this.formattingState.italic = true;
        } else if (tag === 'underline' || tag === 'u') {
          result += ANSI_STYLES.underline;
          this.formattingState.underline = true;
        }
      }
      return result;
    }
    
    // Commands registration
    registerDefaultCommands() {
      this.registerCommand('help', {
        description: 'Show available commands',
        execute: () => {
          this.printLine('{{bold}}{{yellow}}Available Commands:{{font_reset}}');
          this.world.commands.forEach((cmd, name) => {
            this.printLine(`  {{cyan}}${name.padEnd(12)}{{color_reset}} - ${cmd.description}`);
          });
          return true;
        }
      });
      this.registerCommand('look', {
        description: 'Describe the current room',
        execute: () => {
          this.describeRoom();
          return true;
        }
      });
      this.registerAlias('l', 'look');
      
      this.registerCommand('take', {
        description: 'Take an item',
        execute: (args) => {
          if (args.length === 0) {
            this.printLine('{{red}}Take what?{{color_reset}}');
            return false;
          }
          const itemName = args.join('_').toLowerCase();
          const room = this.world.rooms.get(this.state.currentRoom);
          if (!room.items || !room.items.includes(itemName)) {
            this.printLine(`{{red}}There is no ${itemName} here.{{color_reset}}`);
            return false;
          }
          const item = this.world.items.get(itemName);
          if (item && item.takeable === false) {
             this.printLine(`{{red}}You cannot take the ${item.name}.{{color_reset}}`);
             return false;
          }
          // Remove from room
          room.items = room.items.filter(id => id !== itemName);
          // Add to inventory
          this.state.inventory.push(itemName);
          this.printLine(`{{green}}You took the ${item ? item.name : itemName}.{{color_reset}}`);
          return true;
        }
      });
      this.registerCommand('inventory', {
        description: 'List your inventory',
        execute: () => {
          if (this.state.inventory.length === 0) {
            this.printLine('Your inventory is empty.');
          } else {
            this.printLine('{{bold}}{{yellow}}Inventory:{{font_reset}}');
            this.state.inventory.forEach(itemId => {
              const item = this.world.items.get(itemId);
              this.printLine(`  - ${item ? item.name : itemId}`);
            });
          }
          return true;
        }
      });
      this.registerAlias('i', 'inventory');
      this.registerAlias('inv', 'inventory');

      this.registerCommand('use', {
        description: 'Use an item',
        execute: (args) => {
          if (args.length === 0) {
            this.printLine('{{red}}Use what?{{color_reset}}');
            return false;
          }
          const itemName = args.join('_').toLowerCase();
          if (!this.state.inventory.includes(itemName)) {
            const room = this.world.rooms.get(this.state.currentRoom);
             if(!room.items || !room.items.includes(itemName)) {
                this.printLine(`{{red}}You don't have a ${itemName}.{{color_reset}}`);
                return false;
             }
          }
          const item = this.world.items.get(itemName);
          if (item && item.use) {
            return item.use(this.state, this);
          } else {
            this.printLine(`{{red}}You can't use the ${item ? item.name : itemName}.{{color_reset}}`);
            return false;
          }
        }
      });

      this.registerCommand('talk', {
        description: 'Talk to a character',
        execute: (args) => {
          if (args.length === 0) {
            this.printLine('{{red}}Talk to who?{{color_reset}}');
            return false;
          }
          const charName = args.join('_').toLowerCase();
          const room = this.world.rooms.get(this.state.currentRoom);
          if (!room.characters || !room.characters.includes(charName)) {
            this.printLine(`{{red}}There is no one named ${charName} here.{{color_reset}}`);
            return false;
          }
          const character = this.world.characters.get(charName);
          if (character && character.talk) {
            character.talk(this.state, this);
            return true;
          } else {
            this.printLine(`{{red}}${character ? character.name : charName} has nothing to say.{{color_reset}}`);
            return false;
          }
        }
      });
      
      this.registerCommand('go', {
        description: 'Move to another room',
        execute: (args) => {
          if (args.length === 0) {
            this.printLine('{{red}}Go where?{{color_reset}}');
            return false;
          }
          const direction = args[0].toLowerCase();
          const room = this.world.rooms.get(this.state.currentRoom);
          if (room.exits && room.exits[direction]) {
            this.moveToRoom(room.exits[direction]);
            return true;
          } else {
            this.printLine(`{{red}}You cannot go ${direction} from here.{{color_reset}}`);
            return false;
          }
        }
      });
      
      this.registerCommand('save', {
        description: 'Save the game',
        execute: () => {
            this.saveGame();
            return true;
        }
      });
      
      this.registerCommand('load', {
        description: 'Load the game',
        execute: () => {
            this.loadGame();
            return true;
        }
      });

      this.registerCommand('clear', {
          description: 'Clear the terminal screen',
          execute: () => {
              this.clearScreen();
              return true;
          }
      });
    }

    registerCommand(name, config) {
      this.world.commands.set(name.toLowerCase(), config);
    }
    registerAlias(alias, original) {
      this.world.aliases.set(alias.toLowerCase(), original.toLowerCase());
    }

    // Game Actions
    async loadNovel(data) {
        if (typeof data === 'string') {
            data = await Utils.loadModule(data);
        }
        
        if (this.config.clearScreenOnNovelLoad) {
            this.clearScreen();
        }

        if (data.title) {
            this.printLine(data.title);
            this.printLine('='.repeat(20));
        }

        // Load rooms
        if (data.rooms) {
            data.rooms.forEach(room => this.world.rooms.set(room.id, room));
        }
        // Load items
        if (data.items) {
            data.items.forEach(item => this.world.items.set(item.id, item));
        }
        // Load characters
        if (data.characters) {
            data.characters.forEach(char => this.world.characters.get(char.id) || this.world.characters.set(char.id, char));
        }
        // Load events
        if (data.events) {
            data.events.forEach(event => this.world.events.set(event.id, event));
        }

        if (data.startRoom) {
            this.moveToRoom(data.startRoom);
        }
        
        this.isRunning = true;
    }

    moveToRoom(roomId) {
      const room = this.world.rooms.get(roomId);
      if (!room) {
        this.printLine(`{{red}}Error: Room ${roomId} not found!{{color_reset}}`);
        return;
      }
      
      // Check conditions
      if (room.condition && !room.condition(this.state)) {
          if (room.blockedMessage) {
              this.printLine(room.blockedMessage);
          } else {
              this.printLine("{{red}}You cannot enter this area yet.{{color_reset}}");
          }
          return;
      }

      this.state.currentRoom = roomId;
      if (room.onEnter) {
        room.onEnter(this.state, this);
      }
      this.describeRoom();
      this.checkEvents();
    }

    describeRoom() {
      const room = this.world.rooms.get(this.state.currentRoom);
      this.printLine(`\n{{bold}}{{yellow}}${room.name}{{font_reset}}`);
      this.printLine(room.description);
      
      if (room.items && room.items.length > 0) {
        const itemNames = room.items.map(id => {
          const item = this.world.items.get(id);
          return item ? item.name : id;
        });
        this.printLine(`\n{{blue}}You see:{{color_reset}} ${itemNames.join(', ')}`);
      }

      if (room.characters && room.characters.length > 0) {
        const charNames = room.characters.map(id => {
          const char = this.world.characters.get(id);
          return char ? char.name : id;
        });
        this.printLine(`{{magenta}}Characters here:{{color_reset}} ${charNames.join(', ')}`);
      }

      if (room.exits) {
        const directions = Object.keys(room.exits);
        this.printLine(`{{cyan}}Exits:{{color_reset}} ${directions.join(', ')}`);
      }
    }

    processInput(input) {
      input = input.trim();
      if (!input) return;

      this.state.history.push(input);
      this.historyIndex = this.state.history.length;
      
      this.printLine(`{{gray}}${this.config.prompt}${input}{{color_reset}}`, { skipAnimation: true });

      const parts = input.split(' ');
      let commandName = parts[0].toLowerCase();
      const args = parts.slice(1);

      // Check aliases
      if (this.world.aliases.has(commandName)) {
        commandName = this.world.aliases.get(commandName);
      }

      if (this.world.commands.has(commandName)) {
        const cmd = this.world.commands.get(commandName);
        const success = cmd.execute(args);
        if (success) {
            this.checkEvents();
        }
      } else {
        this.printLine(`{{red}}Unknown command: ${commandName}. Type 'help' for a list of commands.{{color_reset}}`);
      }
    }

    checkEvents() {
      this.world.events.forEach(event => {
        if (event.condition(this.state)) {
          event.trigger(this.state, this);
        }
      });
    }

    // Output methods
    printLine(text, options = {}) {
      if (this.config.disableTextAnimation || options.skipAnimation) {
        this.outputLine(text);
      } else {
        this.outputQueue.push({ text, options });
        this.runQueue();
      }
    }

    outputLine(text) {
      const formatted = this.parseFormatting(text);
      if (this.env === 'browser') {
        const line = document.createElement('div');
        line.innerHTML = formatted;
        this.outputElement.appendChild(line);
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
      } else {
        process.stdout.write(formatted + '\n');
      }
    }

    async runQueue() {
      if (this.queueIsRunning) return;
      this.queueIsRunning = true;

      while (this.outputQueue.length > 0) {
        const item = this.outputQueue.shift();
        await this.animateText(item.text, item.options);
      }

      this.queueIsRunning = false;
    }

    async animateText(text, options) {
      this.animationState.isAnimating = true;
      const formatted = this.parseFormatting(text);
      
      if (this.env === 'browser') {
        const line = document.createElement('div');
        this.outputElement.appendChild(line);
        
        // Very basic animation for now
        let currentText = '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formatted;
        const plainText = tempDiv.textContent || tempDiv.innerText || "";
        
        // This is a simplification. Real ANSI/HTML aware animation is harder.
        line.innerHTML = formatted;
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
        await new Promise(r => setTimeout(r, this.config.typingSpeed * 2));
      } else {
        this.outputLine(text);
      }
      
      this.animationState.isAnimating = false;
    }

    skipAnimation() {
      // Implementation for skipping
    }

    clearScreen() {
      if (this.env === 'browser') {
        this.outputElement.innerHTML = '';
      } else {
        process.stdout.write('\x1Bc');
      }
    }

    saveGame() {
        if (this.env === 'browser') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            this.printLine('{{green}}Game saved to local storage.{{color_reset}}');
        } else {
            this.fs.writeFileSync('save.json', JSON.stringify(this.state));
            this.printLine('{{green}}Game saved to save.json.{{color_reset}}');
        }
    }

    loadGame() {
        let savedState;
        if (this.env === 'browser') {
            savedState = localStorage.getItem(STORAGE_KEY);
        } else {
            if (this.fs.existsSync('save.json')) {
                savedState = this.fs.readFileSync('save.json', 'utf8');
            }
        }

        if (savedState) {
            this.state = JSON.parse(savedState);
            this.printLine('{{green}}Game loaded.{{color_reset}}');
            this.moveToRoom(this.state.currentRoom);
        } else {
            this.printLine('{{red}}No save file found.{{color_reset}}');
        }
    }
    
    autoComplete() {
        // Implementation for tab completion
    }

    readlineCompleter(line) {
        // Implementation for node readline completion
        return [[], line];
    }
    
    navigateHistory(dir) {
        // Implementation for history navigation
    }
  }

  return {
    Game,
    Utils,
    VERSION
  };
});
