/* ── app.js ── 진입점: 모듈 조합 및 초기화 ── */

import { Theme }             from './modules/theme.js';
import { I18n }              from './modules/i18n.js';
import { Modal }             from './modules/modal.js';
import { AboutRenderer }     from './modules/about.js';
import { PortfolioRenderer } from './modules/portfolio.js';
import { ServicesRenderer }  from './modules/services.js';
import { TimelineRenderer }  from './modules/timeline.js';
import { AdminRenderer }     from './modules/admin.js';

document.addEventListener('DOMContentLoaded', async () => {

  /* ── 1. 테마 ── */
  const theme = new Theme();
  theme.bind();

  /* ── 2. 다국어 ── */
  const i18n = new I18n();

  /* ── 3. 페이지별 렌더러 생성 ── */
  const page = document.body.dataset.page || 'main';

  if (page === 'main') {
    const about     = new AboutRenderer('about-grid');
    const portfolio = new PortfolioRenderer('pf-list', 'portfolio-detail');
    const services  = new ServicesRenderer('services-grid', 'archive-grid');
    const timeline  = new TimelineRenderer('timeline-list', 'plans-list');

    // 초기 렌더
    const render = async (lang) => {
      await Promise.all([
        about.render(lang),
        portfolio.render(lang),
        services.render(lang),
        timeline.render(lang),
      ]);
      // 서비스 카드 렌더 후 모달 트리거 재바인딩
      srvModal?.bindTriggers();
    };

    // 언어 변경 시 모든 섹션 다시 렌더
    i18n.onChange(render);

    // 브라우저 뒤로/앞으로 대응
    portfolio.handlePopState();
  }

  if (page === 'admin') {
    const admin = new AdminRenderer('admin-root');
    await admin.render();

    // admin 경고 모달
    const adminWarn = new Modal('admin-warn-overlay', 'admin-warn', 'admin-warn-close-btn');
    adminWarn.show();
  }

  /* ── 4. 모달 ── */
  const srvModal = new Modal('srv-error-overlay', 'srv-error', 'srv-error-close-btn');
  srvModal.bindTriggers();

  /* ── 5. i18n 초기화 (렌더러가 등록된 뒤에) ── */
  await i18n.init();

});
