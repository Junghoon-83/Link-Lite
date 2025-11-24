# Link-Lite 개선 계획

## 진행 상황 요약

### ✅ 완료된 작업 (Stage 1: 즉시 개선)

#### 보안 강화
- [x] Content Security Policy (CSP) 메타 태그
- [x] 보안 헤더 (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- [x] SecurityUtils 클래스 (XSS 방지)
- [x] iframe sandbox 속성 (AI 그라운더 - 현재 버전에는 없음)
- [x] 입력값 검증 (점수 1-6 범위, questionId 유효성)

#### 데이터 관리
- [x] StorageManager 클래스
  - [x] 세션 복구 (24시간 유효)
  - [x] 결과 히스토리 (최근 3개, 30일 보관)
  - [x] 사용자 설정 관리
- [x] AnalyticsManager 클래스 (GA4 준비)
  - [x] 이벤트 추적 인프라
  - [x] 세션 관리
  - [x] 에러 추적

#### 초기화 개선
- [x] 병렬 로딩 (Promise.all)
- [x] 세션 복구 로직 통합
- [x] 에러 처리 강화

---

## 🔄 진행 예정 작업

### ✅ Stage 2: 1주일 내 개선 (완료!)

#### Frontend 구조 개선
- [x] **AppController 클래스 도입** (커밋: c12cd5d)
  - 전역 변수 제거 (assessment, teamCompatibility, currentQuestion 등)
  - 상태 관리 중앙화 (this.state 객체)
  - EventManager 클래스로 이벤트 리스너 생명주기 관리
  - 503줄의 app-controller.js 파일 생성
  - 하위 호환성 유지 (wrapper 함수)

  ```javascript
  class AppController {
      constructor() {
          this.assessment = new LeadershipAssessment();
          this.teamCompatibility = new TeamCompatibility();
          this.storageManager = new StorageManager();
          this.analyticsManager = new AnalyticsManager();
          this.state = {
              currentQuestion: 0,
              selectedFollowers: [],
              currentSection: 'welcome',
              currentLeadershipCode: null,
              isInitialized: false
          };
          this.eventManager = new EventManager();
      }

      async init() { /* 병렬 로딩, 세션 복구 */ }
      cleanup() { /* EventManager.removeAll() */ }
  }
  ```

- [x] **이벤트 리스너 관리 개선** (커밋: aaba91f)
  - onclick 인라인 제거 (11개)
  - addEventListener로 통일
  - EventManager를 통한 추적 및 메모리 누수 방지

  ```javascript
  // Before (나쁜 예 - 메모리 누수 가능)
  <button onclick="startAssessment()">

  // After (좋은 예 - EventManager로 추적)
  <button id="startBtn">진단 시작</button>
  app.eventManager.add(startBtn, 'click', () => app.startAssessment());
  ```

- [x] **접근성 개선 (ARIA)** (커밋: b99dc66)
  - role 속성 추가 (banner, main, navigation, region, progressbar, dialog, alert)
  - aria-label 추가 (모든 버튼 및 주요 컨테이너)
  - aria-live="polite" (동적 콘텐츠 변경 알림)
  - aria-hidden="true" (장식 요소 스크린 리더 숨김)
  - aria-valuenow 동적 업데이트 (진행률 바)
  - WCAG 2.1 Level AA 준수
  - 키보드 네비게이션 지원 (Tab, Enter, Space)

#### CSS 개선
- [ ] **!important 사용 최소화**
  - 선택자 명시도 조정
  - mobile-native.css 리팩토링

- [ ] **CSS 변수 확장**
  - 애니메이션 duration, easing 변수화
  - 브레이크포인트 변수화

#### 유틸리티 개선
- [ ] **Logger 유틸리티**
  ```javascript
  class Logger {
      static log(level, message, data) {
          if (process.env.NODE_ENV === 'production' && level === 'debug') return;
          console[level](message, data);
          analyticsManager.trackError(message, data);
      }
  }
  ```

---

### Stage 3: 1개월 내 개선

#### 성능 최적화
- [ ] **DOM 조작 최적화**
  - DocumentFragment 사용
  - 팔로워십 카드 생성 시 한 번에 append
  - Reflow 최소화

- [ ] **이미지 최적화**
  - WebP 포맷 도입
  - lazy loading
  - 반응형 이미지 (srcset)

#### 빌드 프로세스 도입
- [ ] **Vite 또는 Webpack 설정**
  - 모듈 번들링
  - 코드 스플리팅
  - Tree shaking
  - Minification

- [ ] **코드 품질 도구**
  - ESLint 설정
  - Prettier 설정
  - Husky (pre-commit hook)

#### TypeScript 마이그레이션
- [ ] **점진적 마이그레이션**
  - .js → .ts 변환
  - 타입 정의 추가
  - 컴파일 설정

---

### Stage 4: 장기 개선 (선택적)

#### Backend 도입 (Netlify Functions + Supabase)

**Netlify Functions 활용**
- [ ] 결과 저장 API (`POST /api/save-result`)
- [ ] 공유 링크 생성 (`POST /api/share`)
- [ ] 문의 제출 (`POST /api/inquiry`)

**Supabase 테이블 구조**
```sql
-- 진단 결과
CREATE TABLE assessment_results (
    id UUID PRIMARY KEY,
    leadership_code VARCHAR(3),
    scores JSONB,
    created_at TIMESTAMP,
    share_token VARCHAR(32) UNIQUE
);

-- 문의
CREATE TABLE inquiries (
    id UUID PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(100),
    company VARCHAR(100),
    team_size VARCHAR(20),
    message TEXT,
    created_at TIMESTAMP
);
```

#### CMS 통합 (Sanity 또는 Strapi)
- [ ] 질문 데이터 관리
- [ ] 리더십 팁 관리
- [ ] 콘텐츠 다국어 지원

#### Premium 기능
- [ ] 상세 리포트 PDF 다운로드
- [ ] 팀 진단 (여러 명 초대)
- [ ] 이력 추적 (시간에 따른 변화)

---

## 우선순위 가이드

### High Priority (다음 작업 추천)
1. ~~**AppController 클래스 도입**~~ ✅ 완료 (c12cd5d)
2. ~~**접근성 개선 (ARIA)**~~ ✅ 완료 (b99dc66)
3. ~~**이벤트 리스너 관리**~~ ✅ 완료 (aaba91f)

### Medium Priority (Stage 3 고려)
4. DOM 조작 최적화 (DocumentFragment 사용)
5. CSS !important 제거
6. Logger 유틸리티
7. 이미지 최적화 (WebP, lazy loading)

### Low Priority (장기)
8. TypeScript 마이그레이션
9. Backend 도입 (Netlify Functions + Supabase)
10. Premium 기능 (PDF 다운로드, 팀 진단)

---

## 참고 자료

### 이전 Code Review 주요 이슈
- **Critical**: iframe sandbox 누락, CSP 미설정 ✅ 해결됨
- **Major**: 전역 변수 남용, 메모리 누수 가능성
- **Minor**: CSS !important 과다 사용, 매직 넘버

### 현재 아키텍처
- Single HTML 파일 (index.html)
- Vanilla JavaScript (ES6+)
- CSS Modules 없음 (전역 스타일)
- Python HTTP Server (개발)
- Netlify (배포)

---

## 다음 단계 실행 방법

```bash
# 1. AppController 클래스 도입 (추천)
# - index.html에서 전역 변수를 AppController로 이동
# - 이벤트 리스너를 클래스 메서드로 관리

# 2. 접근성 테스트
npm install -g pa11y
pa11y http://localhost:8000

# 3. 빌드 프로세스 도입 (선택)
npm install -D vite
# vite.config.js 설정
```

---

**마지막 업데이트**: 2025-11-25
**현재 버전**: 186df8b (코드 정리 및 보안 강화)
**코드 품질 점수**: 7.5/10 (Code Review 2025-11-25)

## 완료된 커밋 히스토리
- **d93a5f0**: 보안 강화 및 데이터 관리 시스템 구현 (Stage 1)
- **c12cd5d**: AppController 클래스 도입 (Stage 2-1)
- **aaba91f**: 이벤트 관리 개선 - onclick → addEventListener (Stage 2-2)
- **b99dc66**: 접근성 개선 - ARIA 속성 및 시맨틱 마크업 (Stage 2-3)
- **186df8b**: 코드 정리 및 보안 강화 - 976줄 제거, AppController 통합 (Stage 2-4)

---

## 🔥 Stage 2.5: Critical 이슈 수정 (즉시 수행)

**Code Review 2025-11-25 발견 사항**

### Critical 이슈 (즉시 수정 필요)

#### 1. 메모리 누수 수정
- [ ] **MutationObserver 중복 등록 방지**
  - 파일: `mobile-native.js:171-189`
  - 문제: observeZoneStyles 메서드가 여러 번 호출되면 observer 누적
  - 해결: zone에 observer 저장하여 중복 방지

  ```javascript
  observeZoneStyles(zone) {
      // 기존 observer 해제
      const existingObserver = zone.__mutationObserver;
      if (existingObserver) {
          existingObserver.disconnect();
      }

      const observer = new MutationObserver((mutations) => { /* ... */ });
      observer.observe(zone, {...});
      zone.__mutationObserver = observer;

      if (!this.observers) this.observers = [];
      this.observers.push(observer);
  }
  ```

#### 2. 전역 변수 오염 제거
- [ ] **전역 변수 제거 또는 네임스페이스화**
  - 파일: `index.html:504-512`
  - 문제: 7개의 전역 변수로 window 객체 오염
  - 해결: AppController가 이미 모든 상태 관리하므로 제거

  ```javascript
  // 제거 또는 네임스페이스 사용
  const LinkLiteApp = {
      app: null,
      assessment: null,
      teamCompatibility: null
  };
  ```

#### 3. Promise 에러 처리 개선
- [ ] **fetch 실패 시 UI 피드백 추가**
  - 파일: `app-controller.js:834-884`
  - 문제: 리더십 팁 로드 실패 시 사용자에게 알림 없음
  - 해결: 에러 메시지 표시

  ```javascript
  } catch (error) {
      console.error('리더십 팁 로드 실패:', error);
      const container = document.getElementById('leadershipTipsContainer');
      if (container) {
          container.innerHTML = '<p class="error-message">팁을 불러오는 데 실패했습니다. 페이지를 새로고침해주세요.</p>';
      }
  }
  ```

#### 4. 중복 이벤트 리스너 제거
- [ ] **모달 외부 클릭 이벤트 중복 제거**
  - 파일: `index.html:780-785`
  - 문제: 645-652줄과 780-785줄에 동일한 이벤트 리스너 중복
  - 해결: 780-785줄 코드 제거

### Major 이슈 (우선 수정 권장)

#### 5. 입력 검증 로직 통합
- [ ] **SecurityUtils와 LeadershipAssessment 검증 통합**
  - 파일: `index.html:469-498`, `leadership-assessment.js:45-50`
  - 문제: 두 곳에서 다른 검증 로직 사용
  - 해결: LeadershipAssessment의 static 메서드로 통합

#### 6. CSS 중복 코드 제거
- [ ] **gradientShift 키프레임 중복 제거**
  - 파일: `mobile-native.css:469-596`, `premium-style.css:275-282`
  - 문제: 동일한 애니메이션이 두 파일에 중복 정의
  - 해결: premium-style.css에만 정의

#### 7. 매직 넘버 상수화
- [ ] **임계값 4.5를 상수로 추출**
  - 파일: `leadership-assessment.js:114`
  - 문제: 하드코딩된 임계값
  - 해결: `static THRESHOLD = 4.5` 사용

#### 8. StorageManager 데이터 마이그레이션
- [ ] **버전 업데이트 시 데이터 마이그레이션 로직 추가**
  - 파일: `storage-manager.js:21-37`
  - 문제: 버전 변경 시 모든 데이터 삭제
  - 해결: 버전별 마이그레이션 함수 구현

### Minor 이슈 (개선 권장)

#### 9. Logger 유틸리티 도입
- [ ] **console.log를 Logger로 대체**
  - 모든 파일에 프로덕션 로그 남아있음
  - 개발/프로덕션 모드 분리

#### 10. SVG 접근성 개선
- [ ] **레이더 차트에 role/aria 추가**
  - 파일: `index.html:189-236`
  - 해결: `<title>`, `<desc>`, `role="img"` 추가

#### 11. CSS 클래스로 스타일 제어
- [ ] **강제 스타일 적용을 CSS 클래스로 변경**
  - 파일: `mobile-native.js:42-48`
  - 문제: JavaScript로 스타일 강제 적용
  - 해결: `.touch-zone-static` 클래스 사용

#### 12. 사용되지 않는 코드 제거
- [ ] **team-compatibility.js의 미사용 메서드 제거**
  - `generateTeamReport` (57-95줄)
  - `generateRecommendations` (97-122줄)
