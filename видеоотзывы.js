(() => {
  const reel = document.querySelector('.video-review-reel');
  const dialog = document.getElementById('review-viewer');
  if (!reel || !dialog || typeof dialog.showModal !== 'function') return;
  const track = reel.querySelector('.review-video-track');
  const cards = [...reel.querySelectorAll('.review-video-open')];
  const previous = reel.querySelector('[data-reel-step="-1"]');
  const next = reel.querySelector('[data-reel-step="1"]');
  const video = dialog.querySelector('video');
  const close = dialog.querySelector('.review-viewer-close');
  const note = dialog.querySelector('.review-viewer-note');
  const fallback = dialog.querySelector('.review-viewer-fallback');
  const title = dialog.querySelector('#review-viewer-title');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let opener;
  let session = 0;
  let oldOverflow = '';
  let oldPadding = '';

  const updateNavigation = () => {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const step = direction => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * ((track.firstElementChild?.getBoundingClientRect().width || 280) + gap),
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  };
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  track.addEventListener('scroll', updateNavigation, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
  });
  addEventListener('resize', updateNavigation, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(updateNavigation).observe(track);

  const showNote = (message, offerLink = false) => {
    note.textContent = message;
    note.hidden = false;
    fallback.hidden = !offerLink;
  };
  cards.forEach((card, index) => card.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = card;
    const currentSession = ++session;
    note.hidden = true;
    fallback.hidden = true;
    fallback.href = card.href;
    title.textContent = `Видеоотзыв зрителей ${index + 1}`;
    video.setAttribute('aria-label', title.textContent);
    video.poster = card.dataset.reviewPoster;
    video.src = card.href;
    oldOverflow = document.body.style.overflow;
    oldPadding = document.body.style.paddingRight;
    const scrollbar = innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${(parseFloat(getComputedStyle(document.body).paddingRight) || 0) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    close.focus({ preventScroll: true });
    const playback = video.play();
    playback?.catch(error => {
      if (!dialog.open || currentSession !== session || error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') showNote('Нажмите кнопку воспроизведения в плеере, чтобы посмотреть отзыв.');
      else showNote('Не удалось запустить видео. Попробуйте открыть его отдельно.', true);
    });
  }));
  video.addEventListener('playing', () => { note.hidden = true; fallback.hidden = true; });
  video.addEventListener('error', () => {
    if (dialog.open && video.getAttribute('src')) showNote('Видео не удалось загрузить. Попробуйте открыть его отдельно.', true);
  });
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
  });
  close.addEventListener('click', () => dialog.close());
  let backdropDown = false;
  dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (event.target === dialog && backdropDown) dialog.close();
    backdropDown = false;
  });
  dialog.addEventListener('close', () => {
    session++;
    video.pause();
    video.removeAttribute('src');
    video.load();
    note.hidden = true;
    fallback.hidden = true;
    document.body.style.overflow = oldOverflow;
    document.body.style.paddingRight = oldPadding;
    opener?.focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && dialog.open) video.pause(); });
  updateNavigation();
})();
