const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('mobile-menu');
toggle.addEventListener('click', () => {
  const opened = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!opened));
  toggle.setAttribute('aria-label', opened ? 'Открыть меню' : 'Закрыть меню');
  menu.hidden = opened;
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Открыть меню');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    toggle.focus();
  }
});
document.querySelectorAll('video').forEach(video => video.addEventListener('play', () => {
  document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
}));
const bagView = document.getElementById('bag-view');
document.querySelectorAll('[data-bag-side]').forEach(button => button.addEventListener('click', () => {
  bagView.dataset.side = button.dataset.bagSide;
  document.querySelectorAll('[data-bag-side]').forEach(other => {
    const selected = other === button;
    other.classList.toggle('active', selected);
    other.setAttribute('aria-pressed', String(selected));
  });
}));

const corporateDialog = document.getElementById('corporate-details');
if (corporateDialog) {
  document.querySelectorAll('[data-open-corporate]').forEach(button => {
    button.addEventListener('click', () => corporateDialog.showModal());
  });
  corporateDialog.querySelector('[data-close-corporate]').addEventListener('click', () => corporateDialog.close());
  corporateDialog.addEventListener('click', event => {
    if (event.target !== corporateDialog) return;
    const box = corporateDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) corporateDialog.close();
  });
}
