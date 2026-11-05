(() => {
  const media = window.matchMedia('(min-width: 1101px)');
  const original = [];
  for (const p of document.querySelectorAll('#about .evidence-benefits .benefit-copy p')) {
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) original.push([walker.currentNode, walker.currentNode.nodeValue]);
  }
  const update = () => {
    for (const [node, text] of original) {
      node.nodeValue = media.matches ? text.replace(/(^|[\s«(])([а-яё]) +(?=\S)/giu, '$1$2\u00a0') : text;
    }
  };
  update();
  media.addEventListener('change', update);
})();