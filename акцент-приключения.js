(() => {
  const paragraph = document.querySelector('#about .adventure-invitation');
  if (!paragraph || !window.matchMedia) return;
  const desktop = window.matchMedia('(min-width: 1101px)');
  const original = paragraph.textContent;
  const target = 'большого приключения';
  const index = original.indexOf(target);
  if (index < 0) return;
  const update = () => {
    if (!desktop.matches) { paragraph.textContent = original; return; }
    if (paragraph.querySelector('.adventure-highlight')) return;
    const accent = document.createElement('span');
    accent.className = 'adventure-highlight';
    accent.textContent = target;
    paragraph.replaceChildren(document.createTextNode(original.slice(0, index)), accent, document.createTextNode(original.slice(index + target.length)));
  };
  update();
  desktop.addEventListener('change', update);
})();