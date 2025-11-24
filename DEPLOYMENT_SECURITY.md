# 배포 플랫폼별 보안 헤더 설정 가이드

## 개요

현재 `index.html`의 `<meta>` 태그에 CSP를 설정했지만, 일부 보안 헤더는 HTTP 헤더로만 설정 가능합니다:
- `frame-ancestors` (CSP 지시어)
- `X-Frame-Options`

각 배포 플랫폼별로 HTTP 헤더를 설정하는 방법을 안내합니다.

---

## Netlify

### 설정 방법

`public/_headers` 파일 생성:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://link-coach.vercel.app https://www.google-analytics.com https://analytics.google.com; frame-src https://link-coach.vercel.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 배포 시 자동 적용

Git push 시 Netlify가 자동으로 `_headers` 파일을 읽어 적용합니다.

---

## Vercel

### 설정 방법

`vercel.json` 파일 생성:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://link-coach.vercel.app https://www.google-analytics.com https://analytics.google.com; frame-src https://link-coach.vercel.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

### 배포 시 자동 적용

Git push 또는 `vercel deploy` 명령 시 자동 적용됩니다.

---

## AWS S3 + CloudFront

### CloudFront 설정

1. **CloudFront 콘솔** 접속
2. Distribution 선택 → **Behaviors** 탭
3. Default behavior 편집
4. **Response Headers Policy** 생성:

```json
{
  "SecurityHeadersPolicy": {
    "ContentSecurityPolicy": {
      "Override": true,
      "ContentSecurityPolicy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://link-coach.vercel.app https://www.google-analytics.com https://analytics.google.com; frame-src https://link-coach.vercel.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    },
    "FrameOptions": {
      "Override": true,
      "FrameOption": "DENY"
    },
    "ContentTypeOptions": {
      "Override": true
    },
    "ReferrerPolicy": {
      "Override": true,
      "ReferrerPolicy": "strict-origin-when-cross-origin"
    }
  }
}
```

### Lambda@Edge (고급)

더 세밀한 제어가 필요하면 Lambda@Edge로 헤더 추가 가능.

---

## GitHub Pages

### 제한 사항

GitHub Pages는 커스텀 HTTP 헤더 설정을 지원하지 않습니다.

### 대안

1. **Cloudflare Workers** 사용 (무료)
2. **Meta 태그만 사용** (현재 방식, 일부 제한)
3. **다른 플랫폼으로 이전** (Netlify, Vercel 추천)

---

## Apache (.htaccess)

`public/.htaccess` 파일:

```apache
<IfModule mod_headers.c>
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://link-coach.vercel.app https://www.google-analytics.com https://analytics.google.com; frame-src https://link-coach.vercel.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    Header set X-Frame-Options "DENY"
    Header set X-Content-Type-Options "nosniff"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>
```

---

## Nginx

`nginx.conf` 또는 사이트 설정 파일:

```nginx
location / {
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://link-coach.vercel.app https://www.google-analytics.com https://analytics.google.com; frame-src https://link-coach.vercel.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
}
```

---

## Docker + Node.js (Express)

`server.js`:

```javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://link-coach.vercel.app", "https://www.google-analytics.com", "https://analytics.google.com"],
      frameSrc: ["https://link-coach.vercel.app"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

app.use(express.static('public'));
app.listen(3000);
```

---

## 테스트 방법

### 1. 브라우저 개발자 도구

1. F12 또는 Cmd+Opt+I
2. **Network** 탭
3. 페이지 새로고침
4. HTML 파일 클릭 → **Headers** 탭
5. **Response Headers** 확인

### 2. 온라인 도구

- **SecurityHeaders.com**: https://securityheaders.com/
- **Mozilla Observatory**: https://observatory.mozilla.org/

### 3. curl 명령어

```bash
curl -I https://link-lite.netlify.app/
```

---

## 주의사항

### CSP 정책 수정 시

1. **개발 환경에서 먼저 테스트**
2. **브라우저 콘솔에서 CSP 오류 확인**
3. **단계적으로 제한 강화**

### 'unsafe-inline' 제거 (고급)

현재 `script-src`와 `style-src`에 `'unsafe-inline'`이 있습니다.
더 안전한 방식:

1. **Nonce 사용**: 각 스크립트에 랜덤 nonce 추가
2. **Hash 사용**: 인라인 스크립트의 SHA256 해시 허용
3. **외부 파일로 분리**: 모든 JS/CSS를 별도 파일로

---

## 현재 프로젝트 상태

✅ Meta 태그 CSP 설정 완료 (`index.html`)
⚠️ HTTP 헤더 미설정 (플랫폼별 선택 필요)

### 추천 배포 플랫폼

1. **Netlify** (현재 사용 중) - `_headers` 파일만 추가
2. **Vercel** - `vercel.json` 추가
3. **CloudFlare Pages** - `_headers` 지원

---

**마지막 업데이트**: 2025-11-24
