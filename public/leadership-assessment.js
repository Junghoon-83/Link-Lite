/**
 * Leadership Assessment Application
 * 리더십 진단 및 팀 궁합 분석 시스템
 */

class LeadershipAssessment {
    constructor() {
        this.questions = [
            // 공유 및 참여 (1-6번)
            { id: 1, category: 'sharing', text: '팀원들이 개별 업무 진행할 때, 각 작업물의 목적이 전체 업무의 목적과 어떻게 일치(alignment)되는지를 상기하며 진행하도록 독려한다' },
            { id: 2, category: 'sharing', text: '팀 목표 달성을 위한 구체적인 계획을 수립하고, 이를 팀원들과 공유한다' },
            { id: 3, category: 'sharing', text: '팀 목표를 설정할 때 팀원들의 의견을 적극적으로 반영한다' },
            { id: 4, category: 'sharing', text: '업무를 시작하기 전, 해당 프로젝트의 목표에 관해 설명함으로써 팀원들이 프로젝트의 전체 그림을 이해할 수 있도록 한다' },
            { id: 5, category: 'sharing', text: '우리 팀은 팀원 간의 업무 진행 상황을 서로 잘 알고 있다' },
            { id: 6, category: 'sharing', text: '팀 내 아이디어 촉진을 위해, 팀 전체가 함께하는 소통 창구에서 논의를 진행하는 경우가 있다' },

            // 상호작용 (7-12번)
            { id: 7, category: 'interaction', text: '업무 진행 시 경험하는 고충/어려움 등에 대해서 팀원들과 대화하는 시간이 있다' },
            { id: 8, category: 'interaction', text: '특별한 주제가 없을 때에도 팀원들과 정기적으로 1:1 면담을 한다' },
            { id: 9, category: 'interaction', text: '팀원의 개인적인 고충에 대해서도 관심을 갖고 1:1 미팅을 정기적으로 진행하는 편이다' },
            { id: 10, category: 'interaction', text: '프로젝트(또는 주요한 업무)가 끝나면 서로의 수고를 감사하고 위로하는 자리를 갖는 편이다' },
            { id: 11, category: 'interaction', text: '팀 운영에 대한 기준을 일관적으로 적용하여 팀원들이 혼란을 느끼지 않고 안정감을 느낄 수 있게 하는 편이다' },
            { id: 12, category: 'interaction', text: '팀원의 고충을 들어주거나 어려움을 해결해 주기 위해 노력한다' },

            // 성장지향 (13-20번)
            { id: 13, category: 'growth', text: '일단 업무가 진행되면, 팀원이 스스로 업무를 완성할 수 있도록 맡기고 기다리는 편이다' },
            { id: 14, category: 'growth', text: '팀원이 처음 진행해 보는 업무를 시작할 때, 참고할 수 있도록 관련 정보 및 나의 경험을 공유해 주는 편이다' },
            { id: 15, category: 'growth', text: '내가 요청하기 이전에도, 팀원들이 업무 진행과 관련된 내용을 먼저 소통할 수 있도록 자주 촉진한다' },
            { id: 16, category: 'growth', text: '나는 팀원이 합의된 업무 범위를 넘어 자신의 아이디어를 발전시키고 이를 나와 적극적으로 공유하도록 독려한다' },
            { id: 17, category: 'growth', text: '업무 결과물에 대한 기준을 일관되게 적용하여 팀원들이 기대되는 결과물의 질적 수준을 이해할 수 있도록 촉진한다' },
            { id: 18, category: 'growth', text: '업무 결과물의 수준을 높이기 위해, 팀원들에게 적시에 피드백을 제공하려 노력한다' },
            { id: 19, category: 'growth', text: '업무 결과물이 수준 이상의 완성도를 지닐 때까지 시간과 에너지를 모두 집중해서 진행하도록 독려하는 편이다' },
            { id: 20, category: 'growth', text: '나는 중요한 업무가 완료된 후, 배운 점이나 개선할 점 등에 대해 팀이 대화할 수 있도록 시간을 마련한다' }
        ];

        this.scaleLabels = [
            '매우 그렇지 않다',
            '그렇지 않다',
            '약간 그렇지 않다',
            '약간 그렇다',
            '그렇다',
            '매우 그렇다'
        ];

        this.leadershipTypes = {
            'HHH': { name: '참여코칭형', description: '공유·상호작용·성장 모든 영역이 균형있게 발달한 이상적인 링커십 유형. 팀원들의 참여를 이끌어내며 개별 성장을 지원하는 리더' },
            'HHL': { name: '참여친밀형', description: '공유와 상호작용은 뛰어나지만 성장지향이 부족한 유형. 팀원들과의 소통과 협력에는 강하나 개별 성장 코칭 역량 개발 필요' },
            'HLH': { name: '참여비전형', description: '공유와 성장지향은 강하지만 일상적 상호작용이 부족한 유형. 명확한 방향성 제시와 성장 지원은 뛰어나나 관계적 상호작용 강화 필요' },
            'HLL': { name: '참여실무형', description: '목표와 비전 공유는 뛰어나지만 개별적 관계와 성장 지원이 부족한 유형. 투명한 소통과 참여 촉진에 강점, 개인별 케어 보완 필요' },
            'LHH': { name: '개별코칭형', description: '상호작용과 성장지향은 강하지만 전체적 공유가 부족한 유형. 개별 구성원 케어와 성장 지원에 뛰어나나 팀 차원의 목표 공유 강화 필요' },
            'LHL': { name: '개별친밀형', description: '개별적 상호작용에만 강점을 보이는 유형. 구성원들과의 1:1 관계는 좋으나 전체적 방향성 공유와 성장 전략 보완 필요' },
            'LLH': { name: '개별비전형', description: '성장지향에만 집중하는 유형. 높은 기준과 성과 지향적이나 팀 차원의 목표 공유와 관계적 상호작용 강화 필요' },
            'LLL': { name: '과도기형', description: '공유·상호작용·성장 모든 영역에서 개발이 필요한 유형. 링커십 역량 개발을 통해 연결자로서의 잠재력을 발휘할 수 있는 과도기 단계' }
        };

        this.responses = {};
        this.currentQuestion = 0;
    }

    recordResponse(questionId, score) {
        this.responses[questionId] = score;
    }

    calculateScores() {
        const sharingQuestions = [1, 2, 3, 4, 5, 6];
        const interactionQuestions = [7, 8, 9, 10, 11, 12];
        const growthQuestions = [13, 14, 15, 16, 17, 18, 19, 20];

        const sharingScore = this.calculateCategoryScore(sharingQuestions);
        const interactionScore = this.calculateCategoryScore(interactionQuestions);
        const growthScore = this.calculateCategoryScore(growthQuestions);

        return {
            sharing: sharingScore,
            interaction: interactionScore,
            growth: growthScore
        };
    }

    calculateCategoryScore(questionIds) {
        const total = questionIds.reduce((sum, id) => sum + (this.responses[id] || 0), 0);
        return total / questionIds.length;
    }

    determineLeadershipType() {
        const scores = this.calculateScores();
        const threshold = 4.5;

        const typeCode = [
            scores.sharing >= threshold ? 'H' : 'L',
            scores.interaction >= threshold ? 'H' : 'L',
            scores.growth >= threshold ? 'H' : 'L'
        ].join('');

        return {
            code: typeCode,
            type: this.leadershipTypes[typeCode],
            scores: scores
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