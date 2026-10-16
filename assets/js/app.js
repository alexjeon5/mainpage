import { Theme } from './modules/theme.js';
import { initHeader } from './modules/header.js';
import { Modal } from './modules/modal.js';

document.addEventListener('DOMContentLoaded', async () => {
  new Theme().bind();
  initHeader();
  const srvModal = new Modal('srv-error-overlay', 'srv-error', 'srv-error-close-btn');
  const page = document.body.dataset.page || 'main';
  if (page === 'main') {
    // 메인 전용 모듈은 메인에서만 받음 (index.html의 modulepreload로 미리 받아 둠)
    const [{ I18n }, { HeroTerminal, StatsRenderer }, { AboutRenderer }, { PortfolioRenderer }, { ServicesRenderer }, { TimelineRenderer }] = await Promise.all([
      import('./modules/i18n.js'), import('./modules/hero.js'), import('./modules/about.js'),
      import('./modules/portfolio.js'), import('./modules/services.js'), import('./modules/timeline.js')
    ]);
    const i18n = new I18n();
    const portfolio = new PortfolioRenderer('work-list', 'portfolio-detail', i18n);
    const renderers = [new HeroTerminal('hero-term', i18n), new StatsRenderer('stats', i18n), new ServicesRenderer('live-list', i18n), new AboutRenderer('lab-servers', i18n), portfolio, new TimelineRenderer('log-list', 'log-next', i18n)];
    i18n.onChange(async lang => {
      const results = await Promise.allSettled(renderers.map(renderer => renderer.render(lang)));
      results.forEach(result => { if (result.status === 'rejected') console.error('Render error:', result.reason); });
      srvModal.bindTriggers('.srv-error');
    });
    portfolio.handlePopState();
    await i18n.init();
  } else if (page === 'minecraft') {
    const { MinecraftPage } = await import('./modules/minecraft.js');
    await new MinecraftPage().init();
  } else if (page === 'admin') {
    const { AdminRenderer } = await import('./modules/admin.js');
    await new AdminRenderer('admin-root').render();
    srvModal.bindTriggers('.srv-error');
    new Modal('admin-warn-overlay', 'admin-warn', 'admin-warn-close-btn').show();
  }
});
