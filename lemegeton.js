(function() {
  // const { registerKingdom } = require("./clavicula.js");

  let ClaviculaRooms, ClaviculaCharacters, ClaviculaItems;

  if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) {
    const clavicula = require("./clavicula.js");
    ClaviculaRooms = clavicula.rooms;
    ClaviculaCharacters = clavicula.characters;
    ClaviculaItems = clavicula.items;
  } else {
    ClaviculaRooms = window.ClaviculaData.rooms;
    ClaviculaCharacters = window.ClaviculaData.characters;
    ClaviculaItems = window.ClaviculaData.items;
  }

  const LemegetonPlugin = {
    id: "lemegeton_plugin",
    name: "Lemegeton Reading Plugin",
    commands: [
      {
        name: "follow",
        display: "follow [character/player]",
        help: "Follow a character or player from room to room.",
        fn: (args, engine) => {
          if (args.length === 0) {
            engine.printLine("Follow whom? Use 'follow [name]'.");
            return true;
          }

          const query = args.join(" ").toLowerCase();
          const room = engine.world.rooms.get(engine.state.currentRoom);
          
          // Find NPC
          const character = findCharacterInRoom(query, room, engine);
          if (character) {
            engine.state.flags.following = character.id;
            engine.printLine(`You are now following ${character.name}.`);
            return true;
          }

          // Multiplayer Player following
          if (engine.state.multiplayerPlayers) {
            const player = engine.state.multiplayerPlayers.find(p => 
              p.name.toLowerCase().includes(query) || p.id.toLowerCase() === query
            );
            if (player) {
              engine.state.flags.following = player.id;
              engine.printLine(`You are now following the adventurer ${player.name}.`);
              return true;
            }
          }

          engine.printLine(`You don't see '${query}' here.`);
          return true;
        }
      },
      {
        name: "sleep",
        help: "Rest to recover sanity, though demons may visit.",
        fn: (args, engine) => {
          const room = engine.world.rooms.get(engine.state.currentRoom);
          if (!room.id.includes("cell") && !room.id.includes("shack") && !room.id.includes("sanctum")) {
               engine.printLine("You cannot sleep here. You need a bed or a safe place.");
               return true;
          }

          engine.printLine("You drift into a heavy, uneasy sleep...");
          
          // Sleep Paralysis Chance
          const roll = Math.random();
          if (roll < 0.3) {
              engine.printLine("{{instant}}{{red}}SOMETHING IS SITTING ON YOUR CHEST.{{font_reset}}");
              engine.printLine("{{italic}}You cannot move. You cannot scream.{{font_reset}}");
              
              if (engine.state.flags.protected) {
                  engine.printLine("The Holy Salt flares with a blue light! The entity screeches and vanishes.");
                  engine.state.flags.protected = false;
              } else {
                  engine.printLine("The demon leans in close, whispering secrets that rot your mind.");
                  engine.state.variables.sanity = (engine.state.variables.sanity || 100) - 20;
              }
          } else {
              engine.printLine("You wake up feeling slightly more anchored to reality.");
              engine.state.variables.sanity = Math.min(100, (engine.state.variables.sanity || 100) + 10);
          }
          return true;
        }
      },
      {
        name: "topics",
        aliases: ["knowntopics"],
        display: "topics [character]",
        help: "Show known conversation topics for a character.",
        fn: (args, engine) => {
          if (args.length === 0) {
            engine.printLine("Topics for whom? Use 'topics [character]'.");
            return true;
          }

          const room = engine.world.rooms.get(engine.state.currentRoom);
          if (!room || !room.characters || room.characters.length === 0) {
            engine.printLine("There's no one here to discuss topics with.");
            return true;
          }

          const query = args.join(" ").toLowerCase();
          const character = findCharacterInRoom(query, room, engine);
          if (!character) {
            engine.printLine("You don't see that person here.");
            return true;
          }

          const knownTopics = getKnownTopics(engine.state, character.id);
          const relationship = getRelationship(engine.state, character.id);

          engine.printLine(`{{bold}}${character.name}{{font_reset}} relationship: {{yellow}}${relationship}{{color_reset}}`);
          if (knownTopics.length === 0) {
            engine.printLine("Known topics: none yet. Try 'talk [character] about [topic]' to discover one.");
            return true;
          }

          engine.printLine(`Known topics: ${knownTopics.join(", ")}`);
          return true;
        }
      },
      {
        name: "relationship",
        aliases: ["relations", "relation"],
        display: "relationship [character]",
        help: "Show relationship status for a character.",
        fn: (args, engine) => {
          if (args.length === 0) {
            engine.printLine("Relationship with whom? Use 'relationship [character]'.");
            return true;
          }

          const room = engine.world.rooms.get(engine.state.currentRoom);
          if (!room || !room.characters || room.characters.length === 0) {
            engine.printLine("There's no one here to gauge your relationship with.");
            return true;
          }

          const query = args.join(" ").toLowerCase();
          const character = findCharacterInRoom(query, room, engine);
          if (!character) {
            engine.printLine("You don't see that person here.");
            return true;
          }

          const relationship = getRelationship(engine.state, character.id);
          engine.printLine(`Your relationship with ${character.name} is: {{yellow}}${relationship}{{color_reset}}`);
          return true;
        }
      },
      {
        name: "read",
        aliases: ["consult"],
        help: "Read the Lemegeton grimoire. Use: 'read lemegeton', 'read page [number]', 'read next page', etc.",
        fn: (args, engine) => {
          const itemName = args.join(" ").toLowerCase();
          const lemegeton = engine.world.items.get('lemegeton');
          
          if (!engine.state.inventory.includes('lemegeton')) {
            engine.printLine("You are not carrying the Lemegeton.");
            return true;
          }

          const book = lemegeton;
          if (!book.state) {
            book.state = { lastPage: 0, length: 50 };
          }

          // Handle relative pages
          if (itemName.includes("first page")) {
            return readPage(1, engine, book);
          } else if (itemName.includes("last page")) {
            return readPage(book.state.length, engine, book);
          } else if (itemName.includes("next page")) {
            return readPage(book.state.lastPage + 1, engine, book);
          } else if (itemName.includes("previous page")) {
            return readPage(book.state.lastPage - 1, engine, book);
          }

          // Handle specific page number
          const pageMatch = itemName.match(/page (\d+)/);
          if (pageMatch) {
            return readPage(parseInt(pageMatch[1]), engine, book);
          }

          // Handle "read lemegeton" or just "read"
          if (args.length === 0 || itemName.includes("lemegeton") || itemName.includes("grimoire")) {
            const randomPage = Math.floor(Math.random() * book.state.length) + 1;
            engine.printLine(`You flip the pages randomly and arrive at page ${randomPage}:`);
            return readPage(randomPage, engine, book);
          }

          engine.printLine("Read what?");
          return true;
        }
      },
      {
        name: "delete",
        display: "delete save [slot]",
        help: "Delete a save slot.",
        fn: (args, engine) => {
          if (args[0] === "save" && args[1]) {
            const slot = args[1];
            const success = engine.deleteSave(slot);
            if (success) {
              engine.printLine(`{{red}}Refresh your browser for this to take effect.{{font_reset}}`);
            }
            return true;
          }
          engine.printLine("Delete what? Use 'delete save [slot]'.");
          return true;
        }
      }
    ]
  };

  const RELATIONSHIP_MODES = ["Romantic", "Friendly", "Neutral", "Mean", "Hostile"];

  function ensureCharacterState(state) {
    if (!state.variables) {
      state.variables = {};
    }
    if (!state.variables.knownTopics) {
      state.variables.knownTopics = {};
    }
    if (!state.variables.relationships) {
      state.variables.relationships = {};
    }
  }

  function ensureCharacterTracking(state, characterId) {
    ensureCharacterState(state);
    if (!state.variables.knownTopics[characterId]) {
      state.variables.knownTopics[characterId] = [];
    }
    if (!state.variables.relationships[characterId]) {
      state.variables.relationships[characterId] = "Neutral";
    }
  }

  function getKnownTopics(state, characterId) {
    ensureCharacterTracking(state, characterId);
    return state.variables.knownTopics[characterId];
  }

  function getRelationship(state, characterId) {
    ensureCharacterTracking(state, characterId);
    const relationship = state.variables.relationships[characterId];
    return RELATIONSHIP_MODES.includes(relationship) ? relationship : "Neutral";
  }

  function setRelationship(state, characterId, relationship) {
    ensureCharacterTracking(state, characterId);
    state.variables.relationships[characterId] = RELATIONSHIP_MODES.includes(relationship)
      ? relationship
      : "Neutral";
  }

  function unlockTopic(state, characterId, topic) {
    const knownTopics = getKnownTopics(state, characterId);
    if (!knownTopics.includes(topic)) {
      knownTopics.push(topic);
    }
  }

  function findCharacterInRoom(query, room, engine) {
    for (const characterId of room.characters) {
      const character = engine.world.characters.get(characterId);
      if (!character) {
        continue;
      }
      if (character.name.toLowerCase().includes(query)) {
        return character;
      }
      if (character.aliases && character.aliases.some((alias) => alias.toLowerCase().includes(query))) {
        return character;
      }
    }
    return null;
  }

  function enableTopicDiscovery(character) {
    if (!character.topics) {
      return;
    }

    Object.entries(character.topics).forEach(([topicKey, topicData]) => {
      if (topicKey === "random" || typeof topicData.dialog !== "function" || topicData.__tracksDiscovery) {
        return;
      }

      const originalDialog = topicData.dialog;
      topicData.dialog = (state, engine) => {
        unlockTopic(state, character.id, topicKey);
        if (topicData.relationship) {
          setRelationship(state, character.id, topicData.relationship);
        }
        return originalDialog(state, engine);
      };
      topicData.__tracksDiscovery = true;
    });
  }

  async function registerLemegetonExtensions(engine) {
    await engine.loadPlugin(LemegetonPlugin);

    const bartender = engine.world.characters.get("bartender");
    if (bartender) {
      enableTopicDiscovery(bartender);
      ensureCharacterTracking(engine.state, bartender.id);
    }
  }

  function readPage(n, engine, book) {
    if (n < 1) {
      engine.printLine("The page numbering begins with 1.");
      return true;
    }
    if (n > book.state.length) {
      engine.printLine(`There are only ${book.state.length} pages in the book.`);
      return true;
    }

    book.state.lastPage = n;

    if (n === 47) {
      engine.printLine("Your eyes burn; your ears ring. Beneath your gaze, the dreadful sigils writhe, reminding you of that which lies outside the edges of the universe...");
      engine.printLine("{{bold}}{{red}}You have lost your remaining sanity.{{font_reset}}");
      setTimeout(() => {
          engine.gameOver();
      }, 2000);
      return true;
    }

    const contents = {
      1: "The first page contains the seal of Bael, the first king of the East.",
      2: "Page 2 details the summoning of Agares, a duke who can make those who run stand still.",
      10: "A diagram of the brass vessel used to contain the 72 spirits.",
      13: "Faded ink describes the properties of the Ring of Solomonis.",
      25: "A list of the planetary hours and their corresponding spirits.",
      50: "The final page is covered in cryptic warnings about the Tree of Forbidden Knowledge."
    };

    if (contents[n]) {
      engine.printLine(`You read:{{n}}{{is}}'${contents[n]}'{{fr}}`);
    } else {
      engine.printLine(`Page ${n} appears to be blank.`);
    }
    return true;
  }

  const LemegetonNovel = {
    title: "Lemegeton: The Kingdom of Clavicula",
    startRoom: "gallows_square",
    introText:
      "You wake up in the center of Gallows Square. The air is cold and smells of rot.{{n}}{{n}}" +
      "You remember being manipulated by the guards into a cult. Your family is gone. You are alone.{{n}}{{n}}" +
      "Solomonis watches over Clavicula, but he is not who he seems.{{n}}{{n}}",
    rooms: [...ClaviculaRooms],
    characters: [...ClaviculaCharacters],
    items: [...ClaviculaItems, {
        id: "lemegeton",
        name: "Lemegeton grimoire",
        aliases: ["book", "grimoire", "lemegeton"],
        takeable: true,
        description: "An ancient grimoire containing forbidden knowledge of spirit summoning.",
        use: (state, engine) => {
          const book = engine.world.items.get("lemegeton");
          const randomPage = Math.floor(Math.random() * (book.state?.length || 50)) + 1;
          engine.printLine("You open the Lemegeton:");
          return readPage(randomPage, engine, book);
        }
      }]
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      LemegetonNovel,
      registerLemegetonExtensions
    };
  } else if (typeof window !== "undefined") {
    window.LemegetonNovel = LemegetonNovel;
    window.registerLemegetonExtensions = registerLemegetonExtensions;
  }
})();