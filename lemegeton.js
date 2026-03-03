const LemegetonPlugin = {
  id: "lemegeton_plugin",
  name: "Lemegeton Reading Plugin",
  commands: [
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
  onLoad: (engine) => {
    engine.loadPlugin(LemegetonPlugin);
    
    if (engine.state.flags.loadingSave) {
      return;
    }

    // 4-paragraph intro
    engine.printLine(
      "In Eden, King Solomonis of the Kingdom of Clavicula forces humans and spirits alike to attend the annual battle of Apotheosis Armageddon—a battle where the main trophy is becoming a God, achieving the Zenith Rank. Every night, many demons lurk around Clavicula to steal souls, kill, and terrorize the townspeople. The Grand Creator remains silent, as faith on Earth and Eden dwindles under the rule of the dictator Lucifer.{{newline}}{{newline}}" +
      "Now, you find yourself at the beginning of your journey in the Special Lioness.{{newline}}{{newline}}" +
      "As you enter the tavern through the heavy, wooden door, you're welcomed by a pleasant atmosphere and laughing voices. The bartender is a little preoccupied, but still manages to welcome you with a friendly nod.{{newline}}{{newline}}" +
      "The tavern itself is packed. Soldiers seem to be the primary clientele here, which often leads to exciting evenings. Several long tables are occupied by locals, travellers, foreigners and anybody else who wishes to join. The other, smaller tables are also occupied by people who are indulging in great food and drinks, while some do try to strike a conversation, others can barely speak a word between eating what must be delicious food. Even most of the stools at the bar are occupied, though nobody seems to mind more company.{{newline}}{{newline}}" +
      "You did hear rumors about this tavern, supposedly it's famous for something, but you can't remember what for. Though judging by the amount of women in this tavern and the amount of them trying to subtly eye the bartender, it's probably his good looks and charm. You manage to find a seat and prepare for what will undoubtedbly be a great evening.{{newline}}{{newline}}"
      );
  },
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
          dialog: (state, engine) => {
            engine.printLine("Bartender: 'My specialty is the Lioness Ale. It's got a kick that'll make even a demon think twice.'");
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
  module.exports = LemegetonNovel;
} else if (typeof window !== "undefined") {
  window.LemegetonNovel = LemegetonNovel;
}
