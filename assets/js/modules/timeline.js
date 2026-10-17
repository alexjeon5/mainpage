import { loadJSON, esc, t } from './utils.js';

export class TimelineRenderer {
  constructor(listId, plansId, i18n) {
    this.list = document.getElementById(listId);
    this.plans = document.getElementById(plansId);
    this.i18n = i18n;
    this.generation = 0;
  }
  async render(lang = 'ko') {
    const generation = ++this.generation;
    try {
      const data = await loadJSON(`assets/data/timeline${lang === 'en' ? '_en' : ''}.json`);
      if (generation !== this.generation) return;
      if (this.list) this.list.innerHTML = [...data.timeline].sort((a, b) => b.date.localeCompare(a.date)).map(entry => `<li><span class="log-date">${esc(entry.date)}</span><span class="log-text">${esc(t(entry.text, lang))}</span></li>`).join('');
      if (this.plans) this.plans.innerHTML = data.plans.map(plan => `<li><h3>${esc(typeof plan === 'string' ? plan : t(plan.title, lang))}</h3>${typeof plan === 'string' || !plan.desc ? '' : `<p>${esc(t(plan.desc, lang))}</p>`}</li>`).join('');
    } catch {
      if (generation !== this.generation) return;
      [this.list, this.plans].forEach(el => { if (el) el.innerHTML = `<li>${esc(this.i18n.get('global.load_error'))}</li>`; });
    }
  }
}
