# [HANGGOK SERVER](https://www.hanggok.com)
![Static Badge](https://img.shields.io/badge/Maintained-Yes-green) ![Static Badge](https://img.shields.io/badge/License-MIT-blue)

#### 해당 문서는 **Google Gemini**를 사용하여 작성되었음을 고지합니다.

## 📌 프로젝트 소개
**HANGGOK SERVER**는 개인 서버의 관문 역할을 하는 랜딩 페이지이자 프로젝트 포트폴리오 사이트입니다. Vanilla JS와 CSS3를 기반으로 현대적인 **글래스모피즘(Glassmorphism)** 디자인을 구현하였으며, 사용자 경험(UX), 웹 접근성(A11y), 검색 엔진 최적화(SEO)를 최우선으로 고려하여 설계되었습니다.

## ✨ 디자인 및 UI/UX 특징

### **고도화된 글래스모피즘 (Liquid Glass)**
* **시각적 깊이감**: 배경에 은은한 `radial-gradient` 애니메이션을 적용하고 SVG 굴절 필터를 활용하여 투명한 유리 질감을 극대화했습니다.
* **지능형 테마 시스템**: 시스템 설정을 자동으로 감지하여 다크/라이트 모드를 제안하며, 사용자의 수동 설정값은 `localStorage`에 저장되어 유지됩니다.
* **디테일 최적화**: 테마에 맞춘 커스텀 스크롤바와 `Pace.js` 기반의 로딩 프로그레스 바를 통해 부드러운 페이지 진입 경험을 제공합니다.

### **반응형 및 접근성 설계**
* **적응형 레이아웃**: 데스크톱에서는 CSS Grid를 활용하여 균형 잡힌 카드 배치를 보여주며, 모바일 환경에서는 터치 접근성을 개선하기 위해 카드 내 링크 아이콘을 우측 하단으로 정렬했습니다.
* **웹 접근성(Accessibility) 강화**: 시맨틱 태그 사용은 물론, WAI-ARIA 속성(`role`, `aria-selected`, `aria-controls`)을 적용하여 스크린 리더 및 키보드 사용자의 편의를 높였습니다.

## ⚙️ 주요 기능 및 성능

* **동적 마크다운 렌더링**: `Marked.js` 라이브러리를 통해 별도의 빌드 과정 없이 외부 마크다운 파일(`assets/md/plans.md`)을 비동기(`fetch`)로 불러와 실시간으로 화면에 렌더링합니다.
* **인터랙티브 모달 시스템**: '서비스 준비 중' 항목 클릭 시 명확한 피드백을 제공하는 모달 창이 활성화되며, `Esc` 키 지원 등 키보드 접근성이 포함되어 있습니다.
* **SEO 최적화**: Open Graph(OG) 태그와 메타 설명 설정을 통해 검색 엔진 노출 및 SNS 공유 시 최적화된 미리보기를 지원합니다.

## 🛠️ 기술 스택 및 구동 환경

### **Front-end**
* **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Libraries**: Marked.js (Markdown), Pace.js (Loading), Font Awesome & Remixicon (Icons)
* **Fonts**: Pretendard, IBM Plex Sans KR

### **Back-end & Infrastructure**
* **Hardware**: Raspberry Pi 3B
* **OS**: Debian 13 (Trixie)
* **System**: Docker Containers
* **Web Server**: Nginx Proxy Manager (Reverse Proxy)

## 🚀 향후 계획
* **하드웨어 업그레이드**: 현재의 ARM 기반 저성능 서버에서 x64 기반 고성능 서버로 시스템을 이전할 계획입니다.
* **서비스 확장**: Proxmox 가상화 시스템을 도입하여 가상화 서비스 및 NAS 시스템을 안정적으로 구축할 예정입니다.

## 🧑‍💻 제작자
* **HANGGOK** ([@alexjeon5](https://github.com/alexjeon5))

## 📄 라이선스
이 프로젝트는 [MIT License](https://opensource.org/licenses/MIT)를 따릅니다.
