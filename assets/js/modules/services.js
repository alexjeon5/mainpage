/* ── services.js ── 서비스 카드 + 아카이브 동적 렌더 ── */

import { loadJSON, esc, t } from './utils.js';

export class ServicesRenderer {
  constructor(servicesId, archiveId) {
    this.container = document.getElementById(servicesId);
    this.archiveEl = document.getElementById(archiveId);
  }

  async render(lang = 'ko') {
    const data = await loadJSON('assets/data/services.json');
    if (this.container) this._renderCards(data.items || [], lang);
    if (this.archiveEl) this._renderArchive(data.archives || [], lang);
  }

  _renderCards(items, lang) {
    let html = '';
    for (const svc of items) {
      const isSoon = svc.soon;
      const cls = 'card' + (isSoon ? ' card-soon srv-error' : '');
      const ext = svc.external ? ' target="_blank" rel="noopener"' : '';
      const href = isSoon ? '#' : svc.href;

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

  _renderArchive(items, lang) {
    let html = '';
    for (const arc of items) {
      html += `<a class="archive-card" href="${esc(arc.href)}">`;
      html += `<div class="archive-thumb">`;
      if (arc.thumb) {
        html += `<img src="${esc(arc.thumb)}" alt="${esc(arc.title)}">`;
      }
      html += `</div>`;
      html += `<div class="archive-body">`;
      html += `<span class="archive-date">${esc(arc.tag)}</span>`;
      html += `<span class="archive-title">${esc(arc.title)}</span>`;
      html += `<span class="archive-desc">${esc(t(arc.desc, lang))}</span>`;
      html += `</div></a>`;
    }
    this.archiveEl.innerHTML = html;
  }
}
