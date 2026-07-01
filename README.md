<div align="center">

# HANGGOK

**개인 서버 포트폴리오 · 서비스 랜딩 페이지**

라즈베리파이와 Oracle Cloud 위에서 직접 서비스를 운영하는 대학생의 포트폴리오 사이트입니다.<br>
프레임워크 없이 순수 Vanilla JavaScript로 만들었으며, 모든 콘텐츠는 JSON 데이터로 관리됩니다.

[![Website](https://img.shields.io/badge/Website-hanggok.com-b8542f?style=flat-square)](https://www.hanggok.com)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-2f9e44?style=flat-square)](https://github.com/alexjeon5/mainpage)
[![License](https://img.shields.io/badge/License-MIT-3457d5?style=flat-square)](LICENSE)
![No Framework](https://img.shields.io/badge/Framework-None_(Vanilla_JS)-f7df1e?style=flat-square)
![Architecture](https://img.shields.io/badge/Architecture-ES_Module-8b5cf6?style=flat-square)

<br>

![Main Page](docs/screenshots/main-light.png)

</div>

---

## 목차

- [소개](#소개)
- [주요 기능](#주요-기능)
- [디자인](#디자인)
- [프로젝트 구조](#프로젝트-구조)
- [콘텐츠 수정 가이드](#콘텐츠-수정-가이드)
- [로컬 실행](#로컬-실행)
- [인프라](#인프라)
- [라이선스](#라이선스)

---

## 소개

**HANGGOK**은 개인 서버의 관문 역할을 하는 랜딩 페이지이자 프로젝트 포트폴리오 사이트입니다.

이 프로젝트의 핵심 설계 원칙은 **관심사의 분리(Separation of Concerns)** 입니다. HTML은 구조만, CSS는 스타일만, JavaScript는 동작만 담당하며, **실제 콘텐츠(텍스트, 링크, 프로젝트 정보)는 전부 JSON 데이터 파일로 분리**되어 있습니다. 덕분에 코드를 한 줄도 건드리지 않고 JSON만 수정하여 사이트 내용을 업데이트할 수 있습니다.

---

## 주요 기능

### 🎨 데이터 드리븐 아키텍처
모든 섹션(About, Portfolio, Services, Archive, Timeline)이 JSON 파일에서 콘텐츠를 읽어 동적으로 렌더링됩니다. 새 프로젝트나 서비스를 추가할 때 HTML을 편집할 필요가 없습니다.

### 📄 Notion 스타일 포트폴리오
포트폴리오 항목을 클릭하면 전체 화면 상세 페이지가 열립니다. 제목, 단락, 목록, 콜아웃, 구분선, 이미지, 코드, 인용문 등 **8종의 블록 타입**을 JSON으로 조합하여 문서를 구성합니다. URL 해시 라우팅을 지원해 브라우저 뒤로가기와 링크 공유가 가능합니다.

### 🌗 다크 / 라이트 테마
시스템 설정을 자동 감지하며, 수동 전환 시 `localStorage`에 저장되어 유지됩니다. CSS 커스텀 프로퍼티 기반이라 전환이 부드럽습니다.

### 🌏 한국어 / 영어 다국어 (i18n)
UI 텍스트와 콘텐츠 데이터 모두 이중 언어를 지원합니다. 옵저버 패턴으로 언어 변경 시 모든 섹션이 자동으로 다시 렌더링됩니다.

### 🖥️ 서브 페이지
- **Admin Console** — 두 서버의 관리 도구 링크를 한곳에 모은 콘솔 (Cloudflare Zero Trust 보호)
- **Minecraft** — 서버 접속 정보, 원클릭 IP 복사, [mcsrvstat.us](https://mcsrvstat.us) API를 통한 실시간 온라인 상태 및 버전 표시

### ♿ 접근성 & 보안
WAI-ARIA 속성, 키보드 탐색(ESC/Enter), Content Security Policy, `rel="noopener"` 외부 링크를 적용했습니다.

---

## 디자인

**Paper Editorial** — 종이 위에 활자를 배열하는 편집 디자인에서 영감을 받았습니다.

- 따뜻한 오프화이트 배경 위에 **룰(가로선)과 타이포그래피 위계**로 정보를 구성
- 그림자·블러·둥근 모서리를 배제하고 보더와 여백만으로 구조를 표현
- 포인트 컬러는 테라코타(`#b8542f`) 하나로 절제
- 다크 모드는 깊은 세피아(`#161512`) 배경에 동일한 룰 구조 유지

**서체** — Space Grotesk (제목) · IBM Plex Mono (라벨/번호) · Pretendard (본문/한글)

---

## 프로젝트 구조

```
mainpage/
├── index.html                    # 메인 페이지 (콘텐츠 없는 셸)
├── admin/                        # 관리자 콘솔
├── minecraft/                    # 마인크래프트 서버 페이지
│
├── assets/
│   ├── css/
│   │   └── style.css             # 단일 CSS (토큰 → 레이아웃 → 컴포넌트 → 반응형)
│   │
│   ├── js/
│   │   ├── app.js                # 진입점 — 모듈 조합 및 초기화
│   │   └── modules/              # 기능별 ES 모듈
│   │       ├── utils.js          #   공용 유틸 (경로, JSON 로드, 이스케이프, 다국어)
│   │       ├── theme.js          #   테마 토글
│   │       ├── i18n.js           #   다국어 (옵저버 패턴)
│   │       ├── modal.js          #   모달 팩토리
│   │       ├── about.js          #   About 렌더러
│   │       ├── portfolio.js      #   포트폴리오 + Notion식 상세
│   │       ├── services.js       #   서비스 카드 + 아카이브
│   │       ├── timeline.js       #   타임라인 + 향후 계획
│   │       └── admin.js          #   Admin 서비스 목록
│   │
│   ├── data/                     # ★ 콘텐츠는 전부 여기서 관리
│   │   ├── about.json            #   개인 정보 · 서버 스펙
│   │   ├── portfolio.json        #   포트폴리오 (Notion 블록 포함)
│   │   ├── services.json         #   서비스 카드 + 아카이브
│   │   ├── timeline.json         #   타임라인 (KO)
│   │   ├── timeline_en.json      #   타임라인 (EN)
│   │   └── admin-services.json   #   Admin 관리 서비스
│   │
│   ├── lang/                     # UI 텍스트 (콘텐츠와 분리)
│   │   ├── ko.json
│   │   └── en.json
│   │
│   └── img/
│
├── oldGlass/                     # 아카이브: 글래스모피즘 버전
└── oldMarkdown/                  # 아카이브: 마크다운 버전
```

각 JS 모듈은 **단일 책임 원칙**을 따르며, `app.js`가 이들을 조합합니다. 언어가 바뀌면 `i18n` 모듈의 옵저버가 모든 렌더러를 다시 호출하는 구조입니다.

---

## 콘텐츠 수정 가이드

HTML이나 JavaScript를 건드리지 않고 **JSON 파일만 편집**하면 됩니다.

| 수정할 내용 | 편집 파일 |
|---|---|
| 개인 정보 (닉네임, 직업) | `assets/data/about.json` → `personal` |
| 서버 스펙 | `assets/data/about.json` → `servers` |
| 포트폴리오 추가/수정 | `assets/data/portfolio.json` |
| 서비스 카드 | `assets/data/services.json` → `items` |
| 아카이브 | `assets/data/services.json` → `archives` |
| 타임라인 | `assets/data/timeline.json` (EN: `timeline_en.json`) |
| Admin 서비스 | `assets/data/admin-services.json` |
| UI 텍스트 (버튼, 라벨) | `assets/lang/ko.json`, `en.json` |

### 다국어 값 형식

텍스트 필드는 두 가지 형식을 지원합니다.

```json
"title": "HANGGOK"                          // 문자열 → 모든 언어 공통
"title": { "ko": "행국", "en": "HANGGOK" }  // 객체 → 언어별 값
```

### 포트폴리오 항목 추가 예시

```json
{
  "id": "my-project",
  "tag": "Web Development",
  "title": { "ko": "새 프로젝트", "en": "New Project" },
  "summary": { "ko": "한 줄 요약", "en": "One-line summary" },
  "thumb": "assets/img/portfolio/thumb.png",
  "chips": ["React", "TypeScript"],
  "detail": {
    "cover": "assets/img/portfolio/cover.png",
    "blocks": [
      { "type": "heading", "level": 2, "text": { "ko": "개요", "en": "Overview" } },
      { "type": "paragraph", "text": { "ko": "본문", "en": "Body" } },
      { "type": "list", "style": "bullet", "items": [
        { "ko": "항목 1", "en": "Item 1" }
      ]},
      { "type": "callout", "emoji": "💡", "text": { "ko": "팁", "en": "Tip" } },
      { "type": "divider" },
      { "type": "image", "src": "assets/img/portfolio/shot.png",
        "caption": { "ko": "스크린샷", "en": "Screenshot" } }
    ]
  }
}
```

**지원 블록 타입**: `heading` · `paragraph` · `list` · `callout` · `divider` · `image` · `code` · `quote`

---

## 로컬 실행

ES Module을 사용하므로 `file://`로 직접 열면 CORS 정책에 막혀 작동하지 않습니다. **반드시 로컬 HTTP 서버로 실행**하세요.

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

브라우저에서 `http://localhost:8080` 접속.

---

## 인프라

| 서버 | 하드웨어 | OS | 웹 서버 |
|---|---|---|---|
| Server 1 | Raspberry Pi 3B | Debian 13 (Trixie) | Nginx Proxy Manager |
| Server 2 | Oracle Cloud Ampere A1 | Ubuntu 24.04 LTS | NPMplus |

두 서버 모두 **Docker 컨테이너** 기반으로 운영됩니다. 24시간 구동이 필요한 서비스는 Oracle Cloud에서, 가정 환경 전용 서비스는 라즈베리파이에서 실행합니다.

---

## 기술 스택

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Raspberry Pi](https://img.shields.io/badge/Raspberry_Pi-A22846?style=flat-square&logo=raspberrypi&logoColor=white)
![Oracle Cloud](https://img.shields.io/badge/Oracle_Cloud-F80000?style=flat-square&logo=oracle&logoColor=white)

빌드 도구, 번들러, 프레임워크 없이 순수 웹 표준으로 구현했습니다.

---

## 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

## 제작자

**HANGGOK** — [@alexjeon5](https://github.com/alexjeon5) · [hanggok.com](https://www.hanggok.com)
