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
메인 섹션(Live, Lab, Work, Versions, Log)과 Minecraft 접속 정보가 JSON 파일에서 콘텐츠를 읽어 동적으로 렌더링됩니다. 새 프로젝트나 서비스를 추가할 때 HTML을 편집할 필요가 없습니다.

### 📄 Notion 스타일 포트폴리오
포트폴리오 항목을 클릭하면 전체 화면 상세 페이지가 열립니다. 제목, 단락, 목록, 콜아웃, 구분선, 이미지, 코드, 인용문 등 **8종의 블록 타입**을 JSON으로 조합하여 문서를 구성합니다. URL 해시 라우팅을 지원해 브라우저 뒤로가기와 링크 공유가 가능합니다.

### 🌗 다크 / 라이트 테마
시스템 설정을 자동 감지하며, 수동 전환 시 `localStorage`에 저장되어 유지됩니다. CSS 커스텀 프로퍼티로 색상을 관리하고, 지원 브라우저에서는 원형 화면 전환을 사용합니다. 동작 줄이기 설정에서는 즉시 전환됩니다.

### 🌏 한국어 / 영어 다국어 (i18n)
메인 페이지의 UI 텍스트와 콘텐츠 데이터는 한국어·영어를 지원하며, Minecraft와 Admin은 한국어로 제공됩니다. 옵저버 패턴으로 언어 변경 시 모든 섹션이 자동으로 다시 렌더링됩니다.

