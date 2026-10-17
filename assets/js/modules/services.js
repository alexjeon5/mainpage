/* Lucian UX/UI Prompt #276 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#276 */
import { loadJSON, esc, t } from './utils.js';

const attr = value => esc(value).replace(/"/g, '&quot;');

export class ServicesRenderer {
  constructor(listId, i18n) {
    this.list = document.getElementById(listId);
    this.block = this.list?.closest('.live-block');
    this.i18n = i18n;
    this.current = -1;
    this.pos = { x: 0, y: 0 };
    this.spring = { x: 0, y: 0 };
    this.raf = 0;
    this.generation = 0;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.touch = matchMedia('(hover: none)');
    if (!this.block) return;
    // The block and preview persist across language changes; bind only once.
    this.preview = document.createElement('div');
    this.preview.className = 'live-preview';
    this.preview.setAttribute('aria-hidden', 'true');
    this.strip = document.createElement('div');
    this.strip.className = 'live-preview-strip';
    this.preview.append(this.strip);
    this.block.append(this.preview);
    this.block.addEventListener('pointermove', event => this.move(event));
    this.block.addEventListener('pointerleave', () => { this.pick(-1); this.seen = false; });
    this.block.addEventListener('focusin', event => {
      const row = event.target.closest('.live-row');
      if (!row || this.touch.matches || !row.matches(':focus-visible')) return;
      const rect = row.getBoundingClientRect(), root = this.block.getBoundingClientRect();
      this.pos.x = rect.right - root.left - this.preview.offsetWidth - 34;
      this.pos.y = rect.top - root.top + rect.height / 2;
      this.pick(Number(row.dataset.index));
      this.kick();
    });
    this.block.addEventListener('focusout', event => { if (!this.block.contains(event.relatedTarget)) { this.pick(-1); this.seen = false; } });
    this.touch.addEventListener('change', () => { if (this.touch.matches) this.pick(-1); });
  }

  async render(lang = 'ko') {
    if (!this.list) return;
    const generation = ++this.generation;
    try {
      const data = await loadJSON('assets/data/services.json');
      if (generation !== this.generation) return;
      this.pick(-1);
      const items = data.items.filter(item => !item.hidden);
      this.list.innerHTML = items.map((item, index) => `<li><a class="live-row${item.status === 'soon' ? ' live-row--soon srv-error' : ''}" data-index="${index}" href="${attr(item.status === 'soon' ? '#' : item.href)}"${item.external ? ' target="_blank" rel="noopener"' : ''}><span class="live-title">${esc(t(item.title, lang))}</span><span class="live-desc">${esc(t(item.desc, lang))}</span><span class="live-category">${esc(t(item.cat, lang))}</span><i class="live-arrow" aria-hidden="true">↗</i></a></li>`).join('');
      this.rows = [...this.list.querySelectorAll('.live-row')];
      // Populate the strip once. Preview art/categories are language-independent.
      if (!this.strip.childElementCount) this.strip.innerHTML = items.map(item => `<div class="live-preview-tile">${item.thumb ? `<img src="${attr(item.thumb)}" alt="" loading="lazy">` : `<span>${esc(t(item.cat, lang))}</span>`}</div>`).join('');
    } catch { if (generation === this.generation) this.list.innerHTML = `<li class="live-error">${esc(this.i18n.get('global.load_error'))}</li>`; }
  }

  pick(index) {
    if (index === this.current) return;
    this.current = index;
    this.rows?.forEach((row, i) => row.classList.toggle('is-on', i === index));
    this.list.classList.toggle('is-hovered', index >= 0);
    this.preview.classList.toggle('is-on', index >= 0);
    if (index >= 0) this.strip.style.transform = `translateY(${-index * this.preview.offsetHeight}px)`;
    else { cancelAnimationFrame(this.raf); this.raf = 0; }
  }

  move(event) {
    if (this.touch.matches || event.pointerType === 'touch') { this.pick(-1); return; }
    const root = this.block.getBoundingClientRect();
    this.pos.x = event.clientX - root.left;
    this.pos.y = event.clientY - root.top;
    const row = event.target.closest('.live-row');
    this.pick(row ? Number(row.dataset.index) : -1);
    if (this.current >= 0) this.kick();
  }

  target() {
    return {
      x: Math.max(16, Math.min(this.block.clientWidth - this.preview.offsetWidth - 16, this.pos.x + 18)),
      y: Math.max(16, Math.min(this.block.clientHeight - this.preview.offsetHeight - 16, this.pos.y - this.preview.offsetHeight / 2))
    };
  }

  kick() {
    if (!this.seen) { this.spring = this.target(); this.seen = true; }
    if (!this.raf) { this.last = performance.now(); this.raf = requestAnimationFrame(now => this.frame(now)); }
  }

  frame(now) {
    this.raf = 0;
    if (!this.block.isConnected || this.current < 0) return;
    const dt = Math.min(0.033, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    const target = this.target();
    const k = this.motion.matches ? 1 : Math.min(1, dt * 9);
    const nx = this.spring.x + (target.x - this.spring.x) * k;
    const velocity = (nx - this.spring.x) / Math.max(dt, 0.001);
    this.spring.x = nx;
    this.spring.y += (target.y - this.spring.y) * k;
    const tilt = this.motion.matches ? 0 : Math.max(-12, Math.min(12, velocity * 0.02));
    this.preview.style.left = `${this.spring.x.toFixed(1)}px`;
    this.preview.style.top = `${this.spring.y.toFixed(1)}px`;
    this.preview.style.rotate = `${tilt.toFixed(2)}deg`;
    if (Math.abs(target.x - this.spring.x) + Math.abs(target.y - this.spring.y) > 0.5 || Math.abs(tilt) > 0.2) this.raf = requestAnimationFrame(time => this.frame(time));
  }
}
