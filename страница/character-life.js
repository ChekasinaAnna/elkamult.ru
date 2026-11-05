(() => {
  // Cutouts breathe individually; the integrated poster has a smaller, unified movement.
  if (!('IntersectionObserver' in window) || !CSS.supports('scale', '1')) return;
  const figures = [...document.querySelectorAll('.cast-art:not(.tractor-guide) > img, .character-image > img, .brand-hero-layer > img, .violin-scene, .faq-companions > img, .hero-animated-layer:not(.hero-layer-show-logo):not(.hero-layer-wheel-logo)')];
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rest = () => document.documentElement.classList.toggle('characters-resting', document.hidden || preference.matches || [...document.querySelectorAll('video')].some(video => !video.paused && !video.ended));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('life-visible', entry.isIntersecting));
  }, { threshold: 0 });
  let calendarPhase = 0;
  figures.forEach((figure, index) => {
    figure.classList.add('life-character');
    const calendar = figure.classList.contains('date-card');
    const leaf = calendar ? calendarPhase++ : 0;
    const poster = figure.classList.contains('hero-animated-layer');
    figure.style.setProperty('--life-duration', `${14 + index % 4 * 2}s`);
    figure.style.setProperty('--life-delay', `${calendar ? [-.2, -2.2, -4.2][leaf % 3] : -index * 1.7}s`);
    figure.style.setProperty('--life-sway', poster ? '0deg' : calendar ? ['.7deg', '-.8deg', '.65deg'][leaf % 3] : `${index % 2 ? '-' : ''}.45deg`);
    if (/plane|broom/.test(figure.getAttribute('src') || '')) figure.style.setProperty('--life-rise', '-2px');
    observer.observe(figure);
  });
  document.querySelectorAll('.galaxy-orbit, .poster-wheel-orbit, .poster-confetti-orbit, .tractor-smoke, .tractor-guide, .hero-hand-snow, .nav-wheel').forEach(layer => observer.observe(layer));
  document.addEventListener('visibilitychange', rest);
  preference.addEventListener('change', rest);
  document.querySelectorAll('video').forEach(video => ['play', 'pause', 'ended'].forEach(event => video.addEventListener(event, rest)));
  rest();
})();
