/* ── timeline.js ── 타임라인 + 향후 계획 동적 렌더 ── */

import { loadJSON } from './utils.js';

export class TimelineRenderer {
  constructor(timelineId, plansId) {
    this.tlEl = document.getElementById(timelineId);
    this.plEl = document.getElementById(plansId);
  }

  async render(lang = 'ko') {
    if (!this.tlEl) return;
    const file = lang === 'en' ? 'assets/data/timeline_en.json' : 'assets/data/timeline.json';

    try {
      const data = await loadJSON(file);

      this.tlEl.innerHTML = (data.timeline || []).map(item =>
        `<div class="tl-row"><span class="tl-date">${item.date}</span><span class="tl-text">${item.text}</span></div>`
      ).join('');

      if (this.plEl) {
        this.plEl.innerHTML = (data.plans || []).map(text =>
          `<li class="plans-item">${text}</li>`
        ).join('');
      }
    } catch (err) {
      console.error('Timeline load error:', err);
      this.tlEl.innerHTML = `<div class="tl-loading">${lang === 'en' ? 'Failed to load.' : '불러올 수 없습니다.'}</div>`;
    }
  }
}
