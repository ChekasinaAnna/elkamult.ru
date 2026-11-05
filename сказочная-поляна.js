(() => {
  'use strict';
  const scriptURL = document.currentScript?.src;
  const scene = document.querySelector('#about .intro-cast');
  const mount = document.querySelector('#about > .scene-stars');
  if (!scriptURL || !scene || !mount || !window.matchMedia || !window.IntersectionObserver) return;
  const desktop = window.matchMedia('(min-width: 1101px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let starting = false;
  let failed = false;
  let revision = 0;
  let active;
  let library;
  const eligible = () => desktop.matches && !reduce.matches && !document.hidden && visible;
  const stop = () => {
    revision += 1;
    active?.destroy();
    active = undefined;
    if (!desktop.matches && mount.id === 'mult-about-sparkles') mount.removeAttribute('id');
  };
  const loadScript = filename => new Promise((resolve, reject) => {
    const element = document.createElement('script');
    element.src = new URL(`assets/библиотеки/tsparticles/${filename}`, scriptURL).href;
    element.onload = resolve;
    element.onerror = () => reject(new Error('Particle library unavailable'));
    document.head.append(element);
  });
  const loadLibrary = () => {
    library ??= (async () => {
      await loadScript('tsparticles.engine.min.js');
      await loadScript('tsparticles.slim.bundle.min.js');
      if (!window.tsParticles || typeof window.loadSlim !== 'function') throw new Error('Particle API unavailable');
      await window.loadSlim(window.tsParticles);
      return window.tsParticles;
    })();
    return library;
  };
  const start = async () => {
    if (!eligible() || starting || active || failed) return;
    const token = ++revision;
    starting = true;
    try {
      const engine = await loadLibrary();
      if (token !== revision || !eligible()) return;
      mount.id = 'mult-about-sparkles';
      const container = await engine.load({
        id: mount.id,
        options: {
          autoPlay: false,
          fullScreen: {enable: false},
          fpsLimit: 30,
          detectRetina: true,
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          background: {color: {value: 'transparent'}},
          particles: {
            number: {value: 26},
            color: {value: ['#ffffff', '#fff2c4', '#e2efff']},
            shape: {type: 'circle'},
            opacity: {value: {min: 0.25, max: 0.8}},
            size: {value: {min: 1, max: 3}},
            move: {enable: true, direction: 'bottom', speed: {min: 0.4, max: 0.8}, straight: false, outModes: {default: 'out'}}
          },
          interactivity: {events: {onHover: {enable: false}, onClick: {enable: false}}}
        }
      });
      if (!container) throw new Error('Particle scene unavailable');
      if (token !== revision || !eligible()) {container.destroy(); return;}
      active = container;
      container.play();
    } catch {
      failed = true;
      stop();
    } finally {
      starting = false;
      if (!active && !failed && eligible() && token !== revision) void start();
    }
  };
  const update = () => {if (eligible()) void start(); else stop();};
  const observer = new window.IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    update();
  }, {threshold: 0.2});
  observer.observe(scene);
  desktop.addEventListener('change', update);
  reduce.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', stop);
})();
