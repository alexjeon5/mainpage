/* ── about.js ── About 섹션 동적 렌더 ── */

import { loadJSON, esc, t } from './utils.js';

export class AboutRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  async render(lang = 'ko') {
    if (!this.container) return;
    const data = await loadJSON('assets/data/about.json');
    let html = '';

    // 개인 정보 열
    const p = data.personal;
    html += `<div class="about-col"><div class="about-label">${esc(p.label)}</div><div class="info-list">`;
    for (const row of p.rows) {
      html += `<div class="info-row"><span class="info-k">${esc(t(row.key, lang))}</span><span class="info-v">${esc(t(row.value, lang))}</span></div>`;
    }
    html += '</div></div>';

    // 서버 열들
    for (const srv of data.servers) {
      html += `<div class="about-col"><div class="about-label">${esc(srv.label)}</div><div class="spec-list">`;
      for (const row of srv.rows) {
        html += `<div class="spec-row"><span class="spec-k">${esc(t(row.key, lang))}</span><span class="spec-v">${esc(t(row.value, lang))}</span></div>`;
      }
      html += '</div></div>';
    }

    this.container.innerHTML = html;
  }
}
