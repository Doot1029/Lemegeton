
const ClaviculaRooms = [
  // --- REGION I: THE HIGH CASTLE ---
  {
    id: "throne_room",
    name: "{{bold}}{{magenta}}The Throne of Bone{{font_reset}}",
    description: "A massive seat made of bleached leviathan bone dominates the room. King Solomonis sits here, his gaze cold and unblinking. The air is thick with the scent of old incense and rot.",
    exits: { south: "hall_of_echoes", up: "solomonis_study" },
    characters: ["king_solomonis"],
    onEnter: (state, engine) => {
      if (state.flags.watched) {
        engine.printLine("{{italic}}You feel his eyes boring into your soul.{{font_reset}}");
      }
    }
  },
  {
    id: "hall_of_echoes",
    name: "The Hall of Echoes",
    description: "A long, vaulted corridor. Your footsteps ring out, but they seem to be followed by a second, fainter set of steps just behind you.",
    exits: { north: "throne_room", south: "grand_ballroom", west: "guard_barracks" },
    onEnter: (state, engine) => {
      engine.printLine("{{italic}}Clack... clack... clack...{{font_reset}}");
    }
  },
  {
      id: "solomonis_study",
      name: "Solomonis’ Private Study",
      description: "Filled with maps of 'Aetherial Realms' and half-eaten fruit covered in black mold. A large brass ring sits on the desk.",
      exits: { down: "throne_room" },
      items: ["brass_ring", "moldy_fruit"]
  },
  {
      id: "grand_ballroom",
      name: "The Grand Ballroom",
      description: "Ghostly music plays faintly from nowhere. NPCs in tattered finery dance with invisible partners. The floor is slick with something dark.",
      exits: { north: "hall_of_echoes", east: "royal_balcony", down: "servant_passages" },
      characters: ["faceless_waltz"]
  },
  {
      id: "royal_balcony",
      name: "The Royal Balcony",
      description: "Overlooking the dying kingdom of Clavicula. The sky is a bruised, permanent purple. Dying plants hang from the stone railings.",
      exits: { west: "grand_ballroom" }
  },
  {
      id: "torture_chambers",
      name: "The Torture Chambers",
      description: "A place of iron and screams. This is where commoners are 'converted'. The walls are stained beyond cleaning.",
      exits: { up: "guard_barracks", down: "sewer_entrance" },
      characters: ["the_inquisitor"]
  },
  {
      id: "guard_barracks",
      name: "The Guard Barracks",
      description: "Smells of stale ale and old blood. The guards here move with a strange, jerky rhythm, like puppets on strings.",
      exits: { east: "hall_of_echoes", down: "torture_chambers" },
      characters: ["puppet_guard"]
  },
  {
      id: "hidden_sacristy",
      name: "The Hidden Sacristy",
      description: "A secret room behind a heavy tapestry. It smells of ozone and sulfur. Cult robes hang on the wall.",
      exits: { out: "grand_ballroom" },
      items: ["cult_robes", "ritual_dagger"]
  },
  {
      id: "servant_passages",
      name: "The Servant's Passages",
      description: "Cramped, dark tunnels. Creepy messages are scratched into the stone: 'He sees you through us.'",
      exits: { up: "grand_ballroom", north: "clockwork_spire" }
  },
  {
      id: "clockwork_spire",
      name: "The Clockwork Spire",
      description: "A massive, grinding machine of brass and iron. It serves no purpose other than to create a deafening, rhythmic noise.",
      exits: { south: "servant_passages" },
      items: ["rusted_gear"]
  },

  // --- REGION II: THE BUSTLING MARKET ---
  {
      id: "gallows_square",
      name: "Gallows Square",
      description: "The heart of Clavicula's commerce. A body hangs from the central gallows, swaying slowly even though there is no wind.",
      exits: { north: "castle_gate", east: "cathedral_entrance", south: "market_row", west: "beggars_corner" },
      characters: ["the_executioner"]
  },
  {
      id: "cathedral_entrance",
      name: "Cathedral of the Weeping Sun",
      description: "A massive structure of black stone. The sun carved above the door seems to be crying red liquid.",
      exits: { west: "gallows_square", in: "cathedral_sanctum" }
  },
  {
      id: "cathedral_sanctum",
      name: "The Cathedral Sanctum",
      description: "A rare island of peace in the city. The air is filtered through holy incense. High Priest Valerius stands by the altar.",
      exits: { out: "cathedral_entrance", side: "sanctum_of_wards" },
      characters: ["high_priest_valerius"]
  },
  {
      id: "sanctum_of_wards",
      name: "The Sanctum of Wards",
      description: "A small room where holy protections are dispensed to those who can pay the 'tithe'.",
      exits: { back: "cathedral_sanctum" },
      items: ["holy_salt", "silver_bell", "blessed_oil"]
  },
  {
      id: "alchemist_vapor",
      name: "The Alchemist’s Vapor",
      description: "Thick, multicolored smoke fills this shop. It makes your head swim and your vision blur.",
      exits: { north: "market_row" },
      items: ["sanity_draught", "hallucinogen_dust"]
  },
  {
      id: "blacksmith_ember",
      name: "The Blacksmith’s Ember",
      description: "The furnace here screams when stoked. The blacksmith works with 'Hell-Iron', a metal that bleeds when struck.",
      exits: { east: "market_row" },
      characters: ["hell_iron_smith"]
  },
  {
      id: "spice_merchant_tent",
      name: "The Spice Merchant’s Tent",
      description: "Fragrant but unsettling. He sells powders that promise to stop the dreams, though his own eyes are bloodshot and wild.",
      exits: { west: "market_row" },
      items: ["dreamless_poppy"]
  },
  {
      id: "coin_counter_booth",
      name: "The Coin-Counter’s Booth",
      description: "A narrow booth where a hunched man weighs small, glowing shards on a delicate scale.",
      exits: { south: "market_row" },
      characters: ["soul_broker"]
  },
  {
      id: "market_row",
      name: "Rotting Produce Row",
      description: "The smell of decay is overpowering here. Flies swarm over blackening tubers and unidentifiable meat.",
      exits: { north: "gallows_square", south: "sewer_grate", east: "spice_merchant_tent", west: "blacksmith_ember" }
  },
  {
      id: "beggars_corner",
      name: "The Blind Beggar’s Corner",
      description: "A dark corner where the stones are damp. A blind man sits here, pointing his finger at empty space.",
      exits: { east: "gallows_square" },
      characters: ["blind_beggar"]
  },

  // --- REGION III: THE FORBIDDEN LIBRARY ---
  {
      id: "index_of_sins",
      name: "The Index of Sins",
      description: "Rows upon rows of filing cabinets stretch into the darkness. Every sin of every citizen is recorded here.",
      exits: { east: "whispering_pages", south: "scribe_cell" }
  },
  {
      id: "whispering_pages",
      name: "Hall of Whispering Pages",
      description: "Books flutter their pages like wings as you pass. If you stand still, you can hear them whispering your name.",
      exits: { west: "index_of_sins", north: "forgotten_tongues" }
  },
  {
      id: "forgotten_tongues",
      name: "Shelves of Forgotten Tongues",
      description: "Books here are bound in strange leathers. Looking at the titles for too long makes your nose bleed.",
      exits: { south: "whispering_pages", west: "forbidden_vault" },
      items: ["cipher_stone"]
  },
  {
      id: "scribe_cell",
      name: "The Scribe’s Ink-Stained Cell",
      description: "A small, windowless room. A man is frantically writing 'He is watching' over and over on the walls.",
      exits: { north: "index_of_sins" },
      characters: ["mad_scribe"]
  },
  {
      id: "forbidden_vault",
      name: "The Forbidden Vault",
      description: "A heavily reinforced room. In the center, on a pedestal of bone, sits the Lemegeton.",
      exits: { east: "forgotten_tongues", down: "astrarium" },
      items: ["lemegeton"]
  },
  {
      id: "astrarium",
      name: "The Astrarium",
      description: "A map of the stars is projected onto the ceiling. The stars are slowly blinking out, one by one.",
      exits: { up: "forbidden_vault", out: "librarian_study" }
  },
  {
      id: "librarian_study",
      name: "The Librarian's Study",
      description: "A quiet room where the doors have a habit of opening and closing by themselves. The air is very cold.",
      exits: { in: "astrarium" }
  },

  // --- REGION IV: THE DEEP SEWERS ---
  {
      id: "sludge_reservoir",
      name: "The Sludge Reservoir",
      description: "A massive pool of black bile. Something large ripples beneath the surface, leaving a trail of oil.",
      exits: { north: "rat_nest", east: "aqueduct" },
      characters: ["bile_leviathan"]
  },
  {
      id: "rat_nest",
      name: "The Rat King’s Nest",
      description: "Thousands of rats are tied together by their tails, forming a single, squirming mass that speaks with many voices.",
      exits: { south: "sludge_reservoir" },
      characters: ["rat_king"]
  },
  {
      id: "aqueduct",
      name: "The Ancient Aqueduct",
      description: "Crumbling stone arches covered in bioluminescent, toxic fungus that glows with a sickly green light.",
      exits: { west: "sludge_reservoir", south: "sluice_control" }
  },
  {
      id: "sluice_control",
      name: "The Sluice Gate Control",
      description: "Rusted wheels and high-pressure pipes. The dials seem to measure blood pressure rather than water.",
      exits: { north: "aqueduct", east: "flooded_crypt" }
  },
  {
      id: "flooded_crypt",
      name: "The Flooded Crypt",
      description: "Half-submerged coffins float in the dark water. The lids are scratching from the inside.",
      exits: { west: "sluice_control", south: "thieves_hideout" },
      characters: ["the_drowned"]
  },
  {
      id: "thieves_hideout",
      name: "The Thieves’ Hideout",
      description: "A dry corner of the sewers. A group of desperate people huddle around a small, smokeless fire.",
      exits: { north: "flooded_crypt", up: "sewer_grate" },
      items: ["sanity_potion"]
  },
  {
      id: "weeping_wall",
      name: "The Weeping Wall",
      description: "Water leaks through the stones, forming the unmistakable shape of human faces that appear to be crying.",
      exits: { north: "thieves_hideout" }
  },

  // --- REGION V: THE UNDERGROUND SECRET SOCIETY ---
  {
      id: "initiation_chamber",
      name: "The Initiation Chamber",
      description: "A room of mirrors that don't show your reflection, but who you *really* are. This is where you became a cultist.",
      exits: { north: "hall_of_masks" }
  },
  {
      id: "hall_of_masks",
      name: "The Hall of Masks",
      description: "Every member wears a mask of a different animal. Thousands of empty eyes stare at you from the walls.",
      exits: { south: "initiation_chamber", east: "altar_unseen" },
      items: ["goat_mask", "owl_mask"]
  },
  {
      id: "altar_unseen",
      name: "The Altar of the Unseen",
      description: "A floating black sphere that absorbs all light and sound. It feels like a hole in the world.",
      exits: { west: "hall_of_masks", north: "vault_vows" }
  },
  {
      id: "vault_vows",
      name: "The Vault of Vows",
      description: "Contracts signed in blood are stored here in jars of formaldehyde. Your name is on one of them.",
      exits: { south: "altar_unseen", east: "cloistered_cells" }
  },
  {
      id: "cloistered_cells",
      name: "The Cloistered Cells",
      description: "Small stone cells where cultists 'meditate' for days. There is a hard stone slab here for sleeping.",
      exits: { west: "vault_vows", south: "passage_penance" }
  },
  {
      id: "passage_penance",
      name: "The Passage of Penance",
      description: "A hallway floored with jagged glass. You must walk slowly here, or your feet will bleed.",
      exits: { north: "cloistered_cells", out: "sewer_entrance" }
  },

  // --- REGION VI: THE HAUNTED OUTSKIRTS ---
  {
      id: "ashen_graveyard",
      name: "The Ashen Graveyard",
      description: "The dirt is gray and tastes like copper. The headstones are blank, as if the dead have been forgotten.",
      exits: { north: "iron_gate", east: "burnt_orchard" },
      characters: ["grave_wight"]
  },
  {
      id: "iron_gate",
      name: "The Gate of Iron Tears",
      description: "The main entrance to Clavicula, locked from the inside with heavy chains. It feels like a cage.",
      exits: { south: "ashen_graveyard" }
  },
  {
      id: "burnt_orchard",
      name: "The Burnt Orchard",
      description: "Charred trees look like human hands reaching for the sky. The fruit they bear is black and bitter.",
      exits: { west: "ashen_graveyard", north: "hermit_shack" },
      items: ["charred_fruit"]
  },
  {
      id: "hermit_shack",
      name: "The Hermit’s Shack",
      description: "A ramshackle hut that smells of wet dog and old parchment. Old Man Kael lives here in fear.",
      exits: { south: "burnt_orchard", east: "whispering_well" },
      characters: ["old_man_kael"]
  },
  {
      id: "whispering_well",
      name: "The Whispering Well",
      description: "A deep, stone well. If you listen closely, it whispers secrets about your soul and your stats.",
      exits: { west: "hermit_shack", north: "crossroads_regret" }
  },
  {
      id: "crow_gallows",
      name: "The Crow-Pecked Gallows",
      description: "Crows perch on the crossbeam, watching you with intelligent, mocking eyes. They speak in familiar voices.",
      exits: { south: "crossroads_regret" }
  },
  {
      id: "crossroads_regret",
      name: "The Crossroads of Regret",
      description: "A place where the fog is thickest. You can see shadows of people you once knew walking in the mist.",
      exits: { south: "whispering_well", north: "crow_gallows", east: "shrouded_path" }
  },
  {
      id: "shrouded_path",
      name: "The Shrouded Path",
      description: "A path that seems to twist and change as you walk. You are being followed by The Stalker.",
      exits: { west: "crossroads_regret", north: "summoning_stone" },
      characters: ["the_stalker"]
  },

  // --- REGION VII: THE FOREST CLEARING ---
  {
      id: "summoning_stone",
      name: "The Summoning Stone",
      description: "A massive obsidian slab, cracked down the middle. It pulses with a dark, rhythmic energy.",
      exits: { south: "shrouded_path", east: "bleeding_tree" }
  },
  {
      id: "bleeding_tree",
      name: "The Bleeding Tree",
      description: "A giant tree that weeps thick, red sap. This 'Living Ink' is used to record the sins of the world.",
      exits: { west: "summoning_stone", north: "void_rift" },
      items: ["living_ink"]
  },
  {
      id: "void_rift",
      name: "The Void Rift",
      description: "A tear in the fabric of reality. Beyond the rift lies the Night-Terror, and the truth of Solomonis.",
      exits: { south: "bleeding_tree" },
      characters: ["night_terror"]
  }
];

