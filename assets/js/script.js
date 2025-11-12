// HTML 문서가 모두 로드되었을 때 스크립트 실행
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 페이지 로드 애니메이션 발동 ---
    // body에 'loaded' 클래스를 추가하여 CSS 애니메이션을 시작시킴
    document.body.classList.add('loaded');


    // --- 2. 테마 토글 (라이트/다크 모드) 로직 ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // 2-1. 페이지 로드 시: 브라우저 저장소(localStorage) 확인
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        // 저장된 값이 'light'면 라이트 모드 적용
        body.classList.add('light-mode');
    }

    // 2-2. 토글 버튼 클릭 이벤트
    themeToggle.addEventListener('click', () => {
        // body의 'light-mode' 클래스를 토글 (있으면 제거, 없으면 추가)
        body.classList.toggle('light-mode');
        
        // 2-3. 변경된 상태를 localStorage에 저장
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light'); // 라이트 모드 상태 저장
        } else {
            localStorage.setItem('theme', 'dark');  // 다크 모드 상태 저장
        }
    });


    // --- 3. 탭 스위칭 로직 ---
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');

    // 모든 탭 버튼에 클릭 이벤트 추가
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 클릭한 탭의 'data-tab' 속성값 (예: "projects" 또는 "info")을 가져옴
            const targetPanelId = tab.getAttribute('data-tab');

            // 1. 모든 탭 버튼에서 'active' 클래스 제거
            tabs.forEach(t => t.classList.remove('active'));
            
            // 2. 모든 탭 패널에서 'active' 클래스 제거 (모두 숨김)
            panels.forEach(p => p.classList.remove('active'));

            // 3. '클릭한 탭 버튼'에만 'active' 클래스 추가
            tab.classList.add('active');
            
            // 4. '클릭한 탭과 연결된 패널'에만 'active' 클래스 추가 (해당 탭 보이기)
            document.getElementById(targetPanelId).classList.add('active');
        });
    });

    
    // --- 4. 모달 (팝업) 로직 [신규] ---
    
    // 4-1. 필요한 HTML 요소 가져오기
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    
    // (HTML에서 추가한) '.modal-trigger' 클래스를 가진 모든 링크
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    // 4-2. 모달 여는 함수
    const openModal = () => {
        modalOverlay.classList.add('active');
        modal.classList.add('active');
    };

    // 4-3. 모달 닫는 함수
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        modal.classList.remove('active');
    };

    // 4-4. 이벤트 리스너(Event Listener) 연결
    
    // 'modal-trigger' 클래스가 붙은 링크들을 클릭했을 때
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault(); // a 태그의 기본 동작(페이지 이동) 막기
            openModal(); // 모달 열기
        });
    });

    // '확인' 버튼 클릭 시 모달 닫기
    modalCloseBtn.addEventListener('click', closeModal);
    
    // 뒷 배경(오버레이) 클릭 시 모달 닫기
    modalOverlay.addEventListener('click', closeModal);

}); // <-- document.addEventListener의 닫는 괄호 (이 뒤의 불필요한 } 제거됨)