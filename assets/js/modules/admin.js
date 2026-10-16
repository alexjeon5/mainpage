/* Admin service console: JSON-driven summaries, groups and keyboard filters. */
import { loadJSON, esc } from './utils.js';

// esc() handles text; quotes also need escaping inside HTML attributes.
const attr = value => esc(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export class AdminRenderer {
  constructor(rootId) {
    this.rootEl = document.getElementById(rootId);
    this.filter = 'all';
  }

  async render() {
    if (!this.rootEl) return;
    try {
      const data = await loadJSON('assets/data/admin-services.json');
      const groups = data.groups || [];
      const services = groups.flatMap(group => group.services || []);
      const counts = {
        online: services.filter(service => service.status === 'online').length,
        disabled: services.filter(service => service.status === 'disabled').length,
        offline: services.filter(service => service.status === 'offline').length,
        servers: groups.length
      };
      const summary = document.getElementById('admin-summary');
      if (summary) summary.innerHTML = Object.entries(counts).map(([key, value]) =>
        `<div data-key="${key}"><dt>${key.toUpperCase()}</dt><dd>${value}</dd></div>`
      ).join('');
      this.rootEl.innerHTML = groups.map(group => {
        const services = group.services || [];
        const online = services.filter(service => service.status === 'online').length;
        return `<section class="admin-group" data-server="${attr(group.id)}">
          <div class="admin-group-heading"><div><span class="admin-server-label">${esc(group.server)}</span><h2>${esc(group.label)}</h2></div><span class="admin-online-count">${online} / ${services.length} online</span></div>
          <ul>${services.map(service => this.renderService(service)).join('')}</ul>
        </section>`;
      }).join('');
      this.bindFilters();
      this.applyFilter(this.filter);
    } catch {
      this.rootEl.innerHTML = '<p class="admin-error" role="status">서비스 목록을 불러올 수 없습니다.</p>';
    }
  }

  renderService(service) {
    const status = ['online', 'disabled', 'offline'].includes(service.status) ? service.status : 'offline';
    const action = status === 'online'
      ? `<a class="btn btn--solid admin-action" href="${attr(service.url)}" target="_blank" rel="noopener">열기 ↗</a>`
      : status === 'disabled'
        ? '<button class="btn btn--ghost admin-action" type="button" disabled>비활성화됨</button>'
        : '<button class="btn btn--ghost admin-action srv-error" type="button">준비 중</button>';
    return `<li class="admin-row" data-status="${status}">
      <span class="admin-status"><span aria-hidden="true"></span>${status.toUpperCase()}</span>
      <span class="admin-service-name">${esc(service.name)}</span>
      <span class="admin-service-desc">${esc(service.desc)}</span>
      <span class="admin-service-host">${esc(this.host(service))}</span>${action}
    </li>`;
  }

  host(service) {
    if (service.host) return service.host;
    if (!service.url || service.url === '#') return '—';
    try { return new URL(service.url, 'https://www.hanggok.com/admin/').hostname; }
    catch { return '—'; }
  }

  applyFilter(filter) {
    this.filter = filter;
    this.rootEl.querySelectorAll('.admin-group').forEach(group => {
      group.hidden = filter !== 'all' && group.dataset.server !== filter;
    });
    this.tabs.forEach(tab => {
      const selected = tab.dataset.filter === filter;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) this.rootEl.setAttribute('aria-labelledby', tab.id);
    });
  }

  bindFilters() {
    if (this.tabs) return;
    this.tabs = [...document.querySelectorAll('[role="tab"][data-filter]')];
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.applyFilter(tab.dataset.filter));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % this.tabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + this.tabs.length) % this.tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = this.tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        this.applyFilter(this.tabs[next].dataset.filter);
        this.tabs[next].focus();
      });
    });
  }
}
