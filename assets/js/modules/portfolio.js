/* ── portfolio.js ── 포트폴리오 목록 + Notion식 상세 오버레이 ── */

import { loadJSON, esc, t } from './utils.js';

const HASH_PREFIX = '#portfolio/';

export class PortfolioRenderer {
  constructor(listId, detailId, i18n = null) {
    this.listEl = document.getElementById(listId);
    this.detailEl = document.getElementById(detailId);
    this.i18n = i18n;
    this.data = null;
    this.lang = 'ko';
    this.lastFocus = null;          // 상세를 열기 전 포커스 위치 (닫을 때 복귀)
    this.initialRouteDone = false;  // 공유 링크(#portfolio/id) 초기 처리 여부

    // ESC로 닫기 — 한 번만 등록
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) this.closeDetail();
    });
  }

  get isOpen() { return !!this.detailEl?.classList.contains('active'); }

  /** 언어 사전에서 문구 조회 (없으면 기본값) */
  _label(key, fallback) {
    return this.i18n?.get(`portfolio_detail.${key}`) ?? fallback;
  }

  /** 현재 URL 해시에서 포트폴리오 id 추출 */
  _idFromHash() {
    if (!location.hash.startsWith(HASH_PREFIX)) return null;
    try { return decodeURIComponent(location.hash.slice(HASH_PREFIX.length)); }
    catch { return null; }
  }

  /* ───────── 목록 렌더 ───────── */
  async render(lang = 'ko') {
    this.lang = lang;
    if (!this.listEl) return;

    this.data = await loadJSON('assets/data/portfolio.json');
    const hint = this._label('open_hint', '자세히 보기 →');
    const noImage = this._label('no_image', 'PROJECT IMAGE');
    let html = '';

    for (const item of this.data.items) {
      html += `<article class="pf-item" data-pf-id="${esc(item.id)}" role="button" tabindex="0">`;
      html += `<div class="pf-thumb">`;
      if (item.thumb) {
        html += `<img src="${esc(item.thumb)}" alt="${esc(t(item.title, lang))}" loading="lazy">`;
      } else {
        html += `<span class="pf-thumb-placeholder">${esc(noImage)}</span>`;
      }
      html += `</div><div class="pf-body">`;
      html += `<span class="pf-tag">${esc(item.tag)}</span>`;
      html += `<h3 class="pf-title">${esc(t(item.title, lang))}</h3>`;
      html += `<p class="pf-desc">${esc(t(item.summary, lang))}</p>`;
      html += `<div class="pf-meta">${item.chips.map(c => `<span class="pf-chip">${esc(c)}</span>`).join('')}</div>`;
      html += `<span class="pf-open-hint">${esc(hint)}</span>`;
      html += `</div></article>`;
    }

    this.listEl.innerHTML = html;
    this._bindClicks();

    // 공유 링크로 진입한 경우 — 데이터 로드가 끝난 뒤에 상세 열기
    if (!this.initialRouteDone) {
      this.initialRouteDone = true;
      const id = this._idFromHash();
      if (id) this.openDetail(id, { push: false });
    }
  }

  /* ───────── 클릭 바인딩 ───────── */
  _bindClicks() {
    this.listEl.querySelectorAll('.pf-item').forEach(el => {
      const handler = () => this.openDetail(el.dataset.pfId);
      el.addEventListener('click', handler);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
      });
    });
  }

  /* ───────── 상세 페이지 열기 ───────── */
  openDetail(id, { push = true } = {}) {
    if (!this.detailEl || !this.data) return;
    const item = this.data.items.find(i => i.id === id);
    if (!item) return;

    const lang = this.lang;
    const detail = item.detail;
    let html = '';

    // 상단 바
    html += `<div class="pd-topbar"><button class="pd-back" id="pd-back-btn" type="button">${esc(this._label('back', '← 돌아가기'))}</button></div>`;

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

    if (!this.isOpen) this.lastFocus = document.activeElement;

    this.detailEl.innerHTML = html;
    this.detailEl.setAttribute('aria-label', t(item.title, lang));
    this.detailEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.detailEl.scrollTop = 0;

    // 뒤로 가기
    const backBtn = document.getElementById('pd-back-btn');
    backBtn?.addEventListener('click', () => this.closeDetail());
    backBtn?.focus({ preventScroll: true });

    // URL 해시 (popstate로 열린 경우에는 기록을 추가하지 않음)
    if (push) history.pushState({ pf: id }, '', HASH_PREFIX + encodeURIComponent(id));
  }

  /* ───────── 상세 페이지 닫기 ───────── */
  closeDetail({ fromHistory = false } = {}) {
    if (!this.isOpen) return;
    this.detailEl.classList.remove('active');
    document.body.style.overflow = '';

    // 포커스를 원래 항목으로 복귀 (언어 변경으로 교체된 요소면 id로 다시 찾음)
    let target = this.lastFocus;
    if (target && !target.isConnected && target.dataset?.pfId) {
      target = this.listEl?.querySelector(`[data-pf-id="${CSS.escape(target.dataset.pfId)}"]`);
    }
    if (target?.isConnected) target.focus({ preventScroll: true });
    this.lastFocus = null;

    if (fromHistory) return;
    if (history.state?.pf) {
      // 직접 연 상세 → 추가했던 기록을 되돌림
      history.back();
    } else {
      // 공유 링크로 진입한 상세 → 기록을 늘리지 않고 해시만 제거
      history.replaceState(null, '', location.pathname + location.search);
    }
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
          return `<figure class="pd-fig"><img src="${esc(block.src)}" alt="${esc(t(block.alt || '', lang))}" loading="lazy">${cap}</figure>`;

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
    // 메뉴의 #about 같은 일반 해시 이동에서도 popstate가 발생하므로,
    // 여기서는 기록을 조작하지 않고 상세의 열림/닫힘만 맞춘다.
    window.addEventListener('popstate', () => {
      const id = this._idFromHash();
      if (id) this.openDetail(id, { push: false });
      else this.closeDetail({ fromHistory: true });
    });
  }
}
