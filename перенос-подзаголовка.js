(() => {
  const paragraph = document.querySelector('#about .show-scale-heading > p:last-child');
  if (!paragraph || !window.matchMedia) return;
  const desktop = window.matchMedia('(min-width: 1101px)');
  const original = paragraph.textContent;
  const index = original.indexOf('соединяются');
  if (index < 0) return;
  const update = () => {
    if (!desktop.matches) { paragraph.textContent = original; return; }
    paragraph.replaceChildren(document.createTextNode(original.slice(0, index)), document.createElement('br'), document.createTextNode(original.slice(index)));
  };
  update();
  desktop.addEventListener('change', update);
})();