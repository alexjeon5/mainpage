/* ── admin.js ── Admin 서비스 목록 동적 렌더 ── */

import { loadJSON, esc } from './utils.js';

export class AdminRenderer {
  constructor(rootId) {
    this.rootEl = document.getElementById(rootId);
  }

  async render() {
    if (!this.rootEl) return;
    try {
      const data = await loadJSON('assets/data/admin-services.json');
      let html = '';

      (data.groups || []).forEach((group, gi) => {
        const num = String(gi + 1).padStart(2, '0');
        html += `<section class="section admin-section"><div class="sec-head">`;
        html += `<span class="sec-num">${num}</span>`;
        html += `<h2 class="sec-title">${esc(group.server)}</h2>`;
        html += `<span class="sec-sub">${esc(group.label)}</span>`;
        html += `</div><div class="portfolio-grid">`;

        for (const svc of group.services) {
          const off = svc.status === 'offline';
          const cls = 'card admin-card' + (off ? ' card-soon srv-error' : '');
          const href = off ? '#' : svc.href;
          const rel = (!off && svc.url && !svc.url.startsWith('#') && !svc.url.startsWith('../'))
            ? ' target="_blank" rel="noopener"' : '';
          html += `<a class="${cls}" href="${esc(href)}"${rel}>`;
          html += `<div class="thumb"><span class="thumb-cap">${esc(svc.name).toUpperCase()}</span>`;
          html += `<span class="thumb-tag${off ? ' off' : ''}">${off ? 'OFFLINE' : 'ONLINE'}</span></div>`;
          html += `<div class="card-title">${esc(svc.name)}</div>`;
          html += `<div class="card-desc">${esc(svc.desc)}</div></a>`;
        }

        html += '</div></section>';
      });

      this.rootEl.innerHTML = html;
    } catch (err) {
      console.error('Admin load error:', err);
      this.rootEl.innerHTML = '<p class="tl-loading">서비스 목록을 불러올 수 없습니다.</p>';
    }
  }
}
