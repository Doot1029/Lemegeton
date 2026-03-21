
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

const findRoom = (roomId) => ClaviculaRooms.find((room) => room.id === roomId);
const ensureExit = (roomId, direction, destinationId) => {
    const room = findRoom(roomId);
    if (!room) {
        return;
    }

    room.exits = room.exits || {};
    room.exits[direction] = destinationId;
};

const ensureRoom = (room) => {
    if (!findRoom(room.id)) {
        ClaviculaRooms.push(room);
    }
};

ensureRoom({
    id: "castle_gate",
    name: "The Castle Gate",
    description: "A wedge of black iron and sharpened portcullis teeth divides the royal quarter from the common streets. The guards never blink, even when the wind cuts through them.",
    exits: { south: "gallows_square", north: "hall_of_echoes", out: "ashen_graveyard" }
});

ensureRoom({
    id: "sewer_grate",
    name: "The Sewer Grate",
    description: "A rusted iron grate yawns beneath Market Row. Filthy runoff trickles down the ladder into the city's buried arteries.",
    exits: { north: "market_row", down: "thieves_hideout", west: "sewer_entrance" }
});

ensureRoom({
    id: "sewer_entrance",
    name: "The Sewer Entrance",
    description: "A cramped service junction where the castle's waste tunnels meet older catacomb stone. A draft carries incense from one direction and rot from the other.",
    exits: { up: "torture_chambers", east: "passage_penance", south: "sewer_grate", in: "initiation_chamber" }
});

ensureExit("gallows_square", "north", "castle_gate");
ensureExit("market_row", "south", "sewer_grate");
ensureExit("torture_chambers", "down", "sewer_entrance");
ensureExit("passage_penance", "out", "sewer_entrance");
ensureExit("thieves_hideout", "up", "sewer_grate");
ensureExit("grand_ballroom", "west", "hidden_sacristy");
ensureExit("market_row", "down", "alchemist_vapor");
ensureExit("alchemist_vapor", "up", "market_row");
ensureExit("market_row", "in", "coin_counter_booth");
ensureExit("coin_counter_booth", "out", "market_row");
ensureExit("thieves_hideout", "south", "weeping_wall");
ensureExit("weeping_wall", "north", "thieves_hideout");
ensureExit("cathedral_entrance", "north", "index_of_sins");
ensureExit("index_of_sins", "west", "cathedral_entrance");
ensureExit("initiation_chamber", "out", "sewer_entrance");
ensureExit("ashen_graveyard", "in", "castle_gate");


const formatRoomLabel = (roomId, roomNamesById) => {
    if (roomNamesById[roomId]) {
        return roomNamesById[roomId];
    }

    return roomId
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
};

const formatRoomExitSummary = (room, roomNamesById) => {
    if (!room.exits || Object.keys(room.exits).length === 0) {
        return room.description;
    }

    const exitDetails = Object.entries(room.exits).map(([direction, roomId]) => {
        const destination = formatRoomLabel(roomId, roomNamesById);
        return `${direction} to ${destination}`;
    });

    const exitSummary = exitDetails.length === 1
        ? exitDetails[0]
        : `${exitDetails.slice(0, -1).join(", ")}, and ${exitDetails[exitDetails.length - 1]}`;

    return `${room.description} Exits: ${exitSummary}.`;
};

const ClaviculaRoomNamesById = Object.fromEntries(
    ClaviculaRooms.map((room) => [room.id, room.name.replace(/\{\{[^}]+\}\}/g, "")])
);

ClaviculaRooms.forEach((room) => {
    room.description = formatRoomExitSummary(room, ClaviculaRoomNamesById);
});

const createTopic = (category, label, line, aliases = []) => ({
    category,
    label,
    aliases,
    dialog: (state, engine) => engine.printLine(line)
});

const createCharacter = ({
    id,
    name,
    shortName,
    description,
    talkLine,
    randomTopicIntro,
    aliases = [],
    genre = "unknown",
    topics = {}
}) => ({
    id,
    name,
    shortName,
    aliases,
    genre,
    description,
    talk: (state, engine) => engine.printLine(talkLine),
    randomTopicIntro: randomTopicIntro || ((topicLabel) => `${shortName || name} studies you for a moment. "Let's speak of ${topicLabel}."`),
    topics
});

