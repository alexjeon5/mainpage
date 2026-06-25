# HANGGOK

![Maintained](https://img.shields.io/badge/Maintained-Yes-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Architecture](https://img.shields.io/badge/Architecture-ES_Module-8b5cf6)
![Design](https://img.shields.io/badge/Design-Paper_Editorial-b8542f)

**개인 서버 포트폴리오 · 서비스 랜딩 페이지**

라즈베리파이와 Oracle Cloud 위에서 직접 서비스를 운영하는 대학생의 포트폴리오 사이트입니다.
모든 콘텐츠는 JSON 데이터 파일로 관리되며, 코드를 건드리지 않고 내용을 수정할 수 있도록 설계되었습니다.

🔗 **https://www.hanggok.com**

---

## 디자인

**Paper Editorial** — 종이 위에 활자를 배열하는 에디토리얼 디자인에서 영감을 받았습니다.

- 따뜻한 오프화이트 배경(`#f7f5f0`) 위에 룰(가로선)과 타이포그래피 위계로 정보를 구성
- 그림자, 블러, 둥근 모서리를 쓰지 않고 보더와 여백만으로 구조를 표현
- 포인트 컬러는 테라코타(`#b8542f`) 하나로 제한하여 절제된 강조
- 다크 모드에서는 깊은 세피아(`#161512`) 배경에 동일한 룰 구조 유지

### 서체

| 역할 | 서체 | 용도 |
|---|---|---|
| Display | Space Grotesk | 제목, 브랜드 |
| Mono | IBM Plex Mono | 라벨, 번호, 태그, 날짜 |
| Body | Pretendard | 본문, 한글 텍스트 전체 |

---

## 아키텍처

빌드 도구 없이 **ES Module**과 **JSON 데이터 파일**만으로 구성된 모듈화 아키텍처입니다.

```
project/
├── index.html                    ← 메인 페이지 (콘텐츠 없는 셸)
├── admin/index.html              ← 관리자 콘솔
├── minecraft/index.html          ← 마인크래프트 서버 페이지
│
├── assets/
│   ├── css/style.css             ← 단일 CSS (토큰 → 레이아웃 → 컴포넌트 → 반응형)
│   │
│   ├── js/
│   │   ├── app.js                ← 진입점 — 모듈 조합 및 초기화
│   │   └── modules/
│   │       ├── utils.js          ← 공용 유틸 (경로 계산, JSON 로드, 이스케이프, 다국어 값 추출)
│   │       ├── theme.js          ← Theme 클래스 (다크/라이트 토글, 시스템 감지, 저장)
│   │       ├── i18n.js           ← I18n 클래스 (언어 전환, 옵저버 패턴)
│   │       ├── modal.js          ← Modal 클래스 (팩토리, ESC/클릭 닫기, 트리거 바인딩)
│   │       ├── about.js          ← AboutRenderer (about.json → 소개 섹션)
│   │       ├── portfolio.js      ← PortfolioRenderer (목록 + Notion식 상세 오버레이)
│   │       ├── services.js       ← ServicesRenderer (서비스 카드 + 아카이브)
│   │       ├── timeline.js       ← TimelineRenderer (타임라인 + 향후 계획)
│   │       └── admin.js          ← AdminRenderer (Admin 서비스 목록)
│   │
│   ├── data/                     ← ★ 콘텐츠 수정은 여기서만
│   │   ├── about.json            ← 개인 정보, 서버 스펙
│   │   ├── portfolio.json        ← 포트폴리오 (Notion 블록 포함)
│   │   ├── services.json         ← 서비스 카드 + 아카이브
│   │   ├── timeline.json         ← 타임라인 (ko)
│   │   ├── timeline_en.json      ← 타임라인 (en)
│   │   └── admin-services.json   ← Admin 관리 서비스
│   │
│   ├── lang/                     ← UI 텍스트 (콘텐츠와 분리)
│   │   ├── ko.json
│   │   └── en.json
│   │
│   └── img/
│       ├── profile.png
│       ├── icon.png
│       └── desc/                 ← 서비스·포트폴리오 썸네일
│
├── oldGlass/                     ← 아카이브: 글래스모피즘 버전
├── oldMarkdown/                  ← 아카이브: 마크다운 버전
└── calc/                         ← 킹받는 계산기 (독립 서브앱)
```

### 모듈 의존 관계

```
app.js
├── Theme         (독립)
├── I18n          ← utils.js
├── Modal         (독립)
├── AboutRenderer ← utils.js
├── PortfolioRenderer ← utils.js
├── ServicesRenderer  ← utils.js
├── TimelineRenderer  ← utils.js
└── AdminRenderer     ← utils.js
```

각 모듈은 **단일 책임 원칙**을 따릅니다. `app.js`가 모든 모듈을 조합하고, `I18n`의 옵저버 패턴을 통해 언어가 바뀌면 모든 렌더러가 자동으로 다시 그려집니다.

---

## 페이지 구성

### 메인 페이지 (`/`)

| 섹션 | 번호 | 데이터 출처 | 설명 |
|---|---|---|---|
| Hero | — | HTML (고정) | 프로필, 소셜 링크 |
| About | 01 | `about.json` | 개인 정보 + 서버 2대 스펙 |
| Portfolio | 02 | `portfolio.json` | 작업물 목록, 클릭 시 Notion식 상세 |
| Services | 03 | `services.json` → items | 운영 중인 서비스 카드 그리드 |
| Archive | 04 | `services.json` → archives | 이전 버전 사이트 아카이브 |
| Timeline | 05 | `timeline.json` | 연혁 + 향후 계획 |
| Contact | 06 | HTML (고정) | 연락처 |

### 서브 페이지

| 페이지 | 경로 | 설명 |
|---|---|---|
| Admin Console | `/admin/` | 서버 관리 도구 링크 (Cloudflare Zero Trust 보호) |
| Minecraft | `/minecraft/` | 서버 접속 정보, IP 복사, 실시간 상태 (mcsrvstat.us API) |

---

## 포트폴리오 상세 페이지

포트폴리오 항목을 클릭하면 전체 화면 오버레이로 **Notion과 유사한 상세 페이지**가 열립니다.

### 지원하는 블록 타입

| 타입 | JSON key | 설명 |
|---|---|---|
| `heading` | `level`, `text` | h2, h3 제목 |
| `paragraph` | `text` | 본문 단락 |
| `list` | `style`, `items` | 글머리 기호 또는 번호 목록 |
| `callout` | `emoji`, `text` | 강조 박스 (Notion 콜아웃) |
| `divider` | — | 구분선 |
| `image` | `src`, `caption` | 이미지 + 캡션 |
| `code` | `text` | 코드 블록 |
| `quote` | `text` | 인용문 |

### 예시: portfolio.json에 항목 추가

```json
{
  "id": "my-new-project",
  "tag": "Mobile App",
  "title": { "ko": "새 프로젝트", "en": "New Project" },
  "summary": { "ko": "요약 설명", "en": "Summary" },
  "thumb": "assets/img/portfolio/thumb.png",
  "chips": ["Flutter", "Firebase"],
  "detail": {
    "cover": "assets/img/portfolio/cover.png",
    "blocks": [
      { "type": "heading", "level": 2, "text": { "ko": "개요", "en": "Overview" } },
      { "type": "paragraph", "text": { "ko": "본문 내용", "en": "Body text" } },
      { "type": "list", "style": "bullet", "items": [
        { "ko": "기능 1", "en": "Feature 1" },
        { "ko": "기능 2", "en": "Feature 2" }
      ]},
      { "type": "callout", "emoji": "💡", "text": { "ko": "팁 내용", "en": "Tip" } },
      { "type": "divider" },
      { "type": "image", "src": "assets/img/portfolio/screenshot.png", "caption": { "ko": "스크린샷", "en": "Screenshot" } }
    ]
  }
}
```

---

## 콘텐츠 수정 가이드

HTML이나 JavaScript를 건드리지 않고, **JSON 파일만 편집**하면 사이트가 업데이트됩니다.

| 수정 내용 | 편집 파일 |
|---|---|
| 개인 정보 (닉네임, 직업) | `assets/data/about.json` → personal.rows |
| 서버 스펙 변경 | `assets/data/about.json` → servers |
| 포트폴리오 추가/수정 | `assets/data/portfolio.json` → items |
| 서비스 추가/수정 | `assets/data/services.json` → items |
| 아카이브 추가 | `assets/data/services.json` → archives |
| 타임라인 추가 | `assets/data/timeline.json` (en은 timeline_en.json) |
| Admin 서비스 추가 | `assets/data/admin-services.json` → groups |
| UI 텍스트 (버튼, 라벨 등) | `assets/lang/ko.json`, `en.json` |

### 다국어 값 형식

데이터 파일에서 텍스트 필드는 두 가지 형식을 지원합니다:

```json
"title": "HANGGOK"                          // 문자열 → 모든 언어에서 그대로 사용
"title": { "ko": "행국", "en": "HANGGOK" }  // 객체 → 현재 언어에 맞는 값 사용
```

---

## 기능

### 테마 시스템
- 시스템 다크 모드 설정 자동 감지
- 수동 토글 시 `localStorage`에 저장
- CSS 커스텀 프로퍼티 기반으로 전환 시 리플로우 없음

### 다국어 (i18n)
- 한국어 / 영어 전환
- UI 텍스트(`lang/*.json`)와 콘텐츠 데이터(`data/*.json`) 이중 구조
- 언어 변경 시 옵저버 패턴으로 모든 섹션 자동 재렌더링

### 접근성 (A11y)
- 시맨틱 HTML 구조
- `role`, `aria-label`, `aria-modal` 속성
- 키보드 탐색: ESC로 모달/상세 닫기, Enter로 포트폴리오 열기
- `prefers-reduced-motion` 대응 준비

### 보안
- Content Security Policy (CSP) 메타 태그
- `rel="noopener"` 외부 링크
- `referrer-policy: strict-origin-when-cross-origin`
- Admin 페이지: Cloudflare Zero Trust 접근 제어 + 진입 경고 모달

---

## 기술 스택

### Frontend

| 구분 | 기술 |
|---|---|
| Core | HTML5, CSS3, Vanilla JavaScript (ES Module) |
| Design System | CSS Custom Properties, Paper Editorial 토큰 |
| Fonts | Space Grotesk, IBM Plex Mono, Pretendard |

외부 라이브러리 없이 순수 Vanilla JS로 구현되어 있습니다.

### Infrastructure

| 서버 | 하드웨어 | OS | 역할 |
|---|---|---|---|
| Server 1 | Raspberry Pi 3B | Debian 13 (Trixie) | 가정 환경 서비스 |
| Server 2 | Oracle Cloud Ampere A1 | Ubuntu 24.04 LTS | 24시간 구동 서비스 |

두 서버 모두 Docker 컨테이너 기반으로 운영됩니다.

---

## 로컬 개발

정적 사이트이므로 아무 HTTP 서버로 실행하면 됩니다. ES Module은 `file://` 프로토콜에서 작동하지 않으므로 반드시 로컬 서버가 필요합니다.

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# VS Code
# Live Server 확장 사용
```

---

## 제작자

**HANGGOK** ([@alexjeon5](https://github.com/alexjeon5))

## 라이선스

MIT License
