/* ── services.js ── 서비스 카드 동적 렌더 ── */

import { loadJSON, esc, t } from './utils.js';

export class ServicesRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  async render(lang = 'ko') {
    if (!this.container) return;
    const data = await loadJSON('assets/data/services.json');
    let html = '';

    for (const svc of data.items) {
      const isSoon = svc.soon;
      const cls = 'card' + (isSoon ? ' card-soon srv-error' : '');
      const ext = svc.external ? ' target="_blank" rel="noopener"' : '';
      const href = isSoon ? '#' : svc.href;

      // 썸네일
      let thumbInner = '';
      if (svc.thumb) {
        thumbInner = `<img src="${esc(svc.thumb)}" alt="${esc(svc.title)}">`;
      } else if (svc.thumbCap) {
        thumbInner = `<span class="thumb-cap">${esc(svc.thumbCap)}</span>`;
      }
      const tagCls = isSoon ? 'thumb-tag off' : 'thumb-tag';

      html += `<a class="${cls}" href="${esc(href)}"${ext}>`;
      html += `<div class="thumb">${thumbInner}<span class="${tagCls}">${esc(svc.tag)}</span></div>`;
      html += `<div class="card-cat">${esc(svc.cat)}</div>`;
      html += `<div class="card-title">${esc(svc.title)}</div>`;
      html += `<div class="card-desc">${esc(t(svc.desc, lang))}</div>`;
      html += '</a>';
    }

    this.container.innerHTML = html;
  }
}
