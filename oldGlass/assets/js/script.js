document.addEventListener('DOMContentLoaded', () => {
    // 1. 페이지 로드 효과
    document.body.classList.add('loaded');

    // 2. 테마 관리
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light' || (!savedTheme && prefersLightScheme)) {
        body.classList.add('light-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // ==========================================
    // 🌟 다국어 (i18n) 시스템 추가 🌟
    // ==========================================
    
    // 현재 스크립트의 경로를 바탕으로 Root Base Path 계산 (하위 폴더 문제 방지)
    function getBasePath() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const src = script.getAttribute('src');
            if (src && src.includes('assets/js/script.js')) {
                return src.replace('assets/js/script.js', '');
            }
        }
        return '';
    }
    const basePath = getBasePath();

    async function loadTranslations(lang) {
        try {
            const response = await fetch(`${basePath}assets/lang/${lang}.json`);
            if (!response.ok) throw new Error('Translation file not found');
            return await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            return null;
        }
    }

    async function applyLanguage(lang) {
        const translations = await loadTranslations(lang);
        if (!translations) return;

        localStorage.setItem('preferred_language', lang);

        // ✅ 수정된 부분: "global.footer_copy" 같은 점(.) 표기법을 파싱해서 찾아감
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const path = element.getAttribute('data-i18n'); // 예: "main.profile_name"
            const keys = path.split('.'); // ["main", "profile_name"]로 분리
            
            let textValue = translations;
            
            // 객체 안쪽으로 파고들어가며 값 찾기
            for (const key of keys) {
                if (textValue[key] !== undefined) {
                    textValue = textValue[key];
                } else {
                    textValue = null;
                    break;
                }
            }

            // 값이 존재하면 HTML 텍스트 교체
            if (textValue) {
                element.innerHTML = textValue;
            }
        });
        
        // select 드롭다운 동기화
        const langSelect = document.getElementById('lang-select');
        if (langSelect && langSelect.value !== lang) {
            langSelect.value = lang;
        }

        // 언어 변경 시 마크다운(Timeline)도 해당 언어로 다시 로드
        loadPlans(lang);
    }

    // 초기 언어 설정 (localStorage 저장값 확인, 없으면 기본값 'ko')
    const savedLang = localStorage.getItem('preferred_language') || 'ko';
    applyLanguage(savedLang);

    // 언어 선택 드롭다운 이벤트 리스너 등록
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
        });
    }

    // 3. 탭 시스템 (접근성 고려)
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });

        tab.addEventListener('keydown', (e) => {
            let targetIndex = index;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                targetIndex = (index + 1) % tabs.length;
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                targetIndex = (index - 1 + tabs.length) % tabs.length;
                e.preventDefault();
            }
            if (targetIndex !== index) {
                tabs[targetIndex].click();
                tabs[targetIndex].focus();
            }
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

            if (show) {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length) {
                    setTimeout(() => focusableElements[0].focus(), 50);
                }
            }
        };

        if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
        overlay.addEventListener('click', () => toggle(false));

        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) toggle(false);
        });

        return { toggle };
    }

    const srvErrorModal = createModal('srv-error-overlay', 'srv-error', 'srv-error-close-btn');
    const adminWarnModal = createModal('admin-warn-overlay', 'admin-warn', 'admin-warn-close-btn');

    document.querySelectorAll('.srv-error').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            srvErrorModal?.toggle(true);
        });
    });

    if (adminWarnModal && document.body.dataset.page === 'admin') {
        adminWarnModal.toggle(true);
    }

    // 5. 마크다운 로드 (언어 연동)
    async function loadPlans(lang = 'ko') {
        const container = document.getElementById('plans-content');
        if (!container) return;

        const fileName = lang === 'en' ? 'plans_en.md' : 'plans.md';
        try {
            const res = await fetch(`${basePath}assets/md/${fileName}`);
            if (!res.ok) throw new Error('File not found');
            const text = await res.text();
            const rawHtml = marked.parse(text);
            container.innerHTML = DOMPurify.sanitize(rawHtml);
        } catch (err) {
            console.error(err);
            const errMsg = lang === 'en' ? 'Failed to load content.' : '내용을 불러올 수 없습니다.';
            container.innerHTML = `<p style="text-align:center; padding: 1rem; color: var(--text-color-secondary);">
                <i class="fa-solid fa-triangle-exclamation"></i> ${errMsg}
            </p>`;
        }
    }
});