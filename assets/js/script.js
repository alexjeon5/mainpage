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

    if (!overlay || !modal) return null; // 요소가 없으면 건너뜀

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

    // ESC 키로 닫기 공통 적용
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) toggle(false);
    });

    return { toggle };
}

    document.addEventListener('DOMContentLoaded', () => {
        // [A] 기본 서비스 준비 중 모달 설정
        const srvErrorModal = createModal('srv-error-overlay', 'srv-error', 'srv-error-close-btn');

        // 모든 .srv-error 링크에 이벤트 연결
        document.querySelectorAll('.srv-error').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                srvErrorModal?.toggle(true);
            });
        });

    // [B] 관리자 보안 경고 모달 설정 (관리자 페이지인 경우)
    const adminWarnModal = createModal('admin-warn-overlay', 'admin-warn', 'admin-warn-close-btn');
    
    // 현재 페이지가 admin 폴더 안에 있거나 body에 특정 클래스가 있다면 자동 실행
    if (adminWarnModal && document.body.classList.contains('admin-page')) {
        adminWarnModal.toggle(true);
    }
});

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