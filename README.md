# [HANGGOK SERVER](https://www.hanggok.com)
![Static Badge](https://img.shields.io/badge/Maintained-Yes-green) ![Static Badge](https://img.shields.io/badge/License-MIT-blue)

#### 해당 문서는 **Google Gemini**를 사용하여 작성되었음을 고지합니다.

## 📌 프로젝트 소개
**HANGGOK SERVER**는 개인 서버 랜딩 페이지이자 포트폴리오 사이트입니다.
Vanilla JS와 CSS3를 사용하여 **글래스모피즘(Glassmorphism)** 디자인을 구현했으며, 사용자 경험(UX)과 웹 접근성(A11y), 검색 엔진 최적화(SEO)를 고려하여 설계되었습니다.

## ✨ 주요 기능 및 변경 사항

### 🎨 디자인 (UI/UX)
* **고도화된 글래스모피즘**: 배경에 은은한 그라디언트 애니메이션(`radial-gradient`)을 추가하여 유리 질감을 극대화했습니다.
* **다크 / 라이트 모드**: 시스템 설정 감지 및 수동 토글을 지원하며, `localStorage`를 통해 사용자의 선호 테마를 저장합니다.
* **커스텀 스크롤바**: 전체 테마와 어우러지는 모던한 스크롤바 디자인을 적용했습니다.
* **완전 반응형 레이아웃**:
    * **Desktop**: CSS Grid를 활용하여 카드를 균일하게 배치합니다.
    * **Mobile**: 모바일 환경에 맞춰 레이아웃을 최적화하였으며, 카드 내 **링크 아이콘을 우측 하단으로 정렬**하여 터치 접근성과 시각적 균형을 개선했습니다.

### ⚙️ 기능 및 성능
* **동적 마크다운 렌더링**: `Marked.js`를 사용하여 `assets/md/plans.md` 파일을 비동기(`fetch`)로 불러와 HTML로 변환하여 표시합니다.
* **SEO 최적화**: Open Graph(OG) 태그와 메타 설명을 추가하여 검색 엔진 및 SNS 공유 시 미리보기를 최적화했습니다.
* **웹 접근성(Accessibility) 강화**:
    * WAI-ARIA 속성(`role`, `aria-selected`, `aria-controls`)을 적용하여 스크린 리더 사용자도 탭과 모달을 쉽게 이용할 수 있습니다.
    * 시맨틱 태그를 사용하여 문서 구조를 명확히 했습니다.
* **인터랙티브 모달**: '서비스 준비 중' 항목 클릭 시 키보드 접근성(`Esc` 키 지원)이 포함된 모달 창이 활성화됩니다.
* **로딩 애니메이션**: `Pace.js` 로딩 바와 콘텐츠 페이드인 효과를 적용하여 부드러운 화면 전환을 제공합니다.

## 🛠️ 기술 스택

* **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Libraries**:
    * [Marked.js](https://marked.js.org/) (Markdown Parsing)
    * [Pace.js](https://codebyzach.github.io/pace/) (Loading Progress)
    * [Font Awesome](https://fontawesome.com/) & [Remixicon](https://remixicon.com/) (Icons)
* **Font**: Pretendard, IBM Plex Sans KR

## 🚀 사용 방법

이 프로젝트는 정적(Static) 웹사이트입니다. 별도의 빌드 과정 없이 바로 사용할 수 있습니다.

1.  리포지토리를 클론하거나 다운로드합니다.
2.  `index.html` 파일을 브라우저에서 실행하면 바로 확인할 수 있습니다.
3.  **내용 수정**: '타임 라인' 탭의 내용을 수정하려면 `assets/md/plans.md` 파일만 편집하면 됩니다.

## 🧑‍💻 제작자

* **HANGGOK** ([@alexjeon5](https://github.com/alexjeon5))

## 📄 라이선스

이 프로젝트는 [MIT License](https://opensource.org/licenses/MIT)를 따릅니다.