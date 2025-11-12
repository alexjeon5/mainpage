// HTML 문서가 모두 로드되었을 때 스크립트 실행
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 페이지 로드 애니메이션 발동 ---
    // 페이지 로드 시 body에 'loaded' 클래스를 추가하여
    // style.css에 정의된 'Fade-in & Slide-down' 애니메이션을 시작시킵니다.
    document.body.classList.add('loaded');


    // --- 2. 테마 토글 (라이트/다크 모드) 로직 ---
    // 페이지 우측 상단의 테마 토글 버튼을 제어합니다.
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // 2-1. 페이지 로드 시: 브라우저 저장소(localStorage)에서 이전 테마 확인
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode'); // 저장된 값이 'light'면 라이트 모드 적용
    }

    // 2-2. 토글 버튼 클릭 이벤트
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode'); // body의 'light-mode' 클래스를 토글
        
        // 2-3. 변경된 상태를 localStorage에 저장 (다음 방문 시 유지를 위해)
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });


    // --- 3. 탭 스위칭 로직 ('정보' / '서비스' / '향후 계획') ---
    // 탭 버튼 클릭 시 해당하는 탭 콘텐츠(패널)를 보여줍니다.
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 클릭한 탭의 data-tab 속성값 (예: "projects")을 가져옴
            const targetPanelId = tab.getAttribute('data-tab');

            // 1. 모든 탭과 패널에서 'active' 클래스를 제거 (비활성화)
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // 2. '클릭한 탭'과 '연결된 패널'에만 'active' 클래스 추가 (활성화)
            tab.classList.add('active');
            document.getElementById(targetPanelId).classList.add('active');
        });
    });

    
    // --- 4. 팝업 모달 ('서비스 준비 중') 로직 ---
    // 'srv-error' 클래스가 있는 링크 클릭 시 팝업창을 제어합니다.
    
    // 4-1. 팝업에 필요한 HTML 요소들을 가져옴
    const modalOverlay = document.getElementById('srv-error-overlay'); // 뒷 배경
    const modal = document.getElementById('srv-error'); // 팝업창 본체
    const modalCloseBtn = document.getElementById('srv-error-close-btn'); // 닫기 버튼
    
    // 팝업을 띄울 링크(index.html의 .srv-error 클래스)들을 모두 찾음
    const modalTriggers = document.querySelectorAll('.srv-error');

    // 4-2. 모달 여는 함수
    const openModal = () => {
        modalOverlay.classList.add('active');
        modal.classList.add('active');
        modalCloseBtn.focus(); // 팝업이 열리면 '확인' 버튼에 포커스
        document.body.style.overflow = 'hidden'; // 뒷 배경 스크롤 잠금
    };

    // 4-3. 모달 닫는 함수
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        modal.classList.remove('active');
        document.body.style.overflow = ''; // 스크롤 잠금 해제
    };

    // 4-4. 이벤트 연결
    
    // 팝업을 띄우는 링크(.srv-error)들에 클릭 이벤트 추가
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault(); // a 태그의 기본 링크 이동 동작을 막음
            openModal(); // 모달 열기
        });
    });

    // '확인' 버튼 클릭 시 모달 닫기
    modalCloseBtn.addEventListener('click', closeModal);
    
    // 뒷 배경(오버레이) 클릭 시 모달 닫기
    modalOverlay.addEventListener('click', closeModal);

    // 'Esc' 키로 모달 닫기
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    
    // --- 5. '향후 계획' 탭 마크다운 불러오기 ---
    // '향후 계획' 탭의 .md 파일을 불러와 HTML로 변환하여 표시합니다.
    const loadMarkdown = async () => {
        try {
            // [경로] /assets/md/plans.md 파일을 불러옵니다.
            const response = await fetch('assets/md/plans.md');
            
            if (!response.ok) {
                // 파일을 못 찾거나(404) 오류가 나면 에러 메시지 표시
                throw new Error('plans.md 파일을 불러올 수 없습니다.');
            }
            
            const markdownText = await response.text();
            
            // Marked.js 라이브러리를 사용해 마크다운을 HTML로 변환
            const htmlContent = marked.parse(markdownText);
            
            // 변환된 HTML을 #plans-content div에 삽입
            document.getElementById('plans-content').innerHTML = htmlContent;
            
        } catch (error) {
            console.error(error);
            // 에러 발생 시 사용자에게 메시지 표시
            document.getElementById('plans-content').innerHTML = 
                '<p style="color: var(--text-color-secondary);">콘텐츠를 불러오는 데 실패했습니다.</p>';
        }
    };
    
    // 페이지 로드 시 마크다운 파일 불러오기 실행
    loadMarkdown();


}); // <-- document.addEventListener의 닫는 괄호