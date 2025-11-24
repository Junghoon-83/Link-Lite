// ========================================
// Storage Manager - LocalStorage 기반 상태 관리
// ========================================

class StorageManager {
    constructor() {
        this.APP_VERSION = '2.0.0'; // 버전 변경 시 캐시 자동 정리
        this.STORAGE_KEYS = {
            CURRENT_SESSION: 'linkLite_currentSession',
            RESULTS_HISTORY: 'linkLite_resultsHistory',
            USER_PREFERENCES: 'linkLite_preferences',
            APP_VERSION: 'linkLite_appVersion'
        };
        this.MAX_RESULTS = 3;
        this.EXPIRY_DAYS = 30;

        // 버전 체크 및 마이그레이션
        this._checkVersion();
    }

    _checkVersion() {
        const storedVersion = localStorage.getItem(this.STORAGE_KEYS.APP_VERSION);

        if (storedVersion !== this.APP_VERSION) {
            console.log(`버전 변경 감지: ${storedVersion} → ${this.APP_VERSION}`);
            console.log('LocalStorage 초기화 중...');

            // 모든 저장된 데이터 삭제
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });

            // 새 버전 저장
            localStorage.setItem(this.STORAGE_KEYS.APP_VERSION, this.APP_VERSION);
            console.log('✓ LocalStorage 초기화 완료');
        }
    }

    // ========================================
    // 현재 세션 관리
    // ========================================

    saveCurrentSession(assessment, currentQuestionIndex) {
        const session = {
            id: this._getCurrentSessionId() || this._generateUUID(),
            startedAt: Date.now(),
            lastUpdatedAt: Date.now(),
            currentQuestionIndex: currentQuestionIndex,
            responses: { ...assessment.responses },
            isComplete: assessment.isComplete ? assessment.isComplete() : false
        };

        try {
            localStorage.setItem(this.STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
            console.log('세션 저장 완료:', session.id);
        } catch (e) {
            console.error('LocalStorage 저장 실패:', e);
            // Quota 초과 시 오래된 결과 삭제
            this._cleanupOldResults();
        }
    }

    restoreCurrentSession() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.CURRENT_SESSION);
            if (!data) return null;

            const session = JSON.parse(data);

            // 24시간 이상 경과한 세션은 무효
            if (Date.now() - session.lastUpdatedAt > 24 * 60 * 60 * 1000) {
                this.clearCurrentSession();
                return null;
            }

            return session;
        } catch (e) {
            console.error('세션 복구 실패:', e);
            return null;
        }
    }

    clearCurrentSession() {
        localStorage.removeItem(this.STORAGE_KEYS.CURRENT_SESSION);
    }

    // ========================================
    // 결과 히스토리 관리
    // ========================================

    saveResult(leadershipResult, selectedFollowers) {
        const result = {
            id: this._generateUUID(),
            completedAt: Date.now(),
            leadershipType: {
                code: leadershipResult.code,
                name: leadershipResult.type.name,
                subtitle: leadershipResult.type.subtitle
            },
            scores: { ...leadershipResult.scores },
            selectedFollowers: selectedFollowers.map(f => ({
                id: f.id,
                name: f.name,
                memberName: f.memberName
            })),
            expiresAt: Date.now() + (this.EXPIRY_DAYS * 24 * 60 * 60 * 1000)
        };

        try {
            const history = this.getResultsHistory();
            history.unshift(result);

            // 최대 3개만 유지
            const trimmedHistory = history.slice(0, this.MAX_RESULTS);

            localStorage.setItem(
                this.STORAGE_KEYS.RESULTS_HISTORY,
                JSON.stringify(trimmedHistory)
            );

            // 현재 세션 클리어
            this.clearCurrentSession();

            console.log('결과 저장 완료:', result.id);
            return result.id;
        } catch (e) {
            console.error('결과 저장 실패:', e);
            this._cleanupOldResults();
            return null;
        }
    }

    getResultsHistory() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.RESULTS_HISTORY);
            if (!data) return [];

            const history = JSON.parse(data);

            // 만료된 결과 필터링
            const validHistory = history.filter(r => r.expiresAt > Date.now());

            // 만료된 것이 있으면 업데이트
            if (validHistory.length !== history.length) {
                localStorage.setItem(
                    this.STORAGE_KEYS.RESULTS_HISTORY,
                    JSON.stringify(validHistory)
                );
            }

            return validHistory;
        } catch (e) {
            console.error('히스토리 조회 실패:', e);
            return [];
        }
    }

    getResult(id) {
        const history = this.getResultsHistory();
        return history.find(r => r.id === id);
    }

    // ========================================
    // 사용자 설정 관리
    // ========================================

    savePreferences(prefs) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
        } catch (e) {
            console.error('설정 저장 실패:', e);
        }
    }

    getPreferences() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.USER_PREFERENCES);
            return data ? JSON.parse(data) : {
                hasSeenWelcome: false,
                preferredLanguage: 'ko',
                lastVisitAt: Date.now()
            };
        } catch (e) {
            return { hasSeenWelcome: false, preferredLanguage: 'ko', lastVisitAt: Date.now() };
        }
    }

    // ========================================
    // 데이터 정리
    // ========================================

    clearAllData() {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('모든 로컬 데이터 삭제 완료');
    }

    _cleanupOldResults() {
        const history = this.getResultsHistory();
        // 가장 오래된 것 하나 삭제
        if (history.length > 0) {
            history.pop();
            localStorage.setItem(
                this.STORAGE_KEYS.RESULTS_HISTORY,
                JSON.stringify(history)
            );
        }
    }

    // ========================================
    // 유틸리티
    // ========================================

    getStorageInfo() {
        let totalSize = 0;
        Object.values(this.STORAGE_KEYS).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                totalSize += item.length;
            }
        });

        return {
            usedBytes: totalSize,
            usedKB: (totalSize / 1024).toFixed(2),
            estimatedQuota: '5-10 MB (브라우저별 상이)'
        };
    }

    _generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    _getCurrentSessionId() {
        const session = this.restoreCurrentSession();
        return session ? session.id : null;
    }
}

// Export
if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
}
