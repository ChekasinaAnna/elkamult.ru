(() => {
  const section = document.querySelector('.moments');
  const heading = section?.querySelector('.moments-cast');
  if (!heading || !window.matchMedia) return;

  const enabled = matchMedia('(min-width: 1101px) and (min-height: 860px) and (prefers-reduced-motion: no-preference)');
  let queued = false;

  const update = () => {
    queued = false;
    if (!enabled.matches) {
      heading.classList.remove('is-pinned');
      section.style.removeProperty('--moments-card-top');
      return;
    }
    const rect = heading.getBoundingClientRect();
    section.style.setProperty('--moments-card-top', `${Math.ceil(88 + rect.height + 24)}px`);
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
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(heading);
  document.fonts?.ready.then(schedule);
  update();
})();
