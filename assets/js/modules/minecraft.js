/* Lucian UX/UI Prompt #008 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#008 */
import { loadJSON, esc } from './utils.js';

export class MinecraftPage {
  async init() {
    if (!document.getElementById('mc-address')) return;
    try {
      this.data = await loadJSON('assets/data/minecraft.json');
      this.render();
      this.bindCopy();
      this.bindPolling();
    } catch {
      this.setStatus('error');
      document.getElementById('mc-title').textContent = '서버 정보를 불러올 수 없습니다.';
    }
  }

  render() {
    const data = this.data;
    const text = (id, value) => { document.getElementById(id).textContent = value; };
    text('mc-title', data.hero.title);
    text('mc-address', data.address);
    text('mc-footer', data.footer);
    text('mc-how-kicker', data.steps.kicker);
    text('mc-how-title', data.steps.title);
    text('mc-rules-kicker', data.rules.kicker);
    text('mc-rules-title', data.rules.title);
    text('mc-rules-desc', data.rules.desc);
    document.getElementById('mc-meta').innerHTML = data.meta.map(item =>
      `<div class="card"><dt>${esc(item.key)}</dt><dd${item.id === 'version' ? ' id="mc-version"' : ''}>${esc(item.value)}</dd></div>`
    ).join('');
    document.getElementById('mc-steps').innerHTML = data.steps.items.map((item, index) =>
      `<li class="card"><span class="mc-step-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p></li>`
    ).join('');
    document.getElementById('mc-rules').innerHTML = data.rules.items.map(item =>
      `<li><span class="mc-rule-tag" data-tone="${item.tone === 'ask' ? 'ask' : 'ban'}">${esc(item.tag)}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p></div></li>`
    ).join('');
  }

  bindCopy() {
    const button = document.getElementById('copy-btn');
    const address = document.getElementById('mc-address');
    const root = button.closest('.u008');
    const tip = root.querySelector('.u008-tip');
    let timer;
    button.disabled = false;
    button.addEventListener('click', async () => {
      let copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(this.data.address);
          copied = true;
        } catch { /* Try the legacy clipboard path below. */ }
      }
      if (!copied) copied = this.legacyCopy(this.data.address);
      clearTimeout(timer);
      root.classList.remove('is-copied', 'is-copy-failed');
      if (copied) {
        // Restart the original gleam animation on repeated successful copies.
        void root.offsetWidth;
        root.classList.add('is-copied');
        button.dataset.state = 'copied';
        tip.textContent = '복사됨';
      } else {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(address);
        selection?.removeAllRanges();
        selection?.addRange(range);
        root.classList.add('is-copy-failed');
        button.dataset.state = 'failed';
        tip.textContent = '직접 복사해 주세요';
      }
      timer = setTimeout(() => {
        root.classList.remove('is-copied', 'is-copy-failed');
        button.dataset.state = 'idle';
        tip.textContent = '';
      }, 2000);
    });
  }

  legacyCopy(value) {
    const field = document.createElement('textarea');
    field.value = value;
    field.readOnly = true;
    field.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(field);
    const previousFocus = document.activeElement;
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Manual selection is the final fallback. */ }
    field.remove();
    previousFocus?.focus({ preventScroll: true });
    return copied;
  }

  setStatus(state) {
    const messages = {
      checking: '상태 확인 중…',
      online: 'ONLINE · 지금 접속할 수 있어요',
      offline: 'OFFLINE · 서버 점검 중',
      error: '상태를 확인할 수 없어요'
    };
    const status = document.getElementById('mc-status');
    status.dataset.state = state;
    status.lastElementChild.textContent = messages[state];
  }

  async fetchStatus() {
    if (this.request) return;
    const request = new AbortController();
    this.request = request;
    // A stalled request should also leave the initial checking state.
    const timeout = setTimeout(() => request.abort(), 10000);
    try {
      const response = await fetch(this.data.statusApi + encodeURIComponent(this.data.address), {
        headers: { Accept: 'application/json' }, signal: request.signal
      });
      if (!response.ok) throw new Error('Status unavailable');
      const data = await response.json();
      if (this.request !== request) return;
      this.setStatus(data?.online ? 'online' : 'offline');
      const version = document.getElementById('mc-version');
      if (data?.online && data.version && version) version.textContent = String(data.version);
    } catch {
      if (this.request === request) this.setStatus('error');
    } finally {
      clearTimeout(timeout);
      if (this.request === request) this.request = null;
    }
  }

  bindPolling() {
    const stop = () => {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
      this.request?.abort();
      this.request = null;
    };
    const start = () => {
      if (document.hidden || this.pollTimer) return;
      this.fetchStatus();
      this.pollTimer = setInterval(() => this.fetchStatus(), 60000);
    };
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    window.addEventListener('pagehide', stop);
    window.addEventListener('pageshow', start);
    start();
  }
}
