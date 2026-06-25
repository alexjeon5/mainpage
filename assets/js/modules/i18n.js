/* ── i18n.js ── 다국어 시스템 ── */

import { loadJSON } from './utils.js';

const KEY = 'hanggok-lang';

export class I18n {
  constructor() {
    this.lang = 'ko';
    this.dict = {};
    this.listeners = [];  // 언어 변경 시 콜백 목록
  }

  /** 언어 변경 콜백 등록 — 데이터 렌더러들이 구독 */
  onChange(fn) { this.listeners.push(fn); }

  /** 중첩된 키로 값 추출: "nav.about" → dict.nav.about */
  get(path) {
    return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), this.dict);
  }

  /** data-i18n 속성이 있는 모든 요소에 텍스트 적용 */
  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = this.get(el.dataset.i18n);
      if (val != null) el.innerHTML = val;
    });
  }

  /** 언어 변경 */
  async setLang(lang) {
    this.lang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch {}

    // 버튼 활성 상태
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // 사전 로드
    try {
      this.dict = await loadJSON(`assets/lang/${lang}.json`);
      this.applyToDOM();
    } catch (e) { console.error('i18n load error:', e); }

    // 구독자들에게 알림
    for (const fn of this.listeners) fn(lang);
  }

  /** 초기화 */
  async init() {
    let saved;
    try { saved = localStorage.getItem(KEY); } catch {}
    await this.setLang(saved === 'en' ? 'en' : 'ko');

    // 언어 버튼 바인딩
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setLang(btn.dataset.lang));
    });
  }
}
