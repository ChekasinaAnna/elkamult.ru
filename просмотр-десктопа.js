(() => {
  'use strict';
  const stage = document.querySelector('.desktop-stage');
  const frame = stage?.querySelector('iframe');
  if (!stage || !frame) return;
  const layout = () => {
    const available = stage.clientWidth;
    if (!available) return;
    const width = available >= 1101 ? available : 1440;
    const scale = available / width;
    frame.style.width = `${width}px`;
    frame.style.height = `${Math.ceil(stage.clientHeight / scale)}px`;
    frame.style.transform = `scale(${scale})`;
  };
  addEventListener('resize', layout, {passive: true});
  frame.addEventListener('load', layout);
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(stage);
  layout();
})();
