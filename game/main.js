const LemegetonNovel = {
  title: 'Lemegeton: The Journey to Apotheosis',
  startRoom: 'tavern',
  onLoad: (engine) => {
    engine.loadPlugin(window.LemegetonPlugin);
  },
  rooms: window.LemegetonRooms,
  characters: window.LemegetonCharacters,
  items: window.LemegetonItems
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LemegetonNovel;
} else if (typeof window !== 'undefined') {
  window.LemegetonNovel = LemegetonNovel;
}