const createItem = ({ id, name, aliases = [], description, takeable = true, useLine, onUse }) => ({
    id,
    name,
    aliases,
    takeable,
    description,
    use: (state, engine) => {
        if (typeof useLine === "string" && useLine.length > 0) {
            engine.printLine(useLine);
        }
        if (typeof onUse === "function") {
            return onUse(state, engine);
        }
        return true;
    }
});

const ClaviculaCharacters = [
    {
        id: "king_solomonis",
        name: "King Solomonis",
        shortName: "Solomonis",
        description: "A man of terrifying presence, draped in robes of midnight and bone. His eyes see everything.",
        talk: (state, engine) => engine.printLine("Solomonis folds his hands over the throne arm. 'Speak, cultist. If your words carry weight, I may answer.'"),
        randomTopicIntro: (topicLabel) => `Solomonis tilts his head. "Hm, let us go with ${topicLabel}."`,
        topics: {
            valerius: createTopic("character", "Valerius", "Solomonis: 'Valerius still mistakes obedience for virtue. That makes him useful.'", ["high priest", "priest"]),
            brass_ring: createTopic("object", "the brass ring", "Solomonis: 'That ring is a leash, a seal, and a promise. Wear it only if you intend to be bound.'", ["ring"]),
            throne_room: createTopic("location", "the throne room", "Solomonis: 'This throne room is the heart that keeps Clavicula beating, no matter how diseased the blood becomes.'", ["throne", "castle"]),
            cult: createTopic("concept", "the cult", "Solomonis: 'The cult is but a means to an end, commoner. Do not question the shepherd.'", ["cultists"]),
            demons: createTopic("concept", "demons", "Solomonis: 'They are tools. Dangerous, but effective if one has the will to command them.'", ["devils", "night-terrors"])
        }
    },
    {
        id: "high_priest_valerius",
        name: "High Priest Valerius",
        shortName: "Valerius",
        description: "A weary man in gold-trimmed robes. He smells of holy oil and regret.",
        talk: (state, engine) => engine.printLine("Valerius bows his head for a moment. 'If you seek counsel, ask plainly. We have little time and less mercy.'"),
        randomTopicIntro: (topicLabel) => `Valerius steadies his breath. "Hm, let's go with ${topicLabel}."`,
        topics: {
            solomonis: createTopic("character", "King Solomonis", "Valerius: 'The King walks too close to the abyss, yet I remain because someone must keep the people from falling in with him.'", ["king", "solomonis"]),
            holy_salt: createTopic("object", "holy salt", "Valerius: 'Holy salt draws a clean boundary. Demons loathe boundaries they did not choose.'", ["salt", "blessed salt"]),
            cathedral: createTopic("location", "the cathedral", "Valerius: 'This sanctum is one of the few places in Clavicula where prayer still sounds like prayer.'", ["sanctum", "church"]),
            protection: createTopic("concept", "protection", "Valerius: 'The demons are hungry. My wards are the only thing keeping your soul in your body.'", ["wards", "safety"]),
            faith: createTopic("concept", "faith", "Valerius: 'Faith is not comfort. It is the choice to keep the candle lit while the dark begs you to blink.'", ["belief"])
        }
    },
    {
        id: "blind_beggar",
        name: "The Blind Beggar",
        shortName: "Beggar",
        description: "His eyes are milky white, but he follows your movements perfectly.",
        talk: (state, engine) => engine.printLine("The beggar smiles at empty air. 'Coins are for the hungry. Words are for the doomed. Which are you offering me?'"),
        randomTopicIntro: (topicLabel) => `The beggar chuckles softly. "Hm, let's go with ${topicLabel}."`,
        topics: {
            stalker: createTopic("character", "the Stalker", "Beggar: 'He's been waiting for you on the Shrouded Path for a long time. He likes people who already belong to fear.'", ["stalker", "shadow"]),
            silver_bell: createTopic("object", "the silver bell", "Beggar: 'Ring silver in this city and the dead listen first. The living only hear the echo.'", ["bell"]),
            gallows_square: createTopic("location", "Gallows Square", "Beggar: 'Every road in Clavicula eventually remembers Gallows Square. That is how the city keeps score.'", ["square", "gallows"]),
            eyes: createTopic("concept", "eyes", "Beggar: 'I don't need eyes to see the shadows that dance behind you, cultist.'", ["sight", "vision"]),
            fate: createTopic("concept", "fate", "Beggar: 'Fate is only another beggar here. It rattles its cup and hopes the dark notices.'", ["destiny"])
        }
    },
    {
        id: "the_executioner",
        name: "The Executioner",
        shortName: "Executioner",
        description: "A hulking figure in a blood-stained hood. He sharpens his axe with rhythmic, metallic scrapes.",
        talk: (state, engine) => engine.printLine("The Executioner drags a thumb along the edge of his axe. 'Ask. I prefer answers to screaming.'"),
        randomTopicIntro: (topicLabel) => `The Executioner rolls his shoulders. "Hm. Let's go with ${topicLabel}."`,
        topics: {
            solomonis: createTopic("character", "King Solomonis", "Executioner: 'The King gives the order. I give the ending. That is the whole arrangement.'", ["king", "solomonis"]),
            axe: createTopic("object", "the axe", "Executioner: 'A clean blade is a kindness. People never appreciate kindness when it is this sharp.'", ["weapon", "blade"]),
            gallows: createTopic("location", "the gallows", "Executioner: 'Everyone has their turn on the rope. Yours is coming.'", ["gallows square", "square"]),
            justice: createTopic("concept", "justice", "Executioner: 'Justice is what people call it when the blood falls on someone else.'", ["law"]),
            death: createTopic("concept", "death", "Executioner: 'Death is the easiest part of my work. Waiting is what breaks people.'", ["dying"])
        }
    },
    {
        id: "the_inquisitor",
        name: "The Inquisitor",
        shortName: "Inquisitor",
        description: "A man whose skin is pulled too tight over his skull. He carries a tray of silver needles.",
        talk: (state, engine) => engine.printLine("The Inquisitor lines up his needles with loving precision. 'Confession begins with a question. Go on.'"),
        randomTopicIntro: (topicLabel) => `The Inquisitor smiles without warmth. "Hm, let's go with ${topicLabel}."`,
        topics: {
            solomonis: createTopic("character", "King Solomonis", "Inquisitor: 'Solomonis understands that truth enters the body more reliably through pain than through prayer.'", ["king", "solomonis"]),
            needles: createTopic("object", "the silver needles", "Inquisitor: 'Silver remembers every nerve it has kissed. That is why I keep it polished.'", ["needle", "tools"]),
            torture_chambers: createTopic("location", "the torture chambers", "Inquisitor: 'These chambers are classrooms. The lessons simply happen to scream.'", ["chambers", "dungeon"]),
            conversion: createTopic("concept", "conversion", "Inquisitor: 'Pain is the most efficient teacher. Are you ready for your next lesson?'", ["convert", "indoctrination"]),
            pain: createTopic("concept", "pain", "Inquisitor: 'Pain strips away the lies people tell themselves. Whatever remains is wonderfully obedient.'", ["agony"])
        }
    },
    {
        id: "the_stalker",
        name: "The Stalker",
        shortName: "Stalker",
        description: "A flickering shadow that never quite stays in your peripheral vision.",
        talk: (state, engine) => engine.printLine("The Stalker circles just beyond your sight. 'You can speak if you like. I have been listening since before you arrived.'"),
        randomTopicIntro: (topicLabel) => `The Stalker's voice slips through the fog. "Hm, let's go with ${topicLabel}."`,
        topics: {
            solomonis: createTopic("character", "Solomonis", "Stalker: 'The King opened the door. I merely enjoy what walks through after him.'", ["king", "solomonis"]),
            masks: createTopic("object", "the masks", "Stalker: 'Masks are merciful. Faces tell the truth too early.'", ["mask"]),
            shrouded_path: createTopic("location", "the Shrouded Path", "Stalker: 'Every bend in the path was shaped by someone trying to flee me. None of them improved it.'", ["path", "trail"]),
            pursuit: createTopic("concept", "pursuit", "Stalker: 'I am the breath on the back of your neck. I am the reason you run.'", ["hunting", "chase"]),
            fear: createTopic("concept", "fear", "Stalker: 'Fear is a lantern people carry for me. It makes them so easy to follow.'", ["terror"])
        }
    },
    createCharacter({
        id: "faceless_waltz",
        name: "The Faceless Waltz",
        shortName: "Faceless Waltz",
        aliases: ["dancer", "dancers", "waltz"],
        genre: "female",
        description: "A pair of noble figures turning in slow circles. Their masks are smooth where faces should be.",
        talkLine: "The dancers never stop. One inclines a blank face toward you. 'Keep time, and the floor may forgive you.'",
        randomTopicIntro: (topicLabel) => `The orchestra swells without musicians. "Very well," sighs the faceless pair. "Let us dance around ${topicLabel}."`,
        topics: {
            solomonis: createTopic("character", "Solomonis", "Faceless Waltz: 'He taught the court to smile after the music died.'", ["king", "solomonis"]),
            ballroom: createTopic("location", "the ballroom", "Faceless Waltz: 'No guest ever truly leaves this floor. Some only become part of the rhythm.'", ["dance floor", "grand ballroom"]),
            masks: createTopic("object", "the masks", "Faceless Waltz: 'Our masks spare you the grief of seeing what devotion cost us.'", ["mask"]),
            music: createTopic("concept", "music", "Faceless Waltz: 'You hear violins. We hear chains being drawn across silk.'", ["song"]),
            blood: createTopic("concept", "blood", "Faceless Waltz: 'The stains help us keep our steps.'", ["stains"])
        }
    }),
    createCharacter({
        id: "puppet_guard",
        name: "The Puppet Guard",
        shortName: "Puppet Guard",
        aliases: ["guard", "soldier", "puppet"],
        genre: "male",
        description: "A castle guard with lacquered eyes and twitching hands. Fine wire disappears into the shadows above him.",
        talkLine: "The guard jerks to attention. 'State your business before the strings decide it for you.'",
        topics: {
            solomonis: createTopic("character", "Solomonis", "Puppet Guard: 'The King only had to pull once. The rest of us learned to move on our own.'", ["king"]),
            barracks: createTopic("location", "the barracks", "Puppet Guard: 'We sleep here standing up. Easier for the strings to keep hold of us.'", ["guard barracks"]),
            strings: createTopic("concept", "the strings", "Puppet Guard: 'Do not look up. It is better not to know who is holding them.'", ["wires"]),
            ale: createTopic("object", "the ale", "Puppet Guard: 'Stale enough to drown memory, not strong enough to drown obedience.'", ["beer"]),
            duty: createTopic("concept", "duty", "Puppet Guard: 'Duty is what remains after a man has misplaced his will.'", ["orders"])
        }
    }),
    createCharacter({
        id: "hell_iron_smith",
        name: "The Hell-Iron Smith",
        shortName: "Smith",
        aliases: ["smith", "blacksmith"],
        genre: "male",
        description: "A broad-shouldered smith with burn scars like branching script along his arms.",
        talkLine: "The smith hammers once, showering red sparks. 'Speak loudly. The metal screams louder.'",
        topics: {
            hell_iron: createTopic("object", "hell-iron", "Smith: 'It bleeds because every blade remembers the hand that first forged it in fear.'", ["metal", "iron"]),
            market_row: createTopic("location", "Market Row", "Smith: 'This row sells lies, rot, and iron. Mine is the only honest trade.'", ["market"]),
            solomonis: createTopic("character", "Solomonis", "Smith: 'The King commissions chains more often than plows. That tells you enough.'", ["king"]),
            furnace: createTopic("object", "the furnace", "Smith: 'Feed it coal and it howls. Feed it bone and it sings.'", ["forge"]),
            weapons: createTopic("concept", "weapons", "Smith: 'Every weapon in Clavicula is a confession waiting for a hand.'", ["blades"])
        }
    }),
    createCharacter({
        id: "soul_broker",
        name: "The Soul Broker",
        shortName: "Broker",
        aliases: ["broker", "coin counter", "merchant"],
        genre: "male",
        description: "A hunched clerk with ink-black fingernails and a scale made from finger bones.",
        talkLine: "The broker weighs a glowing shard. 'Everything has value. Most things have a buyer. Ask your question.'",
        topics: {
            shards: createTopic("object", "soul shards", "Soul Broker: 'Some people save coin. Here, we save brighter things.'", ["coins", "currency"]),
            market_row: createTopic("location", "Market Row", "Soul Broker: 'The market is loud so no one hears what they are really selling.'", ["market"]),
            beggar: createTopic("character", "the Blind Beggar", "Soul Broker: 'He asks for alms. I ask for portions. We serve the same hunger.'", ["blind beggar", "beggar"]),
            debt: createTopic("concept", "debt", "Soul Broker: 'Debt is the truest leash in Clavicula. Even the dead keep paying.'", ["owing"]),
            scales: createTopic("object", "the scales", "Soul Broker: 'These scales never tip by accident. Only by design.'", ["balance"])
        }
    }),
    createCharacter({
        id: "mad_scribe",
        name: "The Mad Scribe",
        shortName: "Scribe",
        aliases: ["scribe", "writer"],
        genre: "male",
        description: "His fingers are stained black to the knuckle, and his lips move as if copying unheard dictation.",
        talkLine: "The scribe scratches another line into the wall. 'If I stop writing, it starts speaking louder.'",
        topics: {
            index: createTopic("location", "the Index of Sins", "Mad Scribe: 'Every lie, every theft, every thought—they catalogue them until the paper groans.'", ["index", "sins"]),
            ink: createTopic("object", "ink", "Mad Scribe: 'The good ink ran out years ago. Now the city writes in blood and tree-sap.'", ["writing"]),
            lemegeton: createTopic("object", "the Lemegeton", "Mad Scribe: 'Some books are read. That one reads back.'", ["book", "grimoire"]),
            watchers: createTopic("concept", "the watchers", "Mad Scribe: 'He is watching, yes—but so are the pages. The pages are worse.'", ["watching"]),
            names: createTopic("concept", "names", "Mad Scribe: 'A name pinned to paper is halfway to a curse.'", ["records"])
        }
    }),
    createCharacter({
        id: "bile_leviathan",
        name: "The Bile Leviathan",
        shortName: "Leviathan",
        aliases: ["leviathan", "beast"],
        description: "Something vast drifts under the black surface, outlined only by oily swells and glints of teeth.",
        talkLine: "A wet, cavernous voice rises from the reservoir. 'Little cultist. You stand so close to the water.'",
        topics: {
            sewers: createTopic("location", "the sewers", "Leviathan: 'The city empties its filth here. I have become an expert in its appetite.'", ["sludge reservoir", "reservoir"]),
            hunger: createTopic("concept", "hunger", "Leviathan: 'Hunger is the only honest prayer I hear down here.'", ["feeding"]),
            solomonis: createTopic("character", "Solomonis", "Leviathan: 'He built above while I grew below. We are both monuments to excess.'", ["king"]),
            bile: createTopic("object", "the bile", "Leviathan: 'Do not touch it unless you wish to remember every meal this city regrets.'", ["sludge"]),
            drowned: createTopic("character", "the Drowned", "Leviathan: 'They scratch at their coffins like minnows at a hull.'", ["drowned"])
        }
    }),
    createCharacter({
        id: "rat_king",
        name: "The Rat King",
        shortName: "Rat King",
        aliases: ["rats", "rat", "king"],
        description: "A mass of rats knotted together by their tails, all blinking in different rhythms.",
        talkLine: "A chorus of tiny mouths answers at once. 'Ask quickly. Consensus is expensive.'",
        topics: {
            sewers: createTopic("location", "the sewers", "Rat King: 'Below every palace is a pantry. We know them all.'", ["nest", "rat nest"]),
            scraps: createTopic("object", "scraps", "Rat King: 'The city throws away more truth than food.'", ["food"]),
            solomonis: createTopic("character", "Solomonis", "Rat King: 'Even kings leave crumbs. That is why kings never last.'", ["king solomonis", "solomonis"]),
            plague: createTopic("concept", "plague", "Rat King: 'People blame us for every fever. We only carry what they breed.'", ["sickness"]),
            whispers: createTopic("concept", "whispers", "Rat King: 'Walls are generous to small ears.'", ["secrets"])
        }
    }),
    createCharacter({
        id: "the_drowned",
        name: "The Drowned",
        shortName: "Drowned",
        aliases: ["drowned", "corpse", "dead"],
        description: "Pale figures drift between the floating coffins, trailing funeral cloth through the water.",
        talkLine: "Water pours from a ruined mouth. 'We were buried twice and neither time took.'",
        topics: {
            crypt: createTopic("location", "the crypt", "The Drowned: 'The coffins are only boats now, and poor ones at that.'", ["flooded crypt", "coffins"]),
            water: createTopic("object", "the water", "The Drowned: 'It remembers each name spoken over it, then keeps them.'", ["flood"]),
            leviathan: createTopic("character", "the Leviathan", "The Drowned: 'It listens when we sing. That is more courtesy than the living showed us.'", ["bile leviathan"]),
            burial: createTopic("concept", "burial", "The Drowned: 'A city this rotten cannot keep anything properly buried.'", ["graves"]),
            escape: createTopic("concept", "escape", "The Drowned: 'Even when we float free, the city still has us by the ankles.'", ["leave"])
        }
    }),
    createCharacter({
        id: "grave_wight",
        name: "The Grave Wight",
        shortName: "Wight",
        aliases: ["wight", "gravekeeper", "grave"],
        description: "A tall corpse in funeral wrappings, standing perfectly still among the ash-coated stones.",
        talkLine: "The wight inclines its head with brittle courtesy. 'Choose your words carefully. The dead are listening.'",
        topics: {
            graveyard: createTopic("location", "the graveyard", "Grave Wight: 'These graves were emptied by memory long before they were emptied by hand.'", ["ashen graveyard", "cemetery"]),
            names: createTopic("concept", "forgotten names", "Grave Wight: 'A blank headstone is not mercy. It is erasure.'", ["headstones"]),
            gate: createTopic("location", "the iron gate", "Grave Wight: 'The gate keeps bodies out and regret in.'", ["iron gate"]),
            crows: createTopic("character", "the crows", "Grave Wight: 'They dine on the eyes first. That is why they see so much.'", ["crow gallows", "crows"]),
            ash: createTopic("object", "the ash", "Grave Wight: 'Taste it and you will know whose prayers burned.'", ["dust"])
        }
    }),
    createCharacter({
        id: "old_man_kael",
        name: "Old Man Kael",
        shortName: "Kael",
        aliases: ["kael", "hermit", "old man"],
        genre: "male",
        description: "A ragged hermit clutching prayer knots and a cracked lantern.",
        talkLine: "Kael startles, then squints at you. 'You aren't with the Stalker, are you? Good. Ask what you came to ask.'",
        topics: {
            stalker: createTopic("character", "the Stalker", "Kael: 'Never answer when it calls from the fog. The second answer is the one that binds you.'", ["shadow"]),
            well: createTopic("location", "the Whispering Well", "Kael: 'It tells the truth, but truth in Clavicula always costs more than lies.'", ["well"]),
            fruit: createTopic("object", "the charred fruit", "Kael: 'Eat it only if you are desperate. It fills the belly and empties the dreams.'", ["charred fruit"]),
            shack: createTopic("location", "the shack", "Kael: 'It leaks, creaks, and keeps me alive. That is enough to earn my gratitude.'", ["hut"]),
            survival: createTopic("concept", "survival", "Kael: 'Out here, survival is mostly learning which whispers to ignore.'", ["living"])
        }
    }),
    createCharacter({
        id: "night_terror",
        name: "The Night-Terror",
        shortName: "Night-Terror",
        aliases: ["terror", "night terror", "rift"],
        description: "A silhouette at the edge of the rift, made of absence rather than flesh.",
        talkLine: "The darkness beyond the rift folds inward. 'You have come far enough to be afraid properly.'",
        topics: {
            rift: createTopic("location", "the Void Rift", "Night-Terror: 'This wound in the world does not heal. It only learns to open wider.'", ["void", "rift"]),
            solomonis: createTopic("character", "Solomonis", "Night-Terror: 'He mistook proximity for mastery. Humans make that mistake beautifully.'", ["king"]),
            ink: createTopic("object", "living ink", "Night-Terror: 'The tree bleeds memory. I drink what memory leaves behind.'", ["living ink", "tree sap"]),
            sleep: createTopic("concept", "sleep", "Night-Terror: 'Sleep is simply the door you keep forgetting you opened for me.'", ["dreams"]),
            truth: createTopic("concept", "truth", "Night-Terror: 'Truth is what remains when the last comforting lie chokes to death.'", ["revelation"])
        }
    })
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
    },
    createItem({
        id: "moldy_fruit",
        name: "Moldy Fruit",
        aliases: ["fruit", "mold"],
        description: "Half-eaten fruit gone black with mold. It smells sweet and rotten at once.",
        useLine: "You prod the fruit and release a puff of foul spores. Eating it would be a terrible idea."
    }),
    createItem({
        id: "cult_robes",
        name: "Cult Robes",
        aliases: ["robes", "robe"],
        description: "Dark robes lined with stiff, sulfur-scented cloth.",
        useLine: "You drape the cult robes over your shoulders. For a moment, the stone around you feels more welcoming."
    }),
    createItem({
        id: "ritual_dagger",
        name: "Ritual Dagger",
        aliases: ["dagger", "knife"],
        description: "A blackened ceremonial dagger etched with infernal curls.",
        useLine: "The dagger catches no light. Your reflection refuses to appear in the blade."
    }),
    createItem({
        id: "rusted_gear",
        name: "Rusted Gear",
        aliases: ["gear", "cog"],
        description: "A brass gear flaking rust and old machine-grease.",
        useLine: "The gear grinds in your hand with a tired metallic complaint."
    }),
    createItem({
        id: "silver_bell",
        name: "Silver Bell",
        aliases: ["bell"],
        description: "A small consecrated bell wrapped in faded blue ribbon.",
        useLine: "You ring the bell. Its clear note cuts through the gloom and leaves the silence shivering."
    }),
    createItem({
        id: "blessed_oil",
        name: "Blessed Oil",
        aliases: ["oil"],
        description: "A stoppered vial of fragrant oil used in warding rites.",
        useLine: "You anoint your brow with blessed oil. The scent of myrrh and smoke steadies your breathing."
    }),
    createItem({
        id: "sanity_draught",
        name: "Sanity Draught",
        aliases: ["draught", "tonic"],
        description: "A bitter blue tonic that promises to steady a fractured mind.",
        useLine: "You swallow the draught. The world sharpens and the ringing in your thoughts dims.",
        onUse: (state) => {
            state.variables.sanity = Math.min(100, (state.variables.sanity || 100) + 15);
            return true;
        }
    }),
    createItem({
        id: "hallucinogen_dust",
        name: "Hallucinogen Dust",
        aliases: ["dust", "powder"],
        description: "A corked packet of iridescent powder that seems to move when you are not looking at it.",
        useLine: "You uncork the dust and instantly regret it. Colors crawl across the edges of your vision.",
        onUse: (state) => {
            state.variables.sanity = Math.max(0, (state.variables.sanity || 100) - 10);
            return true;
        }
    }),
    createItem({
        id: "dreamless_poppy",
        name: "Dreamless Poppy",
        aliases: ["poppy", "flower"],
        description: "A dried black-red poppy wrapped in twine.",
        useLine: "You crush the poppy and breathe in its dusty scent. Sleep suddenly seems closer and less safe."
    }),
    createItem({
        id: "cipher_stone",
        name: "Cipher Stone",
        aliases: ["stone", "cipher"],
        description: "A palm-sized stone carved with shifting symbols from dead alphabets.",
        useLine: "The symbols on the stone realign under your thumb, almost forming words before they scatter again."
    }),
    createItem({
        id: "sanity_potion",
        name: "Sanity Potion",
        aliases: ["potion"],
        description: "A scavenged bottle of murky medicine traded among the desperate.",
        useLine: "You drink the potion. It tastes medicinal, stale, and surprisingly comforting.",
        onUse: (state) => {
            state.variables.sanity = Math.min(100, (state.variables.sanity || 100) + 10);
            return true;
        }
    }),
    createItem({
        id: "goat_mask",
        name: "Goat Mask",
        aliases: ["mask", "goat"],
        description: "A lacquered goat mask with curling horns and a sweat-darkened strap.",
        useLine: "You hold the mask to your face. Breathing through it makes every sound seem ritualistically important."
    }),
    createItem({
        id: "owl_mask",
        name: "Owl Mask",
        aliases: ["owl", "mask"],
        description: "A painted owl mask whose eyeholes are ringed in dried candle wax.",
        useLine: "The owl mask narrows your vision into two patient circles."
    }),
    createItem({
        id: "charred_fruit",
        name: "Charred Fruit",
        aliases: ["fruit"],
        description: "Blackened orchard fruit with a hard rind and a bitter smell.",
        useLine: "You bite into the charred fruit. The taste is awful, but your stomach stops complaining.",
        onUse: (state) => {
            state.variables.sanity = Math.max(0, (state.variables.sanity || 100) - 5);
            return true;
        }
    }),
    createItem({
        id: "living_ink",
        name: "Living Ink",
        aliases: ["ink", "sap"],
        description: "A vial of red sap that thickens and thins like breathing blood.",
        useLine: "The ink curls against the glass as if trying to spell your name."
    })
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
