/* Shared responsive navigation and scroll treatment. */
export function initHeader() {
  const header = document.getElementById('site-header');
  if (!header || header.dataset.headerBound) return;
  header.dataset.headerBound = 'true';
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  const syncScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  syncScroll();
  window.addEventListener('scroll', syncScroll, { passive: true });
  if (!toggle || !nav) return;

  const setOpen = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  };
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus({ preventScroll: true });
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
      const restoreFocus = document.activeElement === toggle;
      setOpen(false);
      if (restoreFocus) nav.querySelector('a')?.focus({ preventScroll: true });
    }
  }, { passive: true });
}
