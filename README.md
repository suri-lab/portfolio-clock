# Portfolio Desktop Clock

> Glassmorphism UI + 다중 시간대 + 일출/일몰 동적 테마 + 눈 건강 알림 + Electron 데스크탑 앱

포트폴리오 첫 페이지 시연용 데스크탑 시계 앱. React + Vite + Tailwind CSS로 구현한 웹 앱이자 **Electron으로 패키징된 Windows 실행파일**(.exe)을 함께 제공합니다.

🌐 **웹 버전:** https://portfolio-clock.vercel.app

---

## 주요 기능

### 1. Glassmorphism 시계 UI
- SVG 아날로그 시계 침 (시·분·초) + 디지털 시각(HH:MM:SS) 동시 표시
- `backdrop-filter: blur(20px)` 반투명 유리 질감 카드 UI
- Electron: 프레임리스 창, 드래그 바, 최소화/닫기 버튼

### 2. 다중 시간대 패널
- 서울 · 뉴욕 · 런던 · 도쿄 4개 도시 실시간 표시
- `Intl.DateTimeFormat` API 사용 — 외부 라이브러리 불필요

### 3. 일출/일몰 동적 테마
- [Sunrise-Sunset API](https://sunrise-sunset.org/api) 연동, 위치 기반 실제 일출·일몰 시각 사용
- 5단계 자동 배경 전환

| 시간대 | 테마 | 배경 |
|--------|------|------|
| 새벽 (일출 -2h) | Dawn | `#0f0c29 → #302b63 → #24243e` |
| 일출 후 3시간 | Sunrise | `#FF6B35 → #F7C59F → #EFEFD0` |
| 낮 | Daytime | `#74b9ff → #a29bfe → #dfe6e9` |
| 일몰 후 2시간 | Sunset | `#fd79a8 → #e17055 → #fdcb6e` |
| 밤 | Night | `#0f2027 → #203a43 → #2c5364` |

### 4. 눈 건강 알림 (20-20-20 Rule)
- 20분 집중 → 20초간 6m(20피트) 거리 응시 알림
- Web Notifications API 팝업 + 화면 오버레이 배너
- Electron: 네이티브 OS 알림으로 자동 전환
- 권한 거부 시 화면 내 배너로 자동 폴백

### 5. 날씨 미니위젯
- [OpenWeatherMap API](https://openweathermap.org/api) 연동, 현재 위치 기온·체감온도·날씨 아이콘 표시
- 60개 날씨 코드 → 자연스러운 한국어 직접 매핑 (`lang=ko` 미사용)
- 10분 간격 자동 갱신, API 키 미설정 시 안내 메시지 표시

### 6. D-Day 카운트다운
- 중요 날짜 등록 후 D-Day 상시 표시
- `localStorage` 영속화 — 새로고침 후에도 유지

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프레임워크 | React 19 |
| 빌드 도구 | Vite 5 |
| 스타일링 | Tailwind CSS 3 |
| 데스크탑 앱 | Electron 42 + electron-builder |
| 날씨 API | OpenWeatherMap Current Weather 2.5 |
| 일출/일몰 | Sunrise-Sunset API (무료·무키) |
| 알림 | Web Notifications API / Electron Notification |
| 저장소 | localStorage (브라우저 내장) |

---

## 시작하기 — 웹 개발

### 1. 저장소 클론

```bash
git clone https://github.com/suri-lab/portfolio-clock.git
cd portfolio-clock
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 날씨 API 키 설정 (선택)

날씨 위젯을 사용하려면 [OpenWeatherMap](https://openweathermap.org/api) 무료 회원가입 후 API 키를 발급받아 `.env` 파일을 생성합니다.

```bash
# .env (프로젝트 루트에 생성, 절대 커밋 금지)
VITE_WEATHER_API_KEY=발급받은_키_여기에
```

> API 키 없이도 시계·시간대·테마·눈 건강·D-Day 기능은 모두 정상 동작합니다.

### 4. 개발 서버 실행

```bash
npm run dev
# → http://localhost:5173
```

### 5. 프로덕션 빌드

```bash
npm run build
# → dist/ 폴더에 정적 파일 생성
```

---

## Electron 데스크탑 앱 빌드 (Windows)

### 빌드

```bash
# 아이콘 생성 + 앱 번들 + exe 패키징
npm run electron:build:win
```

빌드 결과물:
- `dist-electron/Portfolio Clock 1.0.0.exe` — 포터블 단일 실행파일 (약 87MB)
- `dist-electron/win-unpacked/` — 압축 해제 버전 폴더

### 배포 방법

| 방법 | 파일 | 비고 |
|------|------|------|
| 포터블 exe | `Portfolio Clock 1.0.0.exe` | 파일 하나, 설치 불필요 |
| 폴더 배포 | `win-unpacked/` 폴더 전체 ZIP | `Portfolio Clock.exe` 실행 |

### Electron 주요 기능
- 프레임리스 창 (420×720), 항상 위 표시
- 시스템 트레이 아이콘 (보이기/숨기기, 항상 위 표시 토글, 종료)
- 창 닫기 → 트레이로 숨김 (완전 종료는 트레이 메뉴 사용)
- 네이티브 OS 알림 (눈 건강 알림)
- IPC로 날씨 API 키 안전 전달

---

## 프로젝트 구조

```
portfolio-clock/
├─ electron/
│  ├─ main.cjs          # Electron 메인 프로세스
│  └─ preload.cjs       # contextBridge IPC 노출
├─ scripts/
│  ├─ build-electron.cjs  # esbuild 기반 번들러 (Vite 대체)
│  └─ create-icon.cjs     # 순수 Node.js PNG/ICO 생성기
├─ src/
│  ├─ components/
│  │  ├─ ClockFace.jsx       # 아날로그 + 디지털 시계
│  │  ├─ WorldClocks.jsx     # 다중 시간대 패널
│  │  ├─ WeatherWidget.jsx   # 날씨 미니위젯
│  │  ├─ EyeGuard.jsx        # 눈 건강 알림
│  │  └─ DDayCounter.jsx     # D-Day 카운트다운
│  ├─ hooks/
│  │  ├─ useClock.js         # 1초 간격 시계 상태
│  │  ├─ useWeather.js       # 날씨 데이터 패칭
│  │  └─ useSunTheme.js      # 일출/일몰 기반 테마 계산
│  ├─ utils/
│  │  ├─ themeCalc.js        # 5단계 테마 정의 및 계산 로직
│  │  ├─ timeFormat.js       # 시간대별 포맷 헬퍼
│  │  └─ weatherDesc.js      # 날씨 코드 → 한국어 매핑 (60개)
│  └─ App.jsx                # 루트 컴포넌트 (Electron 감지 포함)
├─ assets/
│  ├─ icon.png          # 512×512 앱 아이콘
│  └─ icon.ico          # Windows ICO (256/64/32px)
├─ electron-builder.yml  # 패키징 설정
└─ vite.config.js        # base: './' (Electron file:// 대응)
```

---

## 보안

- `VITE_WEATHER_API_KEY` 는 `.env` 파일로만 관리
- `.env` 는 `.gitignore` 에 포함 — **절대 커밋 금지**
- Electron에서는 `contextBridge` + IPC로 안전하게 렌더러에 전달
- Sunrise-Sunset API 는 키 불필요

---

## 배포

**Vercel (웹):** 저장소 연결 후 Environment Variables에 `VITE_WEATHER_API_KEY` 추가 → `main` 푸시 시 자동 배포

**Windows 데스크탑:** `npm run electron:build:win` → `dist-electron/` 내 exe 배포

---

## 라이선스

MIT

---

*Portfolio Desktop Clock 기술명세서 v1.1 | 황수리 | 2026.06*
