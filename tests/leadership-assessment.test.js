/**
 * LeadershipAssessment 단위 테스트
 * 리더십 진단 핵심 로직 테스트
 */

// LeadershipAssessment 클래스 정의 (테스트용 - 동기적 버전)
class LeadershipAssessment {
    static THRESHOLD = 4.5;
    static SCORE_MIN = 1;
    static SCORE_MAX = 6;

    constructor() {
        this.questions = [];
        this.leadershipTypes = {};
        this.responses = {};
        this.currentQuestion = 0;
        this.isInitialized = false;
    }

    // 테스트용 동기적 초기화
    initSync(questions, leadershipTypes) {
        this.questions = questions;
        this.leadershipTypes = leadershipTypes;
        this.isInitialized = true;
    }

    static validateScore(value) {
        const num = typeof value === 'number' ? value : parseInt(value, 10);
        if (isNaN(num) || num < LeadershipAssessment.SCORE_MIN || num > LeadershipAssessment.SCORE_MAX) {
            return null;
        }
        return num;
    }

    recordResponse(questionId, score) {
        const validScore = LeadershipAssessment.validateScore(score);
        if (validScore === null) return;

        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;

        this.responses[questionId] = validScore;
    }

    calculateScores() {
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
        const categoryQuestions = this.questions.filter(q => q.category === category);
        const questionIds = categoryQuestions.map(q => q.id);
        const total = questionIds.reduce((sum, id) => sum + (this.responses[id] || 0), 0);
        return total / questionIds.length;
    }

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

// 테스트 데이터
const mockQuestions = [
    // Sharing (6개)
    { id: 1, category: 'sharing', lowerFactor: 's1_진행공유', upperFactor: '공유및참여' },
    { id: 2, category: 'sharing', lowerFactor: 's1_진행공유', upperFactor: '공유및참여' },
    { id: 3, category: 'sharing', lowerFactor: 's2_의견수렴', upperFactor: '공유및참여' },
    { id: 4, category: 'sharing', lowerFactor: 's2_의견수렴', upperFactor: '공유및참여' },
    { id: 5, category: 'sharing', lowerFactor: 's3_참여촉진', upperFactor: '공유및참여' },
    { id: 6, category: 'sharing', lowerFactor: 's3_참여촉진', upperFactor: '공유및참여' },
    // Interaction (8개)
    { id: 7, category: 'interaction', lowerFactor: 'i1_정서케어', upperFactor: '상호작용' },
    { id: 8, category: 'interaction', lowerFactor: 'i1_정서케어', upperFactor: '상호작용' },
    { id: 9, category: 'interaction', lowerFactor: 'i2_경청존중', upperFactor: '상호작용' },
    { id: 10, category: 'interaction', lowerFactor: 'i2_경청존중', upperFactor: '상호작용' },
    { id: 11, category: 'interaction', lowerFactor: 'i3_신뢰구축', upperFactor: '상호작용' },
    { id: 12, category: 'interaction', lowerFactor: 'i3_신뢰구축', upperFactor: '상호작용' },
    { id: 13, category: 'interaction', lowerFactor: 'i4_솔선수범', upperFactor: '상호작용' },
    { id: 14, category: 'interaction', lowerFactor: 'i4_솔선수범', upperFactor: '상호작용' },
    // Growth (9개)
    { id: 15, category: 'growth', lowerFactor: 'g1_실패학습', upperFactor: '성장촉진' },
    { id: 16, category: 'growth', lowerFactor: 'g1_실패학습', upperFactor: '성장촉진' },
    { id: 17, category: 'growth', lowerFactor: 'g2_방향제시', upperFactor: '성장촉진' },
    { id: 18, category: 'growth', lowerFactor: 'g2_방향제시', upperFactor: '성장촉진' },
    { id: 19, category: 'growth', lowerFactor: 'g3_강점강화', upperFactor: '성장촉진' },
    { id: 20, category: 'growth', lowerFactor: 'g3_강점강화', upperFactor: '성장촉진' },
    { id: 21, category: 'growth', lowerFactor: 'g4_성장지원', upperFactor: '성장촉진' },
    { id: 22, category: 'growth', lowerFactor: 'g4_성장지원', upperFactor: '성장촉진' },
    { id: 23, category: 'growth', lowerFactor: 'g5_권한위임', upperFactor: '성장촉진' }
];

const mockLeadershipTypes = {
    'HHH': { name: '참여코칭형', subtitle: '이상적 균형 리더' },
    'HHL': { name: '참여친밀형', subtitle: '공유/상호작용 강점' },
    'HLH': { name: '참여비전형', subtitle: '방향/성장 중점' },
    'HLL': { name: '참여실무형', subtitle: '프로세스 중심' },
    'LHH': { name: '개별코칭형', subtitle: '1:1 개발 중점' },
    'LHL': { name: '개별친밀형', subtitle: '1:1 신뢰 중심' },
    'LLH': { name: '개별비전형', subtitle: '잠재력 중심' },
    'LLL': { name: '과도기형', subtitle: '모든 영역 개발 필요' }
};

describe('LeadershipAssessment', () => {
    let assessment;

    beforeEach(() => {
        assessment = new LeadershipAssessment();
        assessment.initSync(mockQuestions, mockLeadershipTypes);
    });

    describe('validateScore', () => {
        it('유효한 점수 (1-6) 반환', () => {
            expect(LeadershipAssessment.validateScore(1)).toBe(1);
            expect(LeadershipAssessment.validateScore(3)).toBe(3);
            expect(LeadershipAssessment.validateScore(6)).toBe(6);
        });

        it('문자열 숫자도 변환', () => {
            expect(LeadershipAssessment.validateScore('1')).toBe(1);
            expect(LeadershipAssessment.validateScore('6')).toBe(6);
        });

        it('범위 밖 점수는 null 반환', () => {
            expect(LeadershipAssessment.validateScore(0)).toBeNull();
            expect(LeadershipAssessment.validateScore(7)).toBeNull();
            expect(LeadershipAssessment.validateScore(-1)).toBeNull();
        });

        it('유효하지 않은 값은 null 반환', () => {
            expect(LeadershipAssessment.validateScore('abc')).toBeNull();
            expect(LeadershipAssessment.validateScore(NaN)).toBeNull();
            expect(LeadershipAssessment.validateScore(null)).toBeNull();
        });
    });

    describe('recordResponse', () => {
        it('유효한 응답 기록', () => {
            assessment.recordResponse(1, 5);
            expect(assessment.responses[1]).toBe(5);
        });

        it('잘못된 질문 ID는 무시', () => {
            assessment.recordResponse(999, 5);
            expect(assessment.responses[999]).toBeUndefined();
        });

        it('잘못된 점수는 무시', () => {
            assessment.recordResponse(1, 10);
            expect(assessment.responses[1]).toBeUndefined();
        });
    });

    describe('calculateScores', () => {
        it('모든 점수가 6일 때 평균 6 반환', () => {
            mockQuestions.forEach(q => {
                assessment.recordResponse(q.id, 6);
            });

            const scores = assessment.calculateScores();
            expect(scores.sharing).toBe(6);
            expect(scores.interaction).toBe(6);
            expect(scores.growth).toBe(6);
        });

        it('모든 점수가 1일 때 평균 1 반환', () => {
            mockQuestions.forEach(q => {
                assessment.recordResponse(q.id, 1);
            });

            const scores = assessment.calculateScores();
            expect(scores.sharing).toBe(1);
            expect(scores.interaction).toBe(1);
            expect(scores.growth).toBe(1);
        });

        it('혼합 점수 시 올바른 평균 계산', () => {
            // Sharing: 전부 5점 → 평균 5
            for (let i = 1; i <= 6; i++) {
                assessment.recordResponse(i, 5);
            }
            // Interaction: 전부 4점 → 평균 4
            for (let i = 7; i <= 14; i++) {
                assessment.recordResponse(i, 4);
            }
            // Growth: 전부 3점 → 평균 3
            for (let i = 15; i <= 23; i++) {
                assessment.recordResponse(i, 3);
            }

            const scores = assessment.calculateScores();
            expect(scores.sharing).toBe(5);
            expect(scores.interaction).toBe(4);
            expect(scores.growth).toBe(3);
        });
    });

    describe('determineLeadershipType', () => {
        it('모든 점수 ≥ 4.5일 때 HHH 반환', () => {
            mockQuestions.forEach(q => {
                assessment.recordResponse(q.id, 6);
            });

            const result = assessment.determineLeadershipType();
            expect(result.code).toBe('HHH');
            expect(result.type.name).toBe('참여코칭형');
        });

        it('모든 점수 < 4.5일 때 LLL 반환', () => {
            mockQuestions.forEach(q => {
                assessment.recordResponse(q.id, 1);
            });

            const result = assessment.determineLeadershipType();
            expect(result.code).toBe('LLL');
            expect(result.type.name).toBe('과도기형');
        });

        it('경계값 테스트 (4.5)', () => {
            // Sharing만 높음 (5점 평균), 나머지 낮음 (4점 평균)
            for (let i = 1; i <= 6; i++) {
                assessment.recordResponse(i, 5);
            }
            for (let i = 7; i <= 23; i++) {
                assessment.recordResponse(i, 4);
            }

            const result = assessment.determineLeadershipType();
            expect(result.code).toBe('HLL');
            expect(result.type.name).toBe('참여실무형');
        });

        it('8가지 모든 유형 조합 테스트', () => {
            const testCases = [
                { sharing: 5, interaction: 5, growth: 5, expected: 'HHH' },
                { sharing: 5, interaction: 5, growth: 4, expected: 'HHL' },
                { sharing: 5, interaction: 4, growth: 5, expected: 'HLH' },
                { sharing: 5, interaction: 4, growth: 4, expected: 'HLL' },
                { sharing: 4, interaction: 5, growth: 5, expected: 'LHH' },
                { sharing: 4, interaction: 5, growth: 4, expected: 'LHL' },
                { sharing: 4, interaction: 4, growth: 5, expected: 'LLH' },
                { sharing: 4, interaction: 4, growth: 4, expected: 'LLL' }
            ];

            testCases.forEach(tc => {
                assessment.reset();

                // Sharing 설정
                for (let i = 1; i <= 6; i++) {
                    assessment.recordResponse(i, tc.sharing);
                }
                // Interaction 설정
                for (let i = 7; i <= 14; i++) {
                    assessment.recordResponse(i, tc.interaction);
                }
                // Growth 설정
                for (let i = 15; i <= 23; i++) {
                    assessment.recordResponse(i, tc.growth);
                }

                const result = assessment.determineLeadershipType();
                expect(result.code).toBe(tc.expected);
            });
        });
    });

    describe('isComplete', () => {
        it('모든 질문 응답 시 true', () => {
            mockQuestions.forEach(q => {
                assessment.recordResponse(q.id, 5);
            });
            expect(assessment.isComplete()).toBe(true);
        });

        it('일부 응답 누락 시 false', () => {
            assessment.recordResponse(1, 5);
            expect(assessment.isComplete()).toBe(false);
        });

        it('응답 없을 시 false', () => {
            expect(assessment.isComplete()).toBe(false);
        });
    });

    describe('reset', () => {
        it('응답 초기화', () => {
            assessment.recordResponse(1, 5);
            assessment.recordResponse(2, 4);

            assessment.reset();

            expect(assessment.responses).toEqual({});
            expect(assessment.currentQuestion).toBe(0);
        });
    });

    describe('calculateLowerFactorScores', () => {
        it('하위요인별 점수 올바르게 계산', () => {
            mockQuestions.forEach(q => {
                assessment.recordResponse(q.id, 5);
            });

            const lowerScores = assessment.calculateLowerFactorScores();

            expect(lowerScores['s1_진행공유'].average).toBe(5);
            expect(lowerScores['i1_정서케어'].average).toBe(5);
            expect(lowerScores['g1_실패학습'].average).toBe(5);
        });
    });
});
