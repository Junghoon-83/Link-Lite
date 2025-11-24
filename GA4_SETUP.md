# Google Analytics 4 설정 가이드

Link-Lite에 Google Analytics 4가 통합되었습니다. 실제 데이터 수집을 시작하려면 GA4 Measurement ID를 설정해야 합니다.

## 1. GA4 속성 생성

1. [Google Analytics](https://analytics.google.com) 접속
2. 관리 > 속성 만들기
3. 속성 이름: `Link-Lite`
4. 데이터 스트림 추가 > 웹
5. 웹사이트 URL: `https://link-lite.netlify.app`
6. 스트림 이름: `Link-Lite Web`

## 2. Measurement ID 확인

데이터 스트림 상세 페이지에서 **측정 ID**를 확인합니다.
- 형식: `G-XXXXXXXXXX` (예: `G-1A2B3C4D5E`)

## 3. Measurement ID 적용

`public/index.html` 파일에서 `G-XXXXXXXXXX`를 실제 Measurement ID로 교체:

```html
<!-- Line 46 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ACTUAL-ID"></script>

<!-- Line 53 -->
gtag('config', 'G-YOUR-ACTUAL-ID', {
```

**2곳 모두 교체해야 합니다!**

## 4. 추적되는 이벤트

Link-Lite는 다음 이벤트를 자동으로 추적합니다:

### 페이지뷰
- `page_view`: 섹션 전환 시 (welcome, assessment, followership, results)

### 진단 관련
- `assessment_start`: 진단 시작
- `question_answered`: 각 질문 응답 (질문 번호, 카테고리, 점수 포함)
- `assessment_complete`: 진단 완료 (리더십 유형, 소요 시간 포함)
- `followership_selected`: 팔로워십 선택 (선택 개수, 유형 포함)

### 이탈 및 에러
- `assessment_dropout`: 진단 중도 이탈 (진행률 포함)
- `error_occurred`: 에러 발생 (에러 타입, 메시지 포함)

### 기능 사용
- `feature_used`: 기능 사용 추적 (기능명 포함)

## 5. 커스텀 차원 설정 (선택사항)

GA4에서 더 상세한 분석을 위해 커스텀 차원을 설정할 수 있습니다:

1. GA4 > 관리 > 맞춤 정의 > 맞춤 측정기준 만들기
2. 다음 차원 추가:

| 차원 이름 | 이벤트 매개변수 | 범위 |
|-----------|-----------------|------|
| Leadership Type | leadership_type | 이벤트 |
| Question Category | question_category | 이벤트 |
| Progress Percent | progress_percent | 이벤트 |
| Time Spent | time_spent_seconds | 이벤트 |
| Error Type | error_type | 이벤트 |

## 6. 배포 및 테스트

### 로컬 테스트
```bash
npm start
# http://localhost:8000 접속 후 진단 진행
# 브라우저 콘솔에서 GA4 이벤트 확인
```

### 프로덕션 배포
```bash
git add public/index.html
git commit -m "GA4 Measurement ID 설정"
git push origin main
```

Netlify에 자동 배포되며, 약 1-2분 후 실시간 데이터가 GA4에 표시됩니다.

## 7. 데이터 확인

- **실시간**: GA4 > 보고서 > 실시간 (5-10초 지연)
- **이벤트**: GA4 > 보고서 > 참여도 > 이벤트 (24시간 후 집계)
- **사용자**: GA4 > 보고서 > 사용자 > 사용자 속성

## 8. 개인정보 보호 설정

Link-Lite는 기본적으로 다음 설정을 사용합니다:

- ✅ **IP 익명화**: `anonymize_ip: true`
- ✅ **쿠키 보안**: `SameSite=None;Secure`
- ✅ **수동 페이지뷰**: `send_page_view: false` (중복 방지)
- ✅ **세션 추적**: localStorage 기반 (개인정보 미포함)

## 9. 문제 해결

### GA4 이벤트가 보이지 않음
1. Measurement ID가 올바른지 확인
2. 브라우저 콘솔에서 `gtag` 함수 확인: `typeof gtag`
3. 광고 차단 확장 프로그램 비활성화
4. 실시간 보고서에서 5-10초 대기

### CSP 오류
Content Security Policy에 이미 Google Analytics가 허용되어 있습니다. 만약 오류가 발생하면 다음을 확인:
```html
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com
```

## 10. 고급 설정

### 이벤트 디버깅
```javascript
// 브라우저 콘솔에서 실행
gtag('config', 'G-YOUR-ID', { 'debug_mode': true });
```

### 특정 페이지 추적 제외
```javascript
// analytics-manager.js에서 수정
this.isEnabled = false; // 추적 완전 비활성화
```

## 참고 자료

- [GA4 공식 문서](https://support.google.com/analytics/answer/10089681)
- [gtag.js API 레퍼런스](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [GA4 이벤트 네이밍 가이드](https://support.google.com/analytics/answer/9267735)

---

**문의**: GA4 설정 중 문제가 발생하면 [GitHub Issues](https://github.com/anthropics/claude-code/issues)에 문의하세요.
