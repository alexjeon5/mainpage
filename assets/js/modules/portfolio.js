/* ── portfolio.js ── 포트폴리오 목록 + Notion식 상세 오버레이 ── */

import { loadJSON, esc, t } from './utils.js';

export class PortfolioRenderer {
  constructor(listId, detailId) {
    this.listEl = document.getElementById(listId);
    this.detailEl = document.getElementById(detailId);
    this.data = null;
    this.lang = 'ko';
  }

  /* ───────── 목록 렌더 ───────── */
  async render(lang = 'ko') {
    this.lang = lang;
    if (!this.listEl) return;

    this.data = await loadJSON('assets/data/portfolio.json');
    let html = '';

    for (const item of this.data.items) {
      html += `<article class="pf-item" data-pf-id="${esc(item.id)}" role="button" tabindex="0">`;
      html += `<div class="pf-thumb">`;
      if (item.thumb) {
        html += `<img src="${esc(item.thumb)}" alt="${esc(t(item.title, lang))}">`;
      } else {
        html += `<span class="pf-thumb-placeholder">PROJECT IMAGE</span>`;
      }
      html += `</div><div class="pf-body">`;
      html += `<span class="pf-tag">${esc(item.tag)}</span>`;
      html += `<h3 class="pf-title">${esc(t(item.title, lang))}</h3>`;
      html += `<p class="pf-desc">${esc(t(item.summary, lang))}</p>`;
      html += `<div class="pf-meta">${item.chips.map(c => `<span class="pf-chip">${esc(c)}</span>`).join('')}</div>`;
      html += `<span class="pf-open-hint">자세히 보기 →</span>`;
      html += `</div></article>`;
    }

    this.listEl.innerHTML = html;
    this._bindClicks();
  }

  /* ───────── 클릭 바인딩 ───────── */
  _bindClicks() {
    this.listEl.querySelectorAll('.pf-item').forEach(el => {
      const handler = () => this.openDetail(el.dataset.pfId);
      el.addEventListener('click', handler);
      el.addEventListener('keydown', e => { if (e.key === 'Enter') handler(); });
    });
  }

  /* ───────── 상세 페이지 열기 ───────── */
  openDetail(id) {
    if (!this.detailEl || !this.data) return;
    const item = this.data.items.find(i => i.id === id);
    if (!item) return;

    const lang = this.lang;
    const detail = item.detail;
    let html = '';

    // 상단 바
    html += `<div class="pd-topbar"><button class="pd-back" id="pd-back-btn">← ${lang === 'en' ? 'Back' : '돌아가기'}</button></div>`;

    // 커버 이미지
    if (detail.cover) {
      html += `<div class="pd-cover"><img src="${esc(detail.cover)}" alt=""></div>`;
    }

    // 헤더
    html += `<div class="pd-header">`;
    html += `<span class="pd-tag">${esc(item.tag)}</span>`;
    html += `<h1 class="pd-title">${esc(t(item.title, lang))}</h1>`;
    html += `<div class="pd-chips">${item.chips.map(c => `<span class="pf-chip">${esc(c)}</span>`).join('')}</div>`;
    html += `</div>`;

    // Notion 블록 렌더
    html += `<div class="pd-body">${this._renderBlocks(detail.blocks, lang)}</div>`;

    this.detailEl.innerHTML = html;
    this.detailEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.detailEl.scrollTop = 0;

    // 뒤로 가기
    document.getElementById('pd-back-btn')?.addEventListener('click', () => this.closeDetail());

    // ESC로 닫기
    this._escHandler = e => { if (e.key === 'Escape') this.closeDetail(); };
    document.addEventListener('keydown', this._escHandler);

    // URL 해시
    history.pushState({ pf: id }, '', `#portfolio/${id}`);
  }

  /* ───────── 상세 페이지 닫기 ───────── */
  closeDetail() {
    if (!this.detailEl) return;
    this.detailEl.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._escHandler);
    history.pushState(null, '', window.location.pathname);
  }

  /* ───────── Notion 블록 → HTML 변환 ───────── */
  _renderBlocks(blocks, lang) {
    if (!blocks) return '';
    return blocks.map(block => {
      switch (block.type) {
        case 'heading':
          const tag = `h${block.level || 2}`;
          return `<${tag} class="pd-h">${esc(t(block.text, lang))}</${tag}>`;

        case 'paragraph':
          return `<p class="pd-p">${esc(t(block.text, lang))}</p>`;

        case 'list': {
          const tag2 = block.style === 'numbered' ? 'ol' : 'ul';
          const items = (block.items || []).map(i => `<li>${esc(t(i, lang))}</li>`).join('');
          return `<${tag2} class="pd-list">${items}</${tag2}>`;
        }

        case 'callout':
          return `<div class="pd-callout"><span class="pd-callout-icon">${block.emoji || '💡'}</span><span class="pd-callout-text">${esc(t(block.text, lang))}</span></div>`;

        case 'divider':
          return '<hr class="pd-divider">';

        case 'image':
          const cap = block.caption ? `<figcaption class="pd-fig-cap">${esc(t(block.caption, lang))}</figcaption>` : '';
          return `<figure class="pd-fig"><img src="${esc(block.src)}" alt="${esc(t(block.alt || '', lang))}">${cap}</figure>`;

        case 'code':
          return `<pre class="pd-code"><code>${esc(t(block.text, lang))}</code></pre>`;

        case 'quote':
          return `<blockquote class="pd-quote">${esc(t(block.text, lang))}</blockquote>`;

        default:
          return '';
      }
    }).join('\n');
  }

  /* ───────── 브라우저 뒤로/앞으로 대응 ───────── */
  handlePopState() {
    window.addEventListener('popstate', () => {
      const hash = location.hash;
      if (hash.startsWith('#portfolio/')) {
        this.openDetail(hash.replace('#portfolio/', ''));
      } else {
        this.closeDetail();
      }
    });

    // 초기 로드 시 해시 확인
    if (location.hash.startsWith('#portfolio/')) {
      setTimeout(() => this.openDetail(location.hash.replace('#portfolio/', '')), 300);
    }
  }
}
