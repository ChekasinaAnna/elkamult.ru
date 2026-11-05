(() => {
  const section = document.querySelector('.family-story');
  const heading = section?.querySelector('.reviews-grid');
  const card = section?.querySelector('.audience-strip > figure');
  if (!heading || !card || !window.matchMedia) return;

  // Текст остаётся закреплённым, как в «Детском счастье».
  // Под доступную высоту подстраивается фотография, а не фиксация текста.
  const enabled = matchMedia('(min-width: 1101px) and (prefers-reduced-motion: no-preference)');
  let queued = false;
  const update = () => {
    queued = false;
    section.classList.toggle('has-pinned-heading', enabled.matches);
    if (!enabled.matches) {
      heading.classList.remove('is-pinned');
      section.style.removeProperty('--moments-card-top');
      section.style.removeProperty('--moments-card-height');
      return;
    }
    const top = Math.ceil(88 + heading.offsetHeight + 24);
    const referenceHeight = Math.min(460, Math.max(380, innerHeight * .46));
    const availableHeight = innerHeight - top - 28 - 24;
    section.style.setProperty('--moments-card-height', `${Math.max(160, Math.min(referenceHeight, availableHeight))}px`);
    section.style.setProperty('--moments-card-top', `${top}px`);
    const rect = heading.getBoundingClientRect();
    heading.classList.toggle('is-pinned', rect.top <= 89 && rect.bottom > 88);
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  enabled.addEventListener('change', schedule);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(heading);
  }
  document.fonts?.ready.then(schedule);
  update();
})();
