const LemegetonPlugin = {
  id: "lemegeton_plugin",
  name: "Lemegeton Reading Plugin",
  commands: [
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
  title: "Lemegeton: The Journey to Apotheosis",
  startRoom: "tavern",
  introText:
    "In Eden, King Solomonis of the Kingdom of Clavicula forces humans and spirits alike to attend the annual battle of Apotheosis Armageddon—a battle where the main trophy is becoming a God, achieving the Zenith Rank. Every night, many demons lurk around Clavicula to steal souls, kill, and terrorize the townspeople. The Grand Creator remains silent, as faith on Earth and Eden dwindles under the rule of the dictator Lucifer.{{n}}{{n}}" +
    "Now, you find yourself at the beginning of your journey in the Special Lioness.{{n}}{{n}}" +
    "As you enter the tavern through the heavy, wooden door, you're welcomed by a pleasant atmosphere and laughing voices. The bartender is a little preoccupied, but still manages to welcome you with a friendly nod.{{n}}{{n}}" +
    "The tavern itself is packed. Soldiers seem to be the primary clientele here, which often leads to exciting evenings. Several long tables are occupied by locals, travellers, foreigners and anybody else who wishes to join. The other, smaller tables are also occupied by people who are indulging in great food and drinks, while some do try to strike a conversation, others can barely speak a word between eating what must be delicious food. Even most of the stools at the bar are occupied, though nobody seems to mind more company.{{n}}{{n}}" +
    "You did hear rumors about this tavern, supposedly it's famous for something, but you can't remember what for. Though judging by the amount of women in this tavern and the amount of them trying to subtly eye the bartender, it's probably his good looks and charm. You manage to find a seat and prepare for what will undoubtedly be a great evening.{{n}}{{n}}",
  rooms: [
    {
      id: "tavern",
      name: "{{bold}}The Special Lioness{{font_reset}}",
      description: "It's as alluring inside as it is on the outside. Tree logs support the upper floor and the ambient lights attached to them. The walls are decorated with sports memorabilia, it's clear the owner, and probably the customers, are avid fans.",
      exits: {
        north: "outside-tavern"
      },
      items: ["sigil", "lemegeton"],
      characters: ["bartender"],
    },
    {
      id: "outside-tavern",
      name: "{{bold}}Outside of the Special Lioness{{font_reset}} (tavern)",
      description: "From the outside it looks rustic, peaceful and delightful. Hardwooden planks and huge, stone pillars make up most of the building's outer structure. It's impossible to see through the darkened windows, but the enthusiastic noises from within can be felt outside.",
      exits: {
        south: "tavern"
      }
    },
  ],
  characters: [
    {
      id: "bartender",
      name: "Bartender",
      aliases: ["Oskar", "Barkeep", "Brewbeard", "Oskar Brewbeard"],
      description: "A tall, burly man with a thick beard and a friendly smile. He seems to know everything that's going on in the Kingdom of Clavicula.",
      topics: {
        name: {
          dialog: (state, engine) => {
            engine.printLine("Bartender: 'The name's Oskar Brewbeard, friend. Best brew in all of Clavicula, or so they say.'");
          }
        },
        rumors: {
          aliases: ["news", "gossip"],
          dialog: (state, engine) => {
            engine.printLine("Bartender: 'Rumors? There's plenty of those. Some say the demons are getting bolder, others say King Solomonis is looking for something specific in the woods.'");
          }
        },
        specialty: {
          aliases: ["drink", "brew"],
          relationship: "Friendly",
          dialog: (state, engine) => {
            engine.printLine("Bartender: 'My specialty is the Lioness Ale. It's got a kick that'll make even a demon think twice.'");
          }
        },
        lucifer: {
          aliases: ["dictator", "tyrant"],
          relationship: "Mean",
          dialog: (state, engine) => {
            engine.printLine("Bartender: 'Lucifer's grip grows tighter every season. Speak too loudly about him and you'll vanish by dawn.'");
          }
        },
        flirt: {
          aliases: ["charm", "romance"],
          relationship: "Romantic",
          dialog: (state, engine) => {
            engine.printLine("Bartender: 'Careful now, friend—compliments like that might earn you the first pour on the house.'");
          }
        },
        insult: {
          aliases: ["mock", "offend"],
          relationship: "Hostile",
          dialog: (state, engine) => {
            engine.printLine("Bartender: 'Easy. Another word like that and you'll be drinking outside in the rain.'");
          }
        },
        random: {
          aliases: ["surprise"],
          dialog: (state, engine) => {
            const character = engine.world.characters.get("bartender");
            const topicEntries = Object.entries(character.topics)
              .filter(([key, value]) => key !== "random" && typeof value.dialog === "function");

            if (topicEntries.length === 0) {
              engine.printLine("Bartender scratches his beard, but no topic comes to mind.");
              return;
            }

            const unknownTopics = topicEntries.filter(([key]) => !getKnownTopics(state, "bartender").includes(key));
            const pool = unknownTopics.length > 0 ? unknownTopics : topicEntries;
            const [pickedTopic] = pool[Math.floor(Math.random() * pool.length)];

            engine.printLine(`Bartender: 'Let's go with {{yellow}}${pickedTopic}{{color_reset}}.'`);
            engine.printLine("(Topic discovered through randomness.)");

            character.topics[pickedTopic].dialog(state, engine);
          }
        }
      }
    }
  ],
  items: [
    {
      id: "sigil",
      name: "metal sigil seal",
      takeable: true,
      description: "A metal sigil that pulses whenever action animations trigger.",
      use: (engine) => {
        engine.printLine("The sigil resonates with your command flow.");
        return true;
      }
    },
    {
      id: "lemegeton",
      name: "Lemegeton grimoire",
      aliases: ["book", "grimoire", "lemegeton"],
      takeable: true,
      description: "An ancient grimoire containing forbidden knowledge of spirit summoning.",
      use: (engine) => {
        // Using the book triggers a random read
        const book = engine.world.items.get("lemegeton");
        const randomPage = Math.floor(Math.random() * (book.state?.length || 50)) + 1;
        engine.printLine("You open the Lemegeton:");
        return readPage(randomPage, engine, book);
      }
    }
  ]
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
