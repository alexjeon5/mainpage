# HANGGOK SERVER
![Static Badge](https://img.shields.io/badge/Maintained-Yes-green) ![Static Badge](https://img.shields.io/badge/License-MIT-blue)

#### 해당 문서는 **Google Gemini**를 사용하여 작성되었음을 고지합니다.

## ✨ 주요 기능

이 프로젝트는 Vanilla JS(순수 JavaScript)를 기반으로 다양한 인터랙티브 기능을 구현했습니다.

* 🎨 **모던 글래스모피즘 디자인**: `backdrop-filter`를 사용한 세련된 유리 질감의 UI
* 🌗 **다크 / 라이트 모드**: 사용자의 시스템 설정을 감지하고, 수동 토글을 통해 테마를 전환할 수 있습니다. 선택한 테마는 `localStorage`에 저장되어 다음 방문 시에도 유지됩니다.
* 📱 **완전 반응형**: 데스크톱(Grid)과 모바일(Flex) 환경에 맞춰 레이아웃이 유동적으로 변경됩니다.
    * **데스크톱**: 그리드 레이아웃을 사용하여 카드 높이를 자동으로 맞춥니다.
    * **모바일 (820px 이하)**: '서비스' 탭이 세로(Flex Column)로 쌓이고, 각 카드는 가로(Flex Row)로 정렬되어 가독성을 높입니다.
* 📑 **탭 기반 인터페이스**: '정보', '서비스', '향후 계획' 3개의 탭으로 콘텐츠를 분리하여 제공합니다. (기본 탭: '정보')
* 🚀 **동적 마크다운 로딩**: `Marked.js` 라이브러리를 사용하여 `assets/md/plans.md` 파일을 `fetch`한 후, '향후 계획' 탭에 HTML로 자동 변환하여 표시합니다.
* **팝업 모달**: '서비스' 탭에서 준비 중인 항목(`.srv-error` 클래스)을 클릭하면, 스크롤 잠금 및 `Esc` 키 닫기 기능이 포함된 모달창이 뜹니다.
* 🎞️ **로드 애니메이션**: `Pace.js` 로딩 바와 함께, 페이지 로드 시 요소들이 순차적으로 나타나는(Fade-in & Slide-down) 애니메이션이 적용되어 있습니다.

## 🛠️ 사용 기술

* **HTML5**
* **CSS3** (Flexbox, Grid, CSS Variables, Media Queries)
* **Vanilla JavaScript (ES6+)**
    * DOM 조작
    * `fetch` API (비동기)
    * `localStorage`

### 라이브러리 (CDN)

* **[Marked.js](https://marked.js.org/)**: '향후 계획' 탭의 마크다운(.md) 파일을 파싱합니다.
* **[Pace.js](https://github.com/CodeByZach/pace/)**: 페이지 로드 시 상단에 로딩 바를 표시합니다.
* **[Font Awesome](https://fontawesome.com/)**: 아이콘 폰트
* **[Remixicon](https://remixicon.com/)**: 아이콘 폰트

### 폰트

* **`Pretendard`**: 사이트의 기본 메인 폰트로 사용됩니다.
* **`IBM Plex Sans KR` / `Poppins`**: '향후 계획' 탭의 인라인 `<code>` 블록 폰트로 사용됩니다.

---

## 🚀 '향후 계획' 탭 관리하기

이 프로젝트의 '향후 계획' 탭은 정적 HTML이 아닌, **`assets/md/plans.md`** 파일을 동적으로 불러와 표시합니다.

**계획을 수정하려면 `plans.md` 파일만 수정하고 저장(푸시)하면 됩니다.** `script.js`가 자동으로 해당 파일을 읽어 웹페이지에 반영합니다.

## 🧑‍💻 제작자

* **HANGGOK** ([@alexjeon5](https://github.com/alexjeon5))

## 📄 라이선스

* 이 프로젝트는 [MIT 라이선스](https://opensource.org/licenses/MIT)를 따릅니다.
