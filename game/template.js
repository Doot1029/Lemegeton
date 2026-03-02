/**
 * LORE.js Game Template
 * 
 * Use this template to create your own rooms, items, and characters.
 * You can split these into separate files as shown in the Lemegeton example.
 */

const MyNovel = {
  title: 'My Awesome Adventure',
  startRoom: 'start_room',
  
  // Rooms define the locations in your game
  rooms: [
    {
      id: 'start_room',
      name: '{{bold}}The Beginning{{font_reset}}',
      description: 'You are at the start of your journey. A path leads {{yellow}}north{{color_reset}}.',
      exits: {
        north: 'second_room'
      },
      items: ['starter_item']
    },
    {
      id: 'second_room',
      name: '{{bold}}A New Place{{font_reset}}',
      description: 'You have moved north. You can go {{yellow}}south{{color_reset}} to return.',
      exits: {
        south: 'start_room'
      }
    }
  ],

  // Items are objects the player can interact with
  items: [
    {
      id: 'starter_item',
      name: 'rusty key',
      takeable: true,
      description: 'An old, rusty key. It might open something.',
      use: (engine) => {
        engine.printLine('You try to use the key, but there is no lock here.');
        return true;
      }
    }
  ],

  // Characters are NPCs in your game
  characters: [
    {
      id: 'mysterious_stranger',
      name: 'Stranger',
      description: 'A person cloaked in shadows.',
      talk: (state, engine) => {
        engine.printLine('Stranger: "Be careful on your journey."');
      }
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MyNovel;
} else if (typeof window !== 'undefined') {
  window.MyNovel = MyNovel;
}
