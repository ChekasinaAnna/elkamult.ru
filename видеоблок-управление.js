(() => {
  const section = document.querySelector('#video');
  if (!section) return;

  // Создаём оба края независимо от начальной ширины окна; их видимость задаёт CSS.
  for (const edge of ['top', 'bottom']) {
    if (section.querySelector(`.video-cloud-bridge-${edge}`)) continue;
    const cloud = document.createElement('div');
    cloud.className = `video-cloud-bridge video-cloud-bridge-${edge}`;
    cloud.setAttribute('aria-hidden', 'true');
    if (edge === 'top') section.prepend(cloud);
    else section.append(cloud);
  }

  const frame = section?.querySelector('.video-frame');
  const video = frame?.querySelector('video');
  if (!section || !frame || !video) return;

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.className = 'video-play-button';
  playButton.setAttribute('aria-label', 'Воспроизвести видео о шоу');
  frame.append(playButton);

  const showPlayButton = () => {
    frame.classList.remove('is-playing');
    playButton.hidden = false;
    playButton.setAttribute('aria-label', video.ended ? 'Воспроизвести видео ещё раз' : video.currentTime > 0 ? 'Продолжить воспроизведение видео' : 'Воспроизвести видео о шоу');
  };

  playButton.addEventListener('click', () => {
    if (video.ended) video.currentTime = 0;
    video.play().catch(showPlayButton);
  });

  video.addEventListener('playing', () => {
    frame.classList.add('is-playing');
    playButton.hidden = true;
  });
  video.addEventListener('pause', showPlayButton);
  video.addEventListener('ended', showPlayButton);
  video.addEventListener('error', showPlayButton);

  // Кнопка доступна при любой ширине; композиция секции меняется только на десктопе.
  if (!window.matchMedia('(min-width: 1101px)').matches) return;
  const caption = section.querySelector('.video-caption');
  const action = caption?.querySelector('a[href="#tickets"]');
  const copy = section.querySelector('.cast-heading-copy');
  if (!caption || !action || !copy) return;

  action.classList.add('button', 'video-primary-cta');
  copy.append(action);
  caption.remove();

})();
