// ========================================
// Analytics Manager - Google Analytics 4 통합
// ========================================

class AnalyticsManager {
    constructor() {
        this.isEnabled = typeof gtag !== 'undefined';
        this.sessionStartTime = Date.now();
        this.sessionId = this._getSessionId();
    }

    // ========================================
    // 페이지뷰 추적
    // ========================================

    trackPageView(sectionId) {
        if (!this.isEnabled) return;

        const pageTitles = {
            'welcome': '시작 화면',
            'assessment': '진단 화면',
            'followership': '팔로워십 선택',
            'results': '결과 화면'
        };

        gtag('event', 'page_view', {
            page_title: pageTitles[sectionId] || sectionId,
            page_location: window.location.href + '#' + sectionId,
            page_path: '/' + sectionId,
            session_id: this.sessionId
        });

        console.log('📊 GA4 페이지뷰:', pageTitles[sectionId]);
    }

    // ========================================
    // 진단 관련 이벤트
    // ========================================

    trackAssessmentStart() {
        if (!this.isEnabled) return;

        gtag('event', 'assessment_start', {
            event_category: 'engagement',
            event_label: '진단 시작',
            session_id: this.sessionId
        });

        console.log('📊 GA4: 진단 시작');
    }

    trackQuestionAnswer(questionIndex, questionCategory, score) {
        if (!this.isEnabled) return;

        gtag('event', 'question_answered', {
            event_category: 'assessment',
            question_number: questionIndex + 1,
            question_category: questionCategory,
            score: score,
            session_id: this.sessionId
        });
    }

    trackAssessmentComplete(leadershipType, timeSpent) {
        if (!this.isEnabled) return;

        gtag('event', 'assessment_complete', {
            event_category: 'conversion',
            leadership_type: leadershipType.code,
            leadership_name: leadershipType.name,
            time_spent_seconds: Math.round(timeSpent / 1000),
            value: 1,
            session_id: this.sessionId
        });

        console.log('📊 GA4: 진단 완료 -', leadershipType.name);
    }

    trackFollowershipSelection(followerTypes) {
        if (!this.isEnabled) return;

        gtag('event', 'followership_selected', {
            event_category: 'engagement',
            num_followers: followerTypes.length,
            follower_types: followerTypes.map(f => f.id).join(','),
            session_id: this.sessionId
        });

        console.log('📊 GA4: 팔로워십 선택 -', followerTypes.length, '개');
    }

    // ========================================
    // 이탈 및 에러 추적
    // ========================================

    trackDropoff(currentQuestionIndex, totalQuestions) {
        if (!this.isEnabled) return;

        const progressPercent = Math.round((currentQuestionIndex / totalQuestions) * 100);

        gtag('event', 'assessment_dropoff', {
            event_category: 'engagement',
            progress_percent: progressPercent,
            question_number: currentQuestionIndex,
            session_id: this.sessionId
        });

        console.log('📊 GA4: 진단 이탈 -', progressPercent, '%');
    }

    trackError(errorMessage, errorContext) {
        if (!this.isEnabled) return;

        gtag('event', 'exception', {
            description: errorMessage,
            fatal: false,
            error_context: errorContext,
            session_id: this.sessionId
        });

        console.log('📊 GA4: 에러 -', errorMessage);
    }

    // ========================================
    // 기능 사용 추적
    // ========================================

    trackAIGrounderOpen() {
        if (!this.isEnabled) return;

        gtag('event', 'ai_grounder_open', {
            event_category: 'engagement',
            event_label: 'AI 대화창 열기',
            session_id: this.sessionId
        });

        console.log('📊 GA4: AI 그라운더 열기');
    }

    trackTeamDiagnosisCTA() {
        if (!this.isEnabled) return;

        gtag('event', 'team_diagnosis_cta_click', {
            event_category: 'conversion',
            event_label: 'Link 팀 진단 알아보기',
            value: 10,
            session_id: this.sessionId
        });

        console.log('📊 GA4: 팀 진단 CTA 클릭');
    }

    trackShareLinkCreated() {
        if (!this.isEnabled) return;

        gtag('event', 'share_link_created', {
            event_category: 'engagement',
            event_label: '공유 링크 생성',
            session_id: this.sessionId
        });

        console.log('📊 GA4: 공유 링크 생성');
    }

    trackShareLinkCopied() {
        if (!this.isEnabled) return;

        gtag('event', 'share_link_copied', {
            event_category: 'engagement',
            event_label: '공유 링크 복사',
            session_id: this.sessionId
        });

        console.log('📊 GA4: 공유 링크 복사');
    }

    // ========================================
    // 세션 정보
    // ========================================

    getSessionDuration() {
        return Date.now() - this.sessionStartTime;
    }

    _getSessionId() {
        let sessionId = sessionStorage.getItem('linkLite_analyticsSessionId');
        if (!sessionId) {
            sessionId = this._generateUUID();
            sessionStorage.setItem('linkLite_analyticsSessionId', sessionId);
        }
        return sessionId;
    }

    _generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Export
if (typeof window !== 'undefined') {
    window.AnalyticsManager = AnalyticsManager;
}
