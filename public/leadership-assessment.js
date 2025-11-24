/**
 * Leadership Assessment Application
 * 리더십 진단 및 팀 궁합 분석 시스템
 */

class LeadershipAssessment {
    // 상수 정의
    static THRESHOLD = 4.5;  // High/Low 판정 임계값
    static SCORE_MIN = 1;    // 최소 점수
    static SCORE_MAX = 6;    // 최대 점수

    constructor() {
        this.questions = [];
        this.leadershipTypes = {};
        this.scaleLabels = [
            '매우 그렇지 않다',
            '그렇지 않다',
            '약간 그렇지 않다',
            '약간 그렇다',
            '그렇다',
            '매우 그렇다'
        ];

        this.responses = {};
        this.currentQuestion = 0;
        this.isInitialized = false;
    }

    async init() {
        try {
            const [questionsData, typesData] = await Promise.all([
                fetch('data/questions.json').then(r => r.json()),
                fetch('data/leadership-types.json').then(r => r.json())
            ]);

            this.questions = questionsData;
            this.leadershipTypes = typesData;
            this.isInitialized = true;

            if (typeof logger !== 'undefined') {
                logger.log('LeadershipAssessment initialized:', {
                    questionsCount: this.questions.length,
                    typesCount: Object.keys(this.leadershipTypes).length
                });
            }
        } catch (error) {
            if (typeof logger !== 'undefined') {
                logger.error('Failed to load assessment data:', error);
            } else {
                console.error('Failed to load assessment data:', error);
            }
            throw error;
        }
    }

    // 정적 검증 메서드 (SecurityUtils와 통합)
    static validateScore(value) {
        const num = typeof value === 'number' ? value : parseInt(value, 10);
        if (isNaN(num) || num < LeadershipAssessment.SCORE_MIN || num > LeadershipAssessment.SCORE_MAX) {
            return null;
        }
        return num;
    }

    recordResponse(questionId, score) {
        // 점수 검증 (정적 메서드 사용)
        const validScore = LeadershipAssessment.validateScore(score);
        if (validScore === null) {
            if (typeof logger !== 'undefined') {
                logger.error(`Invalid score: ${score} for question ${questionId}`);
            } else {
                console.error(`Invalid score: ${score} for question ${questionId}`);
            }
            return;
        }

        // questionId 검증
        const question = this.questions.find(q => q.id === questionId);
        if (!question) {
            if (typeof logger !== 'undefined') {
                logger.error(`Invalid question ID: ${questionId}`);
            } else {
                console.error(`Invalid question ID: ${questionId}`);
            }
            return;
        }

        this.responses[questionId] = validScore;
    }

    calculateScores() {
        // 카테고리별 점수 계산
        const sharingScore = this.calculateCategoryScoreByCategory('sharing');
        const interactionScore = this.calculateCategoryScoreByCategory('interaction');
        const growthScore = this.calculateCategoryScoreByCategory('growth');

        return {
            sharing: sharingScore,
            interaction: interactionScore,
            growth: growthScore
        };
    }

    calculateCategoryScoreByCategory(category) {
        // 해당 카테고리의 문항들 필터링
        const categoryQuestions = this.questions.filter(q => q.category === category);
        const questionIds = categoryQuestions.map(q => q.id);

        // 응답 점수 합산
        const total = questionIds.reduce((sum, id) => sum + (this.responses[id] || 0), 0);
        return total / questionIds.length;
    }

    calculateCategoryScore(questionIds) {
        const total = questionIds.reduce((sum, id) => sum + (this.responses[id] || 0), 0);
        return total / questionIds.length;
    }

    // 하위요인별 점수 계산
    calculateLowerFactorScores() {
        const lowerFactors = {};

        this.questions.forEach(q => {
            const lowerFactor = q.lowerFactor;
            if (!lowerFactors[lowerFactor]) {
                lowerFactors[lowerFactor] = { sum: 0, count: 0, upperFactor: q.upperFactor };
            }
            lowerFactors[lowerFactor].sum += this.responses[q.id] || 0;
            lowerFactors[lowerFactor].count += 1;
        });

        // 평균 계산
        Object.keys(lowerFactors).forEach(key => {
            lowerFactors[key].average = lowerFactors[key].sum / lowerFactors[key].count;
        });

        return lowerFactors;
    }

    determineLeadershipType() {
        const scores = this.calculateScores();
        const lowerFactorScores = this.calculateLowerFactorScores();
        const threshold = LeadershipAssessment.THRESHOLD;

        const typeCode = [
            scores.sharing >= threshold ? 'H' : 'L',
            scores.interaction >= threshold ? 'H' : 'L',
            scores.growth >= threshold ? 'H' : 'L'
        ].join('');

        return {
            code: typeCode,
            type: this.leadershipTypes[typeCode],
            scores: scores,
            lowerFactorScores: lowerFactorScores
        };
    }

    getQuestion(index) {
        return this.questions[index];
    }

    getTotalQuestions() {
        return this.questions.length;
    }

    isComplete() {
        return Object.keys(this.responses).length === this.questions.length;
    }

    reset() {
        this.responses = {};
        this.currentQuestion = 0;
    }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeadershipAssessment;
} else if (typeof window !== 'undefined') {
    window.LeadershipAssessment = LeadershipAssessment;
}
