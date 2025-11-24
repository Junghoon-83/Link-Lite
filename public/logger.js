/**
 * Logger Utility
 * 개발/프로덕션 환경 로그 제어
 */

class Logger {
    constructor() {
        // 현재 환경 감지 (로컬 개발 vs 배포)
        this.isDevelopment = window.location.hostname === 'localhost' ||
                            window.location.hostname === '127.0.0.1';
        this.isProduction = !this.isDevelopment;
    }

    /**
     * 일반 로그 (개발 환경에서만 출력)
     */
    log(...args) {
        if (this.isDevelopment) {
            console.log(...args);
        }
    }

    /**
     * 정보 로그 (개발 환경에서만 출력)
     */
    info(...args) {
        if (this.isDevelopment) {
            console.info(...args);
        }
    }

    /**
     * 경고 로그 (항상 출력)
     */
    warn(...args) {
        console.warn(...args);
    }

    /**
     * 에러 로그 (항상 출력 + 분석 추적)
     */
    error(message, error) {
        console.error(message, error);

        // AnalyticsManager가 있으면 에러 추적
        if (typeof window !== 'undefined' && window.app && window.app.analyticsManager) {
            window.app.analyticsManager.trackError(message, error?.message || String(error));
        }
    }

    /**
     * 디버그 로그 (개발 환경에서만 출력)
     */
    debug(...args) {
        if (this.isDevelopment) {
            console.debug(...args);
        }
    }

    /**
     * 테이블 로그 (개발 환경에서만 출력)
     */
    table(data) {
        if (this.isDevelopment && console.table) {
            console.table(data);
        }
    }

    /**
     * 그룹 로그 시작 (개발 환경에서만)
     */
    group(label) {
        if (this.isDevelopment) {
            console.group(label);
        }
    }

    /**
     * 그룹 로그 종료 (개발 환경에서만)
     */
    groupEnd() {
        if (this.isDevelopment) {
            console.groupEnd();
        }
    }

    /**
     * 성능 측정 시작
     */
    time(label) {
        if (this.isDevelopment) {
            console.time(label);
        }
    }

    /**
     * 성능 측정 종료
     */
    timeEnd(label) {
        if (this.isDevelopment) {
            console.timeEnd(label);
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.Logger = Logger;
    // 전역 인스턴스 생성
    window.logger = new Logger();
}
