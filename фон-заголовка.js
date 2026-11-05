(() => {
  const panel = document.querySelector('#about .show-scale-panel');
  if (!panel || !window.matchMedia) return;
  const enabled = window.matchMedia('(min-width: 1101px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)');
  let queued = false;
  const update = () => {
    queued = false;
    if (!enabled.matches) { panel.classList.remove('is-pinned'); return; }
    const rect = panel.getBoundingClientRect();
    panel.classList.toggle('is-pinned', rect.top <= 89 && rect.bottom > 88);
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule, {passive: true});
  enabled.addEventListener('change', schedule);
  update();
})();