const ClaviculaCharacters = [
    {
        id: "king_solomonis",
        name: "King Solomonis",
        description: "A man of terrifying presence, draped in robes of midnight and bone. His eyes see everything.",
        topics: {
            cult: { dialog: (s, e) => e.printLine("Solomonis: 'The cult is but a means to an end, commoner. Do not question the shepherd.'") },
            demons: { dialog: (s, e) => e.printLine("Solomonis: 'They are tools. Dangerous, but effective if one has the will to command them.'") }
        }
    },
    {
        id: "high_priest_valerius",
        name: "High Priest Valerius",
        description: "A weary man in gold-trimmed robes. He smells of holy oil and regret.",
        topics: {
            protection: { dialog: (s, e) => e.printLine("Valerius: 'The demons are hungry. My wards are the only thing keeping your soul in your body.'") },
            king: { dialog: (s, e) => e.printLine("Valerius: 'The King... he has his reasons. We all have our cross to bear.'") }
        }
    },
    {
        id: "blind_beggar",
        name: "The Blind Beggar",
        description: "His eyes are milky white, but he follows your movements perfectly.",
        topics: {
            eyes: { dialog: (s, e) => e.printLine("Beggar: 'I don't need eyes to see the shadows that dance behind you, cultist.'") },
            stalker: { dialog: (s, e) => e.printLine("Beggar: 'He's been waiting for you on the Shrouded Path for a long time.'") }
        }
    },
    {
        id: "the_executioner",
        name: "The Executioner",
        description: "A hulking figure in a blood-stained hood. He sharpens his axe with rhythmic, metallic scrapes.",
        topics: {
            gallows: { dialog: (s, e) => e.printLine("Executioner: 'Everyone has their turn on the rope. Yours is coming.'") }
        }
    },
    {
        id: "the_inquisitor",
        name: "The Inquisitor",
        description: "A man whose skin is pulled too tight over his skull. He carries a tray of silver needles.",
        topics: {
            conversion: { dialog: (s, e) => e.printLine("Inquisitor: 'Pain is the most efficient teacher. Are you ready for your next lesson?'") }
        }
    },
    {
        id: "the_stalker",
        name: "The Stalker",
        description: "A flickering shadow that never quite stays in your peripheral vision.",
        topics: {
            pursuit: { dialog: (s, e) => e.printLine("Stalker: 'I am the breath on the back of your neck. I am the reason you run.'") }
        }
    }
    // ... more NPCs to be added
];

const ClaviculaItems = [
    {
        id: "holy_salt",
        name: "Blessed Holy Salt",
        takeable: true,
        description: "A small pouch of coarse salt that has been blessed by Valerius.",
        use: (state, engine) => {
            engine.printLine("You sprinkle the salt around your bed. A faint blue glow lingers for a moment.");
            state.flags.protected = true;
            return true;
        }
    },
    {
        id: "brass_ring",
        name: "Brass Ring of Solomonis",
        takeable: true,
        description: "A heavy brass ring etched with binding sigils. It feels uncomfortably warm.",
        use: (state, engine) => {
            engine.printLine("The ring vibrates. You feel a connection to the infernal tethers.");
            return true;
        }
    }
];

const ClaviculaData = {
    rooms: ClaviculaRooms,
    characters: ClaviculaCharacters,
    items: ClaviculaItems
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = ClaviculaData;
} else if (typeof window !== "undefined") {
    window.ClaviculaData = ClaviculaData;
}
