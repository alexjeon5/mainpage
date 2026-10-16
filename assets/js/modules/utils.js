/* ── utils.js ── 공용 유틸리티 ── */

/** 하위 폴더에서도 동작하도록 스크립트 base 경로 계산 */
export function getBasePath() {
  const el = document.querySelector('script[src*="app.js"]');
  if (el) return el.getAttribute('src').replace(/assets\/js\/app\.js.*/, '');
  return '';
}

export const BASE = getBasePath();

/** JSON 파일 로드 — 진행 중인 요청(Promise)까지 캐시해서 같은 파일을 동시에 여러 번 받지 않음 */
const cache = new Map();
export function loadJSON(path) {
  const url = BASE + path;
  if (!cache.has(url)) {
    const p = fetch(url).then(res => {
      if (!res.ok) throw new Error(`Failed to load: ${url}`);
      return res.json();
    });
    p.catch(() => cache.delete(url)); // 실패한 요청은 다음에 다시 시도
    cache.set(url, p);
  }
  return cache.get(url);
}

/** XSS 방지용 HTML 이스케이프 */
export function esc(s) {
  const d = document.createElement('div');
  d.textContent = String(s);
  return d.innerHTML;
}

/** 다국어 값 추출 — 문자열이면 그대로, 객체면 lang 키로 */
export function t(val, lang = 'ko') {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  return val[lang] || val.ko || val.en || '';
}
