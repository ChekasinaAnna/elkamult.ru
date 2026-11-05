(() => {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.querySelectorAll('.evidence-benefits > article, .cast-live-gallery > figure, .live-moments > figure, .photo-grid > figure, .review-emotion, .audience-strip > figure, .final-emotion').forEach(frame => {
    const photo = frame.querySelector(':scope > img');
    if (!photo) return;
    photo.classList.add('photo-depth-image');
    let bounds, pending = 0, x = 0, y = 0;
    const clear = () => {
      cancelAnimationFrame(pending); pending = 0;
      frame.classList.remove('photo-depth-active');
      photo.style.setProperty('--photo-x', '0'); photo.style.setProperty('--photo-y', '0');
    };
    frame.addEventListener('pointerenter', () => { bounds = frame.getBoundingClientRect(); frame.classList.add('photo-depth-active'); });
    frame.addEventListener('pointermove', event => {
      if (!bounds) return;
      x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      if (!pending) pending = requestAnimationFrame(() => { photo.style.setProperty('--photo-x', x.toFixed(3)); photo.style.setProperty('--photo-y', y.toFixed(3)); pending = 0; });
    });
    frame.addEventListener('pointerleave', clear); frame.addEventListener('pointercancel', clear);
  });
})();
