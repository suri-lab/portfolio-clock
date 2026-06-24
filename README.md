# Portfolio Desktop Clock

> Glassmorphism UI + 다중 시간대 + 일출/일몰 동적 테마 + 눈 건강 알림

포트폴리오 첫 페이지 시연용 데스크탑 시계 앱. React + Vite + Tailwind CSS로 구현한 프론트엔드 작품으로, 수업 중 API 연동·UI 트렌드 시연 데모로도 활용 가능합니다.

---

## 주요 기능

### 1. Glassmorphism 시계 UI
- SVG 아날로그 시계 침 (시·분·초) + 디지털 시각(HH:MM:SS) 동시 표시
- `backdrop-filter: blur(20px)` 반투명 유리 질감 카드 UI

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
- 권한 거부 시 화면 내 배너로 자동 폴백

### 5. 날씨 미니위젯
- [OpenWeatherMap API](https://openweathermap.org/api) 연동, 현재 위치 기온·체감온도·날씨 아이콘 표시
- 10분 간격 자동 갱신, API 키 미설정 시 안내 메시지 표시

### 6. D-Day 카운트다운
- 중요 날짜 등록 후 D-Day 상시 표시
- `localStorage` 영속화 — 새로고침 후에도 유지

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프레임워크 | React 18 |
| 빌드 도구 | Vite 5 |
| 스타일링 | Tailwind CSS 3 |
| 날씨 API | OpenWeatherMap Current Weather 2.5 |
| 일출/일몰 | Sunrise-Sunset API (무료·무키) |
| 알림 | Web Notifications API (브라우저 내장) |
| 저장소 | localStorage (브라우저 내장) |

---

## 시작하기

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
# .env (프로젝트 루트에 생성)
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

## 프로젝트 구조

```
src/
├─ components/
│  ├─ ClockFace.jsx       # 아날로그 + 디지털 시계
│  ├─ WorldClocks.jsx     # 다중 시간대 패널
│  ├─ WeatherWidget.jsx   # 날씨 미니위젯
│  ├─ EyeGuard.jsx        # 눈 건강 알림
│  └─ DDayCounter.jsx     # D-Day 카운트다운
├─ hooks/
│  ├─ useClock.js         # 1초 간격 시계 상태
│  ├─ useWeather.js       # 날씨 데이터 패칭
│  └─ useSunTheme.js      # 일출/일몰 기반 테마 계산
├─ utils/
│  ├─ themeCalc.js        # 5단계 테마 정의 및 계산 로직
│  └─ timeFormat.js       # 시간대별 포맷 헬퍼
└─ App.jsx                # 루트 컴포넌트
```

---

## 보안

- `VITE_WEATHER_API_KEY` 는 `.env` 파일로만 관리
- `.env` 는 `.gitignore` 에 포함 — **절대 커밋 금지**
- Sunrise-Sunset API 는 키 불필요

---

## 배포

정적 파일 빌드 후 GitHub Pages 또는 Vercel로 배포 가능합니다.

**Vercel:** 저장소 연결 후 Environment Variables에 `VITE_WEATHER_API_KEY` 추가

**GitHub Pages:** GitHub Actions 워크플로에서 Secrets로 키 주입

---

## 라이선스

MIT

---

*Portfolio Desktop Clock 기술명세서 v1.1 | 황수리 | 2026.06*
