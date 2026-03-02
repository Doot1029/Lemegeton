const LemegetonRooms = [
  {
    id: 'tavern',
    name: '{{bold}}The Special Lioness{{font_reset}}',
    description: 'tavern description',
    exits: {
      north: 'sanctum'
    },
    items: ['sigil', 'lemegeton'],
    onEnter: (state, engine) => {
      if (!engine.plugins.has('lemegeton_plugin')) {
        engine.loadPlugin(window.LemegetonPlugin);
      }
      if (!state.flags.metDemons) {
          setTimeout(() => {
              engine.printLine("Astaroth: \"Welcome, seeker. You look lost in these halls of knowledge.\"");
              engine.printLine("Belial: \"Knowledge is a heavy burden, isn't it? Better to just enjoy the view.\"");
              state.flags.metDemons = true;
          }, 500);
      }
    },
    characters: ['astaroth', 'belial'],
  },
  {
    id: 'sanctum',
    name: '{{bold}}Sanctum{{font_reset}}',
    description: 'A quiet sanctum where idle effects continue between actions.',
    exits: {
      south: 'tavern'
    }
  }
];

if (typeof window !== 'undefined') {
  window.LemegetonRooms = LemegetonRooms;
}
