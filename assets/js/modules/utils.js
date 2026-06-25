/* ── utils.js ── 공용 유틸리티 ── */

/** 하위 폴더에서도 동작하도록 스크립트 base 경로 계산 */
export function getBasePath() {
  const el = document.querySelector('script[src*="app.js"]');
  if (el) return el.getAttribute('src').replace(/assets\/js\/app\.js.*/, '');
  return '';
}

export const BASE = getBasePath();

/** JSON 파일 로드 (캐시 활용) */
const cache = {};
export async function loadJSON(path) {
  const url = BASE + path;
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load: ${url}`);
  const data = await res.json();
  cache[url] = data;
  return data;
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
