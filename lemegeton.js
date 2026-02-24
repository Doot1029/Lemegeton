/**
 * LEMEGETON - Gothic Horror RPG for LoreJS
 * 
 * Based on the concepts in ai-context/concepts.md
 */

module.exports = {
  title: "{{bold}}{{magenta}}LEMEGETON: Path of the Zenith{{font_reset}}",
  startRoom: "clavicula_basement",
  
  rooms: [
    {
      id: "clavicula_basement",
      name: "{{red}}The Basement of Demons{{font_reset}}",
      description: "A dark, damp basement beneath the Kingdom of Clavicula. The air is thick with the scent of sulfur and old blood. A shimmering {{cyan}}magical barrier{{color_reset}} seals the exit to the {{bold}}upstairs{{font_reset}}.",
      exits: {
        upstairs: "clavicula_hall"
      },
      items: ["ritual_knife"],
      onEnter: (state, engine) => {
        if (!state.flags.initialized) {
          state.flags.sanity = 100;
          state.flags.wrath = 0;
          state.flags.loyalty = 0;
          state.flags.gameTime = 0;
          state.flags.cultRank = "Novice";
          state.flags.spiritSummoned = null;
          state.flags.demonInventory = [];
          state.flags.skills = [];
          state.flags.initialized = true;
          engine.printLine("{{italic}}You wake up on the cold stone floor. The whispers of demons echo in the shadows.{{font_reset}}");
        }
      }
    },
    {
      id: "clavicula_hall",
      name: "{{yellow}}Kingdom of Clavicula - Grand Hall{{font_reset}}",
      description: "A majestic hall filled with gothic architecture and golden ornaments. To the {{bold}}north{{font_reset}} is the Throne Room, and to the {{bold}}west{{font_reset}} lies the city gates.",
      exits: {
        downstairs: "clavicula_basement",
        north: "throne_room",
        west: "city_gates"
      },
      condition: (state) => state.flags.barrierBroken,
      blockedMessage: "{{cyan}}The magical barrier prevents you from leaving. You must find a way to break it.{{color_reset}}",
      characters: ["solomonis"]
    },
    {
      id: "throne_room",
      name: "{{bold}}{{yellow}}Solomonis's Throne Room{{font_reset}}",
      description: "A room of overwhelming power and luxury. King Solomonis's ivory throne dominates the space. A swirling {{magenta}}Abyssal Rift{{color_reset}} is visible behind the throne.",
      exits: {
        south: "clavicula_hall",
        in: "hell_portal"
      },
      items: ["lemegeton_grimoire", "goetiapon_machine", "tree_of_knowledge"]
    },
    {
      id: "hell_portal",
      name: "{{magenta}}The Abyssal Rift{{font_reset}}",
      description: "A swirling vortex of purple and black energy. It leads directly to the City of Dis in Abaddon.",
      exits: {
        back: "throne_room",
        in: "city_of_dis"
      },
      condition: (state) => state.inventory.includes("lemegeton_grimoire"),
      blockedMessage: "{{red}}The rift is unstable. You need the Lemegeton Grimoire to stabilize it.{{color_reset}}"
    },
    {
      id: "city_of_dis",
      name: "{{red}}City of Dis{{font_reset}}",
      description: "The capital of the Land of Goetia in Abaddon. Iron walls and burning towers stretch as far as the eye can see. To the {{bold}}south{{font_reset}} lies Sigilway.",
      exits: {
        north: "hell_portal",
        south: "sigilway"
      }
    },
    {
      id: "sigilway",
      name: "{{yellow}}Sigilway{{font_reset}}",
      description: "A bustling district of the City of Dis. Demons of all kinds wander the streets. The {{bold}}Drunken Devil{{font_reset}} tavern is nearby.",
      exits: {
        north: "city_of_dis",
        in: "drunken_devil"
      },
      characters: ["agares"]
    },
    {
      id: "drunken_devil",
      name: "{{red}}The Drunken Devil{{font_reset}}",
      description: "A loud, chaotic tavern frequented by demons. The air is thick with smoke and the sound of many-tongued arguments.",
      exits: {
        out: "sigilway"
      },
      characters: ["sith", "bael"],
      items: ["abaddonian_coins", "kamea_tablet", "dragon_claw"]
    },
    {
      id: "city_gates",
      name: "Clavicula City Gates",
      description: "The massive gates of the city. Beyond lies the world of Eden. The {{green}}Crossmere Weald{{color_reset}} is visible in the distance.",
      exits: {
        east: "clavicula_hall",
        out: "crossmere_weald"
      }
    },
    {
      id: "crossmere_weald",
      name: "{{green}}Crossmere Weald{{color_reset}}",
      description: "A vast, ancient forest. The trees seem to watch you as you pass. A small {{yellow}}cottage{{color_reset}} sits in a clearing to the {{bold}}west{{font_reset}}.",
      exits: {
        west: "desdemona_cottage",
        in: "city_gates"
      }
    },
    {
      id: "desdemona_cottage",
      name: "Desdemona's Cottage",
      description: "Your former home. It stands silent and empty, a ghost of a life long forgotten.",
      exits: {
        east: "crossmere_weald"
      },
      characters: ["deo"]
    }
  ],

  items: [
    {
      id: "ritual_knife",
      name: "{{gray}}Ritual Knife{{color_reset}}",
      takeable: true,
      description: "A sharp knife used for cult rituals. The blade is etched with strange sigils.",
      use: (state, engine) => {
        if (state.currentRoom === "clavicula_basement" && !state.flags.barrierBroken) {
          engine.printLine("{{red}}You use the ritual knife to draw a counter-sigil on the floor. The magical barrier shatters!{{color_reset}}");
          state.flags.barrierBroken = true;
          state.flags.wrath += 5;
          return true;
        }
        engine.printLine("You brandish the knife, but there is nothing here to use it on.");
        return false;
      }
    },
    {
      id: "lemegeton_grimoire",
      name: "{{magenta}}Lemegeton Grimoire{{font_reset}}",
      takeable: true,
      description: "A series of magic books to understand the basics of magic, sigils, and spirit summoning.",
      use: (state, engine) => {
        engine.printLine("{{magenta}}You flip through the pages of the Lemegeton. Knowledge of sigils and demons fills your mind.{{color_reset}}");
        if (!state.flags.readGrimoire) {
          state.flags.sanity -= 5;
          state.flags.readGrimoire = true;
          engine.printLine("{{red}}Your sanity has decreased, but your knowledge has grown.{{color_reset}}");
        }
        return true;
      }
    },
    {
      id: "abaddonian_coins",
      name: "{{yellow}}Abaddonian Coins{{color_reset}}",
      takeable: true,
      description: "A heavy bag of dark, clinking coins used as currency in Abaddon.",
      use: (state, engine) => {
        const room = engine.world.rooms.get(state.currentRoom);
        if (room.characters && room.characters.includes("bael")) {
          engine.printLine("{{red}}You offer the coins to King Bael. He accepts them with a greedy smile.{{color_reset}}");
          state.flags.loyalty += 10;
          engine.printLine("{{green}}[Bael's loyalty increased!]{{color_reset}}");
          const itemIndex = state.inventory.indexOf("abaddonian_coins");
          if (itemIndex > -1) state.inventory.splice(itemIndex, 1);
          return true;
        }
        engine.printLine("You count your coins. They are worth quite a bit in the underworld.");
        return true;
      }
    },
    {
      id: "goetiapon_machine",
      name: "{{cyan}}Goetiapon Machine{{color_reset}}",
      takeable: false,
      description: "A bizarre brass machine that dispenses demonic sigils in exchange for souls (or Abaddonian coins).",
      use: (state, engine) => {
        if (!state.inventory.includes("abaddonian_coins")) {
          engine.printLine("{{red}}The machine remains silent. You need Abaddonian Coins to operate it.{{color_reset}}");
          return false;
        }

        engine.printLine("{{cyan}}You insert a coin into the Goetiapon machine. It wheezes and glows with an unholy light...{{color_reset}}");
        
        const demons = [
          { id: "bael", name: "King Bael", rank: "King" },
          { id: "agares", name: "Duke Agares", rank: "Duke" },
          { id: "vassago", name: "Prince Vassago", rank: "Prince" },
          { id: "marbas", name: "President Marbas", rank: "President" },
          { id: "valefor", name: "Duke Valefor", rank: "Duke" },
          { id: "amon", name: "Marquis Amon", rank: "Marquis" }
        ];

        const roll = Math.floor(Math.random() * demons.length);
        const summoned = demons[roll];

        engine.printLine(`{{bold}}{{magenta}}CLINK! A sigil for ${summoned.name} (${summoned.rank}) rolls out!{{font_reset}}`);
        
        if (!state.flags.demonInventory.includes(summoned.id)) {
          state.flags.demonInventory.push(summoned.id);
          engine.printLine(`{{green}}You have unlocked the ability to summon ${summoned.name}!{{color_reset}}`);
        } else {
          engine.printLine(`{{yellow}}You already possess the sigil for ${summoned.name}. The duplicate dissolves into shadow.{{color_reset}}`);
        }

        const itemIndex = state.inventory.indexOf("abaddonian_coins");
        if (itemIndex > -1) state.inventory.splice(itemIndex, 1);
        
        return true;
      }
    },
    {
      id: "tree_of_knowledge",
      name: "{{green}}Tree of Forbidden Knowledge{{color_reset}}",
      takeable: false,
      description: "A giant tree with shimmering golden leaves. It is the physical manifestation of your skill tree.",
      use: (state, engine) => {
        engine.printLine("{{green}}You touch the bark of the Tree of Forbidden Knowledge. Paths of power unfold before you.{{color_reset}}");
        engine.printLine("{{yellow}}Available Skills:{{color_reset}}");
        engine.printLine("1. {{bold}}Goetic Tongue{{font_reset}} - Understand the language of demons.");
        engine.printLine("2. {{bold}}Sigilcasting{{font_reset}} - Master the art of blood magic.");
        engine.printLine("3. {{bold}}Apotheosis{{font_reset}} - The path to godhood.");
        
        if (!state.flags.skills.includes("goetic_tongue")) {
          engine.printLine("{{cyan}}You focus your will. The knowledge of the Goetic Tongue flows into you!{{color_reset}}");
          state.flags.skills.push("goetic_tongue");
        } else {
          engine.printLine("{{gray}}You have already mastered the basics of this tree.{{color_reset}}");
        }
        return true;
      }
    },
    {
      id: "kamea_tablet",
      name: "{{blue}}Kamea Tablet{{color_reset}}",
      takeable: true,
      description: "A stone tablet used for drawing planetary sigils and performing blood magic.",
    },
    {
      id: "dragon_claw",
      name: "{{red}}Dragon Claw Stylus{{color_reset}}",
      takeable: true,
      description: "A sharp claw used as a stylus for the Kamea Tablet. It is also used to draw blood.",
      use: (state, engine) => {
        if (!state.inventory.includes("kamea_tablet")) {
          engine.printLine("{{red}}You have nothing to draw on. You need a Kamea Tablet.{{color_reset}}");
          return false;
        }

        engine.printLine("{{red}}You prick your finger with the Dragon Claw and begin drawing on the Kamea Tablet...{{color_reset}}");
        state.flags.wrath += 2;
        state.flags.sanity -= 1;
        
        const planets = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
        const totalHours = Math.floor(state.flags.gameTime / 4);
        const currentPlanet = planets[totalHours % planets.length];
        
        engine.printLine(`{{bold}}{{cyan}}SIGILCAST: You have manifested the influence of ${currentPlanet}!{{font_reset}}`);
        return true;
      }
    }
  ],

  characters: [
    {
      id: "solomonis",
      name: "{{bold}}{{yellow}}King Solomonis{{font_reset}}",
      description: "A wise yet terrifying figure. He wears a mask that hides his true face, and his voice is magically deepened.",
      talk: (state, engine) => {
        if (state.flags.barrierBroken && !state.flags.metSolomonis) {
          engine.printLine("{{yellow}}Solomonis: 'So, you have broken the barrier, Desdemona. Your strength grows. But remember, your soul belongs to the Cult Kleidouchos.'{{color_reset}}");
          state.flags.metSolomonis = true;
        } else {
          engine.printLine("{{yellow}}Solomonis: 'Proceed with your training. The Zenith Rank awaits the worthy.'{{color_reset}}");
        }
      }
    },
    {
      id: "sith",
      name: "{{bold}}Sith{{font_reset}}",
      description: "A sarcastic demonic cat with a pointed tail and horn-like ears. He looks at you with judgmental eyes.",
      talk: (state, engine) => {
        engine.printLine("{{magenta}}Sith: 'Oh, it's you. Still playing at being a cultist? How adorable.'{{color_reset}}");
        engine.printLine("{{magenta}}Sith: 'If you want to survive Abaddon, you'll need more than that rusty knife.'{{color_reset}}");
      }
    },
    {
      id: "bael",
      name: "{{bold}}{{red}}King Bael{{font_reset}}",
      description: "A powerful demon king. He appears in various forms, sometimes as a man, sometimes as a cat or a toad.",
      talk: (state, engine) => {
        engine.printLine("{{red}}Bael: 'Who dares speak to the First King of the East? State your intent, mortal.'{{color_reset}}");
      }
    },
    {
      id: "deo",
      name: "{{bold}}{{blue}}Deo{{font_reset}}",
      description: "A young man with a noble bearing. He looks strangely like a mirror of yourself.",
      talk: (state, engine) => {
        if (!state.flags.metDeo) {
          engine.printLine("{{blue}}Deo: 'Excuse me, traveler. I am looking for someone... a girl who disappeared many years ago. Have you seen anyone named Dominique?'{{color_reset}}");
          state.flags.metDeo = true;
        } else {
          engine.printLine("{{blue}}Deo: 'I will find her. I know she is still out there somewhere.'{{color_reset}}");
        }
      }
    },
    {
      id: "agares",
      name: "{{bold}}{{red}}Duke Agares{{font_reset}}",
      description: "An old man riding a crocodile, carrying a goshawk on his fist.",
      talk: (state, engine) => {
        engine.printLine("{{red}}Agares: 'I can teach you languages and cause the still to run. What is it you seek?'{{color_reset}}");
      }
    }
  ],

  events: [
    {
      id: "sanity_check",
      condition: (state) => state.flags.sanity < 50,
      trigger: (state, engine) => {
        engine.printLine("{{magenta}}The world begins to warp and twist. Hallucinations dance at the edge of your vision.{{color_reset}}");
      }
    },
    {
      id: "masogire_transformation",
      condition: (state) => state.flags.sanity < 20,
      trigger: (state, engine) => {
        engine.printLine("{{bold}}{{red}}A dark transformation begins. You feel your original self, Dominique, fading away...{{font_reset}}");
      }
    },
    {
      id: "time_progression",
      condition: (state) => true,
      trigger: (state, engine) => {
        state.flags.gameTime++;
        
        // Planetary Hour logic (1 hour = 4 turns)
        const planets = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];
        const totalHours = Math.floor(state.flags.gameTime / 4);
        const currentPlanet = planets[totalHours % planets.length];
        
        if (state.flags.gameTime > 0 && state.flags.gameTime % 4 === 0) {
          engine.printLine(`{{cyan}}The hour of ${currentPlanet} begins. The astral energies shift.{{color_reset}}`);
        }
      }
    }
  ]
};