### 🖥️ 서브 페이지
- **Admin Console** — 두 서버의 관리 도구 링크를 한곳에 모은 콘솔 (Cloudflare Zero Trust 보호)
- **Minecraft** — 서버 접속 정보, 원클릭 IP 복사, [mcsrvstat.us](https://mcsrvstat.us) API를 통한 실시간 온라인 상태 및 버전 표시

### ♿ 접근성 & 보안
WAI-ARIA 속성, 키보드 탐색(ESC/Enter), Content Security Policy, `rel="noopener"` 외부 링크를 적용했습니다.

---

## 디자인

**Rack Board** — 직접 운영하는 서비스와 서버, 작업 기록을 하나의 보드에 정리한 디자인입니다.

- 터미널 형태의 소개, 어두운 Live 목록, 둥근 Lab·Work 카드와 가로선으로 정보 구분
- 라이트 모드: 따뜻한 배경 `#F4F2EE`, 흰 카드, 보라색 포인트 `#6A57F2`
- 다크 모드: 짙은 배경 `#07080D`, 어두운 카드, 밝은 보라색 포인트 `#B7A4FF`
- `assets/css/style.css`의 공통 토큰(`--bg`, `--surface`, `--ink`, `--accent` 등)으로 세 페이지의 색상·서체를 관리
- Minecraft 접속 패널과 터미널은 두 테마에서 모두 어두운 배경 유지
- 860px·520px 반응형 레이아웃, 키보드 포커스, 동작 줄이기 설정 지원

**서체** — Archivo (제목) · IBM Plex Sans KR (본문/한글) · JetBrains Mono (주소/라벨/번호)

---

## 프로젝트 구조

```text
mainpage/
├── index.html                    # 메인 페이지 셸
├── admin/index.html              # 관리자 콘솔
├── minecraft/index.html          # 마인크래프트 서버 접속 안내
├── assets/
│   ├── css/
│   │   ├── style.css             # 공통 토큰·헤더·버튼·모달·푸터
│   │   ├── home.css              # 메인 페이지·포트폴리오 상세
│   │   └── sub.css               # Minecraft·Admin 페이지
│   ├── js/
│   │   ├── app.js                # 페이지별 모듈 조합 및 초기화
│   │   └── modules/
│   │       ├── utils.js          # 경로·JSON 로드·이스케이프·다국어
│   │       ├── theme.js          # 저장된 테마·원형 전환
│   │       ├── i18n.js           # 언어 메뉴·텍스트 전환
│   │       ├── header.js         # 모바일 메뉴·스크롤 상태
│   │       ├── hero.js           # 터미널 소개·자동 집계 통계
│   │       ├── modal.js          # 공통 모달
│   │       ├── about.js          # Lab 서버 카드
│   │       ├── services.js       # Live 서비스 목록
│   │       ├── portfolio.js      # Work·Versions·상세 문서
│   │       ├── timeline.js       # Log·향후 계획
│   │       ├── minecraft.js      # 접속 안내·복사·상태 조회
│   │       └── admin.js          # 서비스 목록·요약·서버 필터
│   ├── data/
│   │   ├── about.json            # 개인 정보·서버 역할/스펙/앱
│   │   ├── services.json         # 공개 서비스
│   │   ├── portfolio.json        # 프로젝트·상세 블록·사이트 버전
│   │   ├── timeline.json         # 기록·계획 (KO)
│   │   ├── timeline_en.json      # 기록·계획 (EN)
│   │   ├── minecraft.json        # 주소·접속 단계·규칙
│   │   └── admin-services.json   # 관리 서비스·상태
│   ├── lang/
│   │   ├── ko.json               # 메인 UI 문구 (KO)
│   │   └── en.json               # 메인 UI 문구 (EN)
│   └── img/
│       └── opt/                  # 표시 크기에 맞춘 WebP (페이지에서 사용)
├── calc/                        # 킹받는 계산기 (공용 style.css + 사이트 헤더)
│   ├── index.html
│   ├── calc.css                  # 계산기 전용 스타일 (사이트 토큰 사용)
│   └── calc.js
├── myKNUplace/                   # 기존 서비스
├── oldGlass/                     # 글래스모피즘 버전
└── oldMarkdown/                  # 마크다운 버전
```

각 JS 모듈은 **단일 책임 원칙**을 따르며, `app.js`가 이들을 조합합니다. 언어가 바뀌면 `i18n` 모듈의 옵저버가 모든 렌더러를 다시 호출하는 구조입니다.

---

## 콘텐츠 수정 가이드

메인 콘텐츠와 Minecraft 안내, Admin 목록은 **JSON 파일만 편집**하면 됩니다. 메인 UI 문구는 `assets/lang/ko.json`, `en.json`에서 함께 관리합니다.

| 수정할 내용 | 편집 파일 / 필드 |
|---|---|
| Lab 서버 정보 | `assets/data/about.json` → `servers` |
| Live 서비스 | `assets/data/services.json` → `items` |
| Work 프로젝트 | `assets/data/portfolio.json` → `items` |
| 사이트 버전 | `assets/data/portfolio.json` → `versions` |
| Log 기록·계획 | `assets/data/timeline.json`, `timeline_en.json` |
| Minecraft 접속·규칙 | `assets/data/minecraft.json` |
| Admin 서비스 | `assets/data/admin-services.json` → `groups` |
| 메인 UI 문구 | `assets/lang/ko.json`, `en.json` |

### 공개 서비스: services.json

`items`의 각 항목은 `id`, 표시 경로 `slug`, 실제 링크 `href`, 외부 링크 여부 `external`, 미리보기 `thumb`, `title`, 분류 `cat`, 설명 `desc`, `status`, `hidden`으로 구성합니다. 서버 연관 정보를 기록하려면 선택 필드 `server`에 `s1` 또는 `s2`를 넣을 수 있습니다. 실제 링크와 공개 여부는 `href`·`status`·`hidden`으로 결정됩니다.

- `status: "online"`: 접속 가능한 서비스이며 공개 서비스 통계에 포함됩니다.
- `status: "soon"`: 준비 중인 행으로 표시하고 알림 모달을 엽니다.
- `hidden: true`: 공개 페이지의 목록과 터미널에서 제외됩니다.
- 관리 도구는 공개 데이터에 넣지 않고 `admin-services.json`에서만 관리합니다.

### 서버 정보: about.json

`servers` 항목은 `id`, `label`, 하드웨어 이름 `hw`, `badge`, 역할 설명 `role`, `spec: [{"key":"OS","value":"Debian 13 (Trixie)"}]`, 공개 앱 목록 `apps`를 사용합니다. `role`·`badge`·`apps`의 텍스트는 한국어·영어 객체를 사용할 수 있습니다. 네트워크 방식은 `spec`에 Cloudflare Tunnel로 기재합니다.

### 프로젝트와 버전: portfolio.json

프로젝트는 `items`에, 사이트의 과거·현재 버전은 `versions`에 추가합니다. 버전 필드는 `tag`, `title`, `desc`, `thumb`, `href`입니다. 현재 버전은 `current: true`로 표시하고 `thumb`·`href`를 `null`로 둘 수 있습니다. 프로젝트 상세는 아래 예시의 블록 구조를 유지합니다.

### 기록과 계획: timeline.json / timeline_en.json

`timeline`은 `{"date":"2026.04.22","text":"기록 내용"}` 형식이며 화면에서는 날짜가 최신인 순서로 정렬합니다. `plans`는 `{"title":"계획 제목","desc":"설명"}` 형식으로 작성합니다. 기존 문자열 항목도 제목만 있는 계획으로 표시할 수 있습니다. 두 언어 파일을 함께 갱신하세요.

### Minecraft: minecraft.json

`address`와 `statusApi`는 접속 주소와 상태 조회 API 접두사입니다. `hero.title`의 `\n`은 제목 줄바꿈입니다. `meta`는 `key`·`value` 목록이며 `id: "version"`인 항목은 서버가 온라인일 때 API 버전으로 갱신됩니다. `steps`와 `rules`의 `kicker`, `title`, `desc`, `items`로 접속 단계와 규칙을 편집합니다. 규칙의 `tone`은 `ban` 또는 `ask`, `tag`는 표시할 배지 문구입니다. 하단 운영 문구는 `footer`에서 바꿉니다.

### 관리 서비스: admin-services.json

`groups`는 서버 `id` (`s1` / `s2`), `server`, `label`, `services`를 포함합니다. 각 서비스는 `name`, `desc`, `url`, `status`를 사용하며, `host`는 선택 사항입니다. 생략하면 URL의 호스트를 표시하고 상대 경로는 `www.hanggok.com`으로 표시합니다.

- `online`: 새 탭에서 여는 버튼
- `disabled`: 비활성화된 버튼 (현재 Nginx Proxy Manager·NPMplus)
- `offline`: 준비 중 안내 모달

Admin 요약과 서버별 온라인 수는 데이터에서 계산합니다. 메인 통계 역시 **서버 수, 숨기지 않은 online 서비스 수, 버전 수, 가장 이른 기록의 연월**을 자동 집계하므로 숫자를 따로 수정하지 않습니다.

### 다국어 값 형식

문자열은 두 언어에서 공통으로 사용하고, 객체는 언어별로 표시합니다.

```json
{
  "title": "HANGGOK",
  "desc": { "ko": "직접 운영하는 서비스", "en": "Self-hosted services" }
}
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

| 서버 | 하드웨어 | OS | 외부 연결 |
|---|---|---|---|
| Server 1 | Raspberry Pi 3B | Debian 13 (Trixie) | Cloudflare Tunnel |
| Server 2 | Oracle Cloud Ampere A1 | Ubuntu 24.04 LTS | Cloudflare Tunnel |

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

## Credits

테마 토글 **#219**, 언어 전환 **#267**, Live 작업 목록 **#276**, 주소 복사 버튼 **#008**은 [Lucian UX/UI Prompt](https://lucianlabs.dev/uxui-prompt/)를 바탕으로 사이트에 맞게 적용했습니다.

MIT License (c) 2026 Seokwoooo. 해당 구현 파일에 원본 라이선스와 출처를 표기했습니다.

## 제작자

**HANGGOK** — [@alexjeon5](https://github.com/alexjeon5) · [hanggok.com](https://www.hanggok.com)
