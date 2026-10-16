/* Lucian UX/UI Prompt #219 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#219 */
const KEY = 'hanggok-theme';

export class Theme {
  constructor() {
    this.root = document.documentElement;
    this.system = matchMedia('(prefers-color-scheme: dark)');
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.transition = null;
    this.apply(this._stored() || (this.system.matches ? 'dark' : 'light'));
  }

  _stored() {
    try {
      const value = localStorage.getItem(KEY);
      if (value === 'dark' || value === 'light') return value;
    } catch {}
    return null;
  }

  get current() { return this.root.getAttribute('data-theme') || 'light'; }

  apply(theme, persist = false) {
    const dark = theme === 'dark';
    this.root.setAttribute('data-theme', theme);
    this.root.style.colorScheme = theme;
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch {}
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#07080D' : '#F4F2EE';
    const button = document.getElementById('theme-toggle');
    button?.setAttribute('aria-pressed', String(dark));
    button?.setAttribute('aria-label', dark ? '라이트 모드로 전환' : '다크 모드로 전환');
  }

  toggle() {
    this.transition?.skipTransition();
    const next = (this.requested || this.current) === 'dark' ? 'light' : 'dark';
    this.requested = next;
    if (!document.startViewTransition || this.motion.matches) {
      this.apply(next, true);
      this.requested = null;
      return;
    }
    const rect = document.getElementById('theme-toggle').getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => this.apply(next, true));
    this.transition = transition;
    transition.ready.then(() => {
      this.root.animate({
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
      }, {
        duration: 700,
        easing: 'cubic-bezier(.65,0,.35,1)',
        pseudoElement: '::view-transition-new(root)',
      });
    }).catch(() => {});
    transition.finished.catch(() => {}).then(() => {
      if (this.transition === transition) {
        this.transition = null;
        this.requested = null;
      }
    });
  }

  bind() {
    if (this.bound) return;
    this.bound = true;
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggle());
    this.system.addEventListener('change', event => {
      if (!this._stored()) {
        this.transition?.skipTransition();
        this.apply(event.matches ? 'dark' : 'light');
      }
    });
  }
}
