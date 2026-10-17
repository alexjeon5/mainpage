import { loadJSON, esc, t } from './utils.js';

const attr = value => esc(value).replace(/"/g, '&quot;');
// Only the greeting's documented accent span is allowed through as markup.
const greeting = value => esc(value).replace(/&lt;span class="accent"&gt;/g, '<span class="accent">').replace(/&lt;\/span&gt;/g, '</span>');

export class HeroTerminal {
  constructor(rootId, i18n) {
    this.root = document.getElementById(rootId);
    this.i18n = i18n;
    this.hasRendered = false;
    this.timers = [];
    this.generation = 0;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.root?.addEventListener('focusin', () => this.finish());
    document.addEventListener('keydown', () => this.finish());
    this.motion.addEventListener('change', () => { if (this.motion.matches) this.finish(); });
  }

  finish() {
    this.skip = true;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (!this.root) return;
    this.root.dataset.state = 'done';
    this.root.querySelectorAll('[data-command]').forEach(el => { el.textContent = el.dataset.command; });
    this.root.querySelectorAll('.term-pending').forEach(el => el.classList.remove('term-pending'));
  }

  async render(lang = 'ko') {
    if (!this.root) return;
    const generation = ++this.generation;
    const animate = !this.hasRendered && !this.skip && !this.motion.matches;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    try {
      const services = await loadJSON('assets/data/services.json');
      if (generation !== this.generation) return;
      const label = key => this.i18n.get(`hero.${key}`) || '';
      const command = key => `<span class="visually-hidden">${esc(label(key))}</span><span aria-hidden="true" data-command="${attr(label(key))}">${esc(label(key))}</span>`;
      const prompt = `<span class="term-prompt">${esc(label('prompt'))}</span>`;
      this.root.innerHTML = `<div class="term-bar"><span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${esc(label('terminal'))}</span></div>
        <div class="term-body"><div class="term-command">${prompt} ${command('whoami')}</div>
        <div class="term-profile term-output"><img src="assets/img/opt/profile.webp" alt="${attr(label('alt'))}" width="112" height="112" fetchpriority="high" decoding="async"><div><h1>${greeting(label('hello'))}</h1><p>${esc(label('sub'))}</p></div></div>
        <div class="term-command term-second">${prompt} ${command('services')}</div>
        <div class="term-links term-output">${services.items.filter(item => !item.hidden && item.status === 'online').map(item => `<a data-term-link href="${attr(item.href)}"${item.external ? ' target="_blank" rel="noopener"' : ''}>${esc(t(item.slug, lang))}</a>`).join('')}</div>
        <div class="term-last">${prompt} <span class="term-cursor" aria-hidden="true"></span></div></div>`;
      this.hasRendered = true;
      if (!animate || this.skip || this.motion.matches) { this.finish(); return; }
      this.root.dataset.state = 'typing';
      const commands = this.root.querySelectorAll('[data-command]');
      const outputs = this.root.querySelectorAll('.term-output');
      const second = this.root.querySelector('.term-second');
      const last = this.root.querySelector('.term-last');
      [...outputs, second, last].forEach(el => el.classList.add('term-pending'));
      let delay = 0;
      const later = (fn, at) => this.timers.push(setTimeout(fn, at));
      commands.forEach((el, index) => {
        const text = el.dataset.command;
        el.textContent = '';
        if (index) later(() => second.classList.remove('term-pending'), delay);
        for (let n = 1; n <= text.length; n++) later(() => { el.textContent = text.slice(0, n); }, delay + n * 45);
        delay += text.length * 45 + 350;
        later(() => outputs[index].classList.remove('term-pending'), delay);
        delay += 350;
      });
      later(() => this.finish(), delay);
    } catch {
      if (generation !== this.generation) return;
      this.root.textContent = this.i18n.get('global.load_error');
      this.finish();
    }
  }
}

export class StatsRenderer {
  constructor(rootId, i18n) { this.root = document.getElementById(rootId); this.i18n = i18n; }
  async render() {
    if (!this.root) return;
    try {
      const [about, services, portfolio, timeline] = await Promise.all(['about', 'services', 'portfolio', 'timeline'].map(name => loadJSON(`assets/data/${name}.json`)));
      const first = timeline.timeline.map(entry => entry.date).sort()[0]?.slice(0, 7) || '—';
      const values = { servers: about.servers.length, services: services.items.filter(item => !item.hidden && item.status === 'online').length, versions: portfolio.versions.length, first };
      this.root.innerHTML = Object.entries(values).map(([key, value]) => `<div class="stat" role="listitem"><span class="stat-value">${esc(value)}</span><span class="stat-label">${esc(this.i18n.get(`stats.${key}`))}</span></div>`).join('');
    } catch { this.root.textContent = this.i18n.get('global.load_error'); }
  }
}
