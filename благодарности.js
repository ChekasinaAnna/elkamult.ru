(() => {
  const reel = document.querySelector('.thanks-reel');
  const dialog = document.getElementById('thanks-viewer');
  if (!reel || !dialog) return;
  const track = reel.querySelector('.thanks-track');
  const previous = reel.querySelector('[data-thanks-step="-1"]');
  const next = reel.querySelector('[data-thanks-step="1"]');
  const close = dialog.querySelector('.review-viewer-close');
  const image = dialog.querySelector('.thanks-viewer-image');
  const title = dialog.querySelector('.thanks-viewer-title');
  const description = dialog.querySelector('.thanks-viewer-description');
  const fallback = dialog.querySelector('.review-viewer-fallback');
  const note = dialog.querySelector('[role="status"]');
  const desktop = matchMedia('(min-width: 1101px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opener, oldOverflow, oldPadding;
  const update = () => {
    previous.disabled = track.scrollLeft <= (parseFloat(getComputedStyle(track).paddingLeft) || 0) + 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const move = direction => track.scrollBy({
    left: direction * (track.firstElementChild.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0)),
    behavior: reduced.matches ? 'instant' : 'smooth'
  });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reduced.matches ? 'instant' : 'smooth' });
    }
  });
  reel.querySelectorAll('.thanks-document-open').forEach(link => link.addEventListener('click', event => {
    if (!desktop.matches || typeof dialog.showModal !== 'function' || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    title.textContent = link.querySelector('.thanks-document-name').textContent;
    description.textContent = link.querySelector('.thanks-document-description').textContent;
    image.alt = title.textContent;
    image.src = link.href;
    note.hidden = true;
    fallback.href = link.href;
    oldOverflow = document.body.style.overflow;
    oldPadding = document.body.style.paddingRight;
    const scrollbar = innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${(parseFloat(getComputedStyle(document.body).paddingRight) || 0) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    close.focus({ preventScroll: true });
  }));
  image.addEventListener('error', () => { if (dialog.open) note.hidden = false; });
  close.addEventListener('click', () => dialog.close());
  let backdropDown = false;
  dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (event.target === dialog && backdropDown) dialog.close();
    backdropDown = false;
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = oldOverflow;
    document.body.style.paddingRight = oldPadding;
    image.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });
  desktop.addEventListener('change', () => { if (!desktop.matches && dialog.open) dialog.close(); update(); });
  addEventListener('resize', update, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  update();
})();
