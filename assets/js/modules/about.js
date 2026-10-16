import { loadJSON, esc, t } from './utils.js';

export class AboutRenderer {
  constructor(rootId, i18n) { this.root = document.getElementById(rootId); this.i18n = i18n; this.generation = 0; }
  async render(lang = 'ko') {
    if (!this.root) return;
    const generation = ++this.generation;
    try {
      const data = await loadJSON('assets/data/about.json');
      if (generation !== this.generation) return;
      this.root.innerHTML = data.servers.map((server, index) => `${index ? `<div class="lab-connector"><span>${esc(this.i18n.get('lab.connector'))}</span><i aria-hidden="true"></i></div>` : ''}<article class="lab-card${index ? ' lab-card--inverse' : ''}">
        <div class="lab-heading"><div><span class="lab-label">${esc(server.label)}</span><h3>${esc(server.hw)}</h3></div><span class="lab-badge">${esc(t(server.badge, lang))}</span></div>
        <p class="lab-role">${esc(t(server.role, lang))}</p>
        <dl class="lab-spec">${server.spec.map(spec => `<div><dt>${esc(spec.key)}</dt><dd>${esc(t(spec.value, lang))}</dd></div>`).join('')}</dl>
        <div class="lab-apps"><span class="lab-apps-label">${esc(this.i18n.get('lab.public'))}</span><div>${server.apps.map(app => `<span class="lab-app">${esc(t(app, lang))}</span>`).join('')}</div></div></article>`).join('');
    } catch { if (generation === this.generation) this.root.textContent = this.i18n.get('global.load_error'); }
  }
}
