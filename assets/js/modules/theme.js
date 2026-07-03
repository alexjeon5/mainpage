/* ── theme.js ── 다크/라이트 테마 관리 ── */

const KEY = 'hanggok-theme';

export class Theme {
  constructor() {
    this.root = document.documentElement;
    this.apply(this._initial());
  }

  _initial() {
    try { const s = localStorage.getItem(KEY); if (s === 'dark' || s === 'light') return s; } catch {}
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  get current() { return this.root.getAttribute('data-theme') || 'light'; }

  apply(theme) {
    this.root.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#161512' : '#f7f5f0';
    const label = document.getElementById('theme-label');
    if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }

  toggle() {
    const next = this.current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    try { localStorage.setItem(KEY, next); } catch {}
  }

  bind() {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => this.toggle());
  }
}
