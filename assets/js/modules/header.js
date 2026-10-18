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
  toggle.addEventListener('click', event => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
    // 메뉴 버튼은 Tab 순서상 메뉴 링크 뒤에 있으므로, 키보드로 열었을 때는 첫 링크로 포커스를 옮긴다.
    if (open && event.detail === 0) nav.querySelector('a')?.focus({ preventScroll: true });
  });
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
