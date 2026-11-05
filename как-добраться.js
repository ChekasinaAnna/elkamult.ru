(() => {
  const section = document.querySelector('#venue');
  const grid = section?.querySelector('.venue-grid');
  if (!grid) return;

  const cards = [...grid.querySelectorAll('.festive-visit > article')];
  const stage = document.createElement('div');
  stage.className = 'venue-scroll-stage';
  grid.before(stage);
  stage.append(grid);

  const desktop = matchMedia('(min-width: 1101px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.header');
  const travel = 640;
  let active = false;
  let stickyTop = 0;
  let pending = 0;

  const clearCards = () => cards.forEach(card => {
    card.style.removeProperty('--venue-card-opacity');
    card.style.removeProperty('--venue-card-shift');
  });

  const render = () => {
    pending = 0;
    if (!active) return;
    const rect = stage.getBoundingClientRect();
    const distance = stickyTop - rect.top;
    stage.classList.toggle('is-in-view', rect.top < innerHeight && rect.bottom > 0);
    cards.forEach((card, index) => {
      // Интервалы не пересекаются: одна карточка заканчивает въезд до следующей.
      const start = -180 + index * 270;
      const progress = Math.max(0, Math.min(1, (distance - start) / 200));
      const eased = 1 - Math.pow(1 - progress, 3);
      card.style.setProperty('--venue-card-opacity', progress.toFixed(3));
      card.style.setProperty('--venue-card-shift', `${((1 - eased) * 96).toFixed(2)}px`);
    });
  };

  const requestRender = () => {
    if (active && !pending) pending = requestAnimationFrame(render);
  };

  const configure = () => {
    stickyTop = Math.ceil(header?.getBoundingClientRect().height || 0) + 24;
    const height = Math.ceil(grid.getBoundingClientRect().height);
    // Если композиция не помещается по высоте, остаётся обычное чтение страницы.
    active = desktop.matches && !reduced.matches && height + stickyTop + 24 <= innerHeight;
    stage.style.setProperty('--venue-sticky-top', `${stickyTop}px`);
    stage.style.setProperty('--venue-stage-height', `${height + travel}px`);
    stage.classList.toggle('is-scroll-active', active);
    if (active) render();
    else {
      stage.classList.remove('is-in-view');
      clearCards();
    }
  };

  addEventListener('scroll', requestRender, { passive: true });
  addEventListener('resize', configure);
  desktop.addEventListener('change', configure);
  reduced.addEventListener('change', configure);
  const observer = new ResizeObserver(configure);
  observer.observe(grid);
  if (header) observer.observe(header);
  document.fonts.ready.then(configure);
  configure();
})();
