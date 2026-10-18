/* Lucian UX/UI Prompt #267 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#267 */
import { loadJSON } from './utils.js';

const KEY = 'hanggok-lang';

export class I18n {
  constructor() {
    this.lang = 'ko';
    this.dict = {};
    this.listeners = [];
    this.generation = 0;
    this.timers = new Set();
    this.swaps = new Map();
    this.initialized = false;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
  }

  onChange(fn) { this.listeners.push(fn); }

  get(path) {
    return path.split('.').reduce((value, key) => value?.[key] ?? null, this.dict);
  }

  _later(fn, delay, generation) {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (generation === this.generation) fn();
    }, delay);
    this.timers.add(timer);
  }

  _cancelSwaps() {
    this.timers.forEach(clearTimeout);
    this.timers.clear();
    this.swaps.forEach((html, element) => { element.innerHTML = html; });
    this.swaps.clear();
  }

  applyToDOM(animate = false) {
    this._cancelSwaps();
    const generation = this.generation;
    const entries = [...document.querySelectorAll('[data-i18n]')].map(element => ({
      element,
      html: this.get(element.dataset.i18n),
      rect: element.getBoundingClientRect(),
    })).filter(entry => entry.html != null);
    const animated = animate && !this.motion.matches
      ? entries.filter(({ element, rect }) => {
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight
          && rect.right > 0 && rect.left < innerWidth && style.visibility === 'visible'
          && style.opacity !== '0' && !element.closest('[hidden]');
      }).sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left).slice(0, 10)
      : [];
    const indices = new Map(animated.map((entry, index) => [entry.element, index]));
    entries.forEach(({ element, html }) => {
      const index = indices.get(element);
      if (index == null || element.innerHTML === html) {
        element.innerHTML = html;
        return;
      }
      const wrapper = document.createElement('span');
      wrapper.className = 'lx-lang-sw';
      const text = document.createElement('span');
      text.innerHTML = element.innerHTML;
      wrapper.appendChild(text);
      element.replaceChildren(wrapper);
      this.swaps.set(element, html);
      this._later(() => {
        wrapper.classList.add('is-go');
        this._later(() => {
          text.innerHTML = html;
          wrapper.classList.remove('is-go');
          void wrapper.offsetWidth;
          wrapper.classList.add('is-in');
          this._later(() => {
            element.innerHTML = html;
            this.swaps.delete(element);
          }, 380, generation);
        }, 260, generation);
      }, index * 45, generation);
    });
  }

  async setLang(lang) {
    if (lang !== 'ko' && lang !== 'en') return;
    const generation = ++this.generation;
    this._cancelSwaps();
    let dict;
    try {
      dict = await loadJSON(`assets/lang/${lang}.json`);
    } catch (error) {
      if (generation === this.generation) console.error('i18n load error:', error);
      return;
    }
    if (generation !== this.generation) return;
    const animate = this.initialized && this.lang !== lang;
    this.lang = lang;
    this.dict = dict;
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch {}
    this._syncUI();
    this.applyToDOM(animate);
    // Renderers are notified immediately; the decorative text swap never blocks them.
    await Promise.all(this.listeners.map(fn => fn(lang)));
  }

  _syncUI() {
    const current = document.getElementById('lang-current');
    if (current) current.textContent = this.lang.toUpperCase();
    const toggle = document.getElementById('lang-toggle');
    toggle?.setAttribute('aria-label', this.lang === 'ko' ? 'KO · 언어 선택' : 'EN · Language');
    document.querySelectorAll('#lang-menu [data-lang]').forEach(option => {
      option.setAttribute('aria-selected', String(option.dataset.lang === this.lang));
    });
  }

  _bindUI() {
    const toggle = document.getElementById('lang-toggle');
    const menu = document.getElementById('lang-menu');
    if (!toggle || !menu || this.uiBound) return;
    this.uiBound = true;
    const options = [...menu.querySelectorAll('[data-lang]')];
    let closeTimer;
    let open = false;
    options.forEach(option => {
      option.tabIndex = -1;
      option.lang = option.dataset.lang;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('lx-lang-check');
      svg.innerHTML = '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
      option.appendChild(svg);
    });
    const focusOption = index => {
      const active = options[(index + options.length) % options.length];
      options.forEach(option => { option.tabIndex = option === active ? 0 : -1; });
      active?.focus({ preventScroll: true });
    };
    const setOpen = (value, restoreFocus = false) => {
      clearTimeout(closeTimer);
      open = value;
      toggle.setAttribute('aria-expanded', String(value));
      menu.inert = !value;
      if (value) {
        menu.hidden = false;
        void menu.offsetWidth;
        menu.classList.add('lx-lang-open');
      } else {
        menu.classList.remove('lx-lang-open');
        options.forEach(option => { option.tabIndex = -1; });
        if (this.motion.matches) menu.hidden = true;
        else closeTimer = setTimeout(() => { if (!open) menu.hidden = true; }, 250);
      }
      if (restoreFocus) toggle.focus({ preventScroll: true });
    };
    menu.hidden = true;
    menu.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
      setOpen(!open);
      if (open) focusOption(Math.max(0, options.findIndex(option => option.dataset.lang === this.lang)));
    });
    toggle.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setOpen(true);
        focusOption(event.key === 'ArrowUp' ? options.length - 1 : 0);
      }
    });
    options.forEach((option, index) => {
      const select = () => {
        setOpen(false, true);
        void this.setLang(option.dataset.lang);
      };
      option.addEventListener('click', select);
      option.addEventListener('keydown', event => {
        if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) event.preventDefault();
        if (event.key === 'ArrowDown') focusOption(index + 1);
        if (event.key === 'ArrowUp') focusOption(index - 1);
        if (event.key === 'Home') focusOption(0);
        if (event.key === 'End') focusOption(options.length - 1);
        if (event.key === 'Enter' || event.key === ' ') select();
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        setOpen(false, true);
      }
    });
    document.addEventListener('click', event => {
      if (open && !event.target.closest('.lang-switch')) setOpen(false);
    });
    document.addEventListener('focusin', event => {
      if (open && !event.target.closest('.lang-switch')) setOpen(false);
    });
    this._syncUI();
  }

  async init() {
    let saved;
    try { saved = localStorage.getItem(KEY); } catch {}
    await this.setLang(saved === 'en' ? 'en' : 'ko');
    this.initialized = true;
    this._bindUI();
  }
}
