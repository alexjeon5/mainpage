document.addEventListener('DOMContentLoaded', () => {
    // 1. 페이지 로드 효과
    document.body.classList.add('loaded');

    // 2. 테마 관리
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // 초기 테마 설정 (시스템 설정 반영 가능하면 좋음)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') body.classList.add('light-mode');

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // 3. 탭 시스템 (접근성 고려)
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');

            // 모든 탭/패널 비활성화
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => p.classList.remove('active'));

            // 선택된 탭 활성화
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 4. 모달 시스템 (공용 함수)
    function createModal(overlayId, modalId, closeBtnId) {
        const overlay = document.getElementById(overlayId);
        const modal = document.getElementById(modalId);
        const closeBtn = document.getElementById(closeBtnId);

        if (!overlay || !modal) return null;

        const toggle = (show) => {
            const action = show ? 'add' : 'remove';
            overlay.classList[action]('active');
            modal.classList[action]('active');
            overlay.setAttribute('aria-hidden', !show);
            modal.setAttribute('aria-hidden', !show);
            document.body.style.overflow = show ? 'hidden' : '';
        };

        if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
        overlay.addEventListener('click', () => toggle(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) toggle(false);
        });

        return { toggle };
    }

    // 모달 설정 초기화
    const srvErrorModal = createModal('srv-error-overlay', 'srv-error', 'srv-error-close-btn');
    const adminWarnModal = createModal('admin-warn-overlay', 'admin-warn', 'admin-warn-close-btn');

    // 서비스 준비 중 알림 (.srv-error 클릭 시)
    document.querySelectorAll('.srv-error').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            srvErrorModal?.toggle(true);
        });
    });

    // 관리자 페이지 접속 시 보안 경고 자동 실행
    // HTML의 <body data-page="admin">과 일치시킵니다.
    if (adminWarnModal && document.body.dataset.page === 'admin') {
        adminWarnModal.toggle(true);
    }

    // 5. 마크다운 로드
    async function loadPlans() {
        const container = document.getElementById('plans-content');
        try {
            const res = await fetch('assets/md/plans.md');
            if (!res.ok) throw new Error('File not found');
            const text = await res.text();
            container.innerHTML = marked.parse(text);
        } catch (err) {
            console.error(err);
            container.innerHTML = `<p style="text-align:center; padding: 1rem; color: var(--text-color-secondary);">
                <i class="fa-solid fa-triangle-exclamation"></i> 내용을 불러올 수 없습니다.
            </p>`;
        }
    }
    loadPlans();
});