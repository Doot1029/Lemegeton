const LemegetonItems = [
  {
    id: 'sigil',
    name: 'metal sigil seal',
    takeable: true,
    description: 'A metal sigil that pulses whenever action animations trigger.',
    use: (engine) => {
      engine.printLine('The sigil resonates with your command flow.');
      return true;
    }
  },
  {
    id: 'lemegeton',
    name: 'Lemegeton grimoire',
    aliases: ['book', 'grimoire', 'lemegeton'],
    takeable: true,
    description: 'An ancient grimoire containing forbidden knowledge of spirit summoning.',
    use: (engine) => {
      // Using the book triggers a random read
      const book = engine.world.items.get('lemegeton');
      const randomPage = Math.floor(Math.random() * (book.state?.length || 50)) + 1;
      engine.printLine(`You open the Lemegeton:`);
      return readPage(randomPage, engine, book);
    }
  }
];

if (typeof window !== 'undefined') {
  window.LemegetonItems = LemegetonItems;
}
