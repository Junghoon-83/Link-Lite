/**
 * Leadership Assessment Application
 * 리더십 진단 및 팀 궁합 분석 시스템
 */

class LeadershipAssessment {
    constructor() {
        this.questions = [
            // 엑셀 새번호 순서대로 정렬 (1-23)
            { id: 1, category: 'sharing', upperFactor: '공유및참여', lowerFactor: 's1_진행공유', text: '우리 팀은 팀원 간의 업무 진행 상황을 서로 잘 알고 있다.' },
            { id: 2, category: 'interaction', upperFactor: '상호작용', lowerFactor: 'i1_정서케어', text: '업무 진행 시 경험하는 고충/어려움 등에 대해서 팀원들과 대화하는 시간이 있다.' },
            { id: 3, category: 'growth', upperFactor: '성장촉진', lowerFactor: 'g1_실패학습', text: '업무 중 발생하는 실수에 대한 피드백이 상황이나 나의 기분에 따라 유동적이지 않고 일관적인 편이다' },
            { id: 4, category: 'sharing', upperFactor: '공유및참여', lowerFactor: 's1_진행공유', text: '평상시 팀원들의 업무량에 대해 잘 이해하고 있으며, 이를 바탕으로 업무 분장을 고려한다.' },
            { id: 5, category: 'interaction', upperFactor: '상호작용', lowerFactor: 'i1_정서케어', text: '팀원의 개인적인 고충에 대해서도 관심을 갖고 1:1 미팅을 정기적으로 진행하는 편이다.' },
            { id: 6, category: 'growth', upperFactor: '성장촉진', lowerFactor: 'g1_실패학습', text: '나는 중요한 업무가  완료된 후, 배운 점이나 개선할 점 등에 대해 팀이 대화할 수 있도록 시간을 마련한다.' },
            { id: 7, category: 'sharing', upperFactor: '공유및참여', lowerFactor: 's2_목표공유', text: '팀원들이 개별 업무 진행할 때, 각 작업물의 목적이 전체 업무의 목적과 어떻게 일치(alignment)되는지를 상기하며 진행하도록 독려한다.' },
            { id: 8, category: 'interaction', upperFactor: '상호작용', lowerFactor: 'i2_문제해결', text: '업무를 주고자 하는 팀원의 업무량이 많을 경우, 지원이 필요한 업무를 확인하여 도움을 제공하는 등 업무 조율을 위해 적극적으로 개입을 시도한다.' },
            { id: 9, category: 'growth', upperFactor: '성장촉진', lowerFactor: 'g2_도전촉진', text: '나는 새롭고 도전적인 업무를 팀원들이 시도할 수 있도록 기회를 제공하고 동기를 부여하는 편이다.' },
            { id: 10, category: 'sharing', upperFactor: '공유및참여', lowerFactor: 's2_목표공유', text: '업무를 시작하기 전, 해당 프로젝트의 목표에 관해 설명함으로써 팀원들이 프로젝트의 전체 그림을 이해할 수 있도록 한다.' },
            { id: 11, category: 'interaction', upperFactor: '상호작용', lowerFactor: 'i2_문제해결', text: '문제 해결을 위해서, 다른 리더와의 조율이 필요한 경우 개입하여 어려움이 해소되도록 돕는 편이다.' },
            { id: 12, category: 'growth', upperFactor: '성장촉진', lowerFactor: 'g2_도전촉진', text: '팀원들의 성장을 촉진하기 위해서 같은 업무도 팀 구성원들이 새로운 진행 방식을 제안할 수 있도록 독려하는 편이다.' },
            { id: 13, category: 'sharing', upperFactor: '공유및참여', lowerFactor: 's3_의견반영', text: '업무 진행 시 나의 권한으로 업무 분장을 하기보다, 팀원들의 의견을 적극적으로 수용하여 정하려 노력하는 편이다.' },
            { id: 14, category: 'interaction', upperFactor: '상호작용', lowerFactor: 'i3_개방성', text: '.나는 내 생각이나 느낌을 팀원들과 솔직하게 나누는 것이 편하다.' },
            { id: 15, category: 'growth', upperFactor: '성장촉진', lowerFactor: 'g3_결과수준', text: '업무 결과물이 수준 이상의 완성도를 지닐 때까지 시간과 에너지를 모두 집중해서 진행하도록 독려하는 편이다.' },
            { id: 16, category: 'sharing', upperFactor: '공유및참여', lowerFactor: 's3_의견반영', text: '업무 진행을 위한 전략 등 주요한 안건은 팀에서 상의하여 정하는 편이다.' },
            { id: 17, category: 'interaction', upperFactor: '상호작용', lowerFactor: 'i3_개방성', text: '업무 진행 시 힘든 부분이나 애로 사항 등에 대해서 나를 포함한 팀 모두가 자유롭게 이야기하는 분위기이다.' },
            { id: 18, category: 'growth', upperFactor: '성장촉진', lowerFactor: 'g3_결과수준', text: '업무 결과물에 대한 기준을 일관되게 적용하여 팀원들이 기대되는 결과물의 질적 수준을 이해할 수 있도록 촉진한다.' },
            { id: 19, category: 'interaction', upperFactor: '상호작용', lowerFactor: 'i4_팀역동이해', text: '서로 다른 성향/업무 스타일의 팀원들이 서로를 잘 이해하고 업무를 진행할 수 있도록 리더로서 중간에서 이해를 돕는 편이다.' },
            { id: 20, category: 'growth', upperFactor: '성장촉진', lowerFactor: 'g6_주도성촉진', text: '내가 요청하기 이전에도, 팀원들이 업무 진행과 관련된 내용을 먼저 다가와 소통할 수 있도록 자주 촉진한다.' },
            { id: 21, category: 'interaction', upperFactor: '상호작용', lowerFactor: 'i4_팀역동이해', text: '팀원들의 각기 다른 성향과 특징을 이해하기 위해서 다양한 방법을 통해 (예-1:1 미팅, 팀 활동 등) 소통하고자 노력하는 편이다.' },
            { id: 22, category: 'growth', upperFactor: '성장촉진', lowerFactor: 'g5_일의의미', text: '단순히 업무를 잘하는 것뿐만 아니라, 현재 우리가 하는 일의 의미를 이해할 수 있도록 팀원과 대화하는 편이다.' },
            { id: 23, category: 'growth', upperFactor: '성장촉진', lowerFactor: 'g8_일의의미', text: '나는 팀원이 현재 진행하는 일이 업무적으로 성장하는데 어떤 도움을 줄 수 있는지 대화하는 편이다.' }
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
            'HHH': {
                name: '참여코칭형',
                subtitle: '팀 성장에 대한 관심과 코칭으로 구성원의 의견을 수용하고 자율적 실행을 촉진하는 스타일',
                description: '공유·상호작용·성장 모든 영역이 균형있게 발달한 이상적인 링커십 유형. 팀원들의 참여를 이끌어내며 개별 성장을 지원하는 리더',
                strengths: [
                    '팀/개인별 맞춤형 코칭 및 피드백으로 결과물의 품질과 팀의 학습을 촉진합니다.',
                    '심리적으로 안전한 팀 문화 조성에 관심이 높고 팀 참여를 촉진합니다.'
                ],
                cautions: [
                    '모두의 의견을 다 듣다 보면, 결정 시점이 지연되어 업무 진행 속도가 늦어질 수 있습니다.'
                ]
            },
            'HHL': {
                name: '참여친밀형',
                subtitle: '팀 소통/정서 케어를 바탕으로 협업의 연결을 강화하는 스타일',
                description: '공유와 상호작용은 뛰어나지만 성장지향이 부족한 유형. 팀원들과의 소통과 협력에는 강하나 개별 성장 코칭 역량 개발 필요',
                strengths: [
                    '팀 응집력이 높아져 갈등 완충과 협업이 쉬워집니다.',
                    '피드백 수용성이 올라 결과물의 편차가 줄어듭니다.'
                ],
                cautions: [
                    '팀 의견 수용을 위해 논의가 길어질 경우, 업무 진행의 속도가 떨어질 수 있습니다.'
                ]
            },
            'HLH': {
                name: '참여비전형',
                subtitle: '큰 그림을 제시하고 자율 참여를 끌어 성과를 만드는 스타일',
                description: '공유와 성장지향은 강하지만 일상적 상호작용이 부족한 유형. 명확한 방향성 제시와 성장 지원은 뛰어나나 관계적 상호작용 강화 필요',
                strengths: [
                    '중장기 방향을 설정하고 변화를 위한 계획을 추진합니다.',
                    '자율,참여 문화를 설계해 팀의 에너지를 끌어올립니다.'
                ],
                cautions: [
                    '\'오늘 무엇을\' 이 정확하지 않으면 팀 해석이 제각각 되어 업무를 원점에서 다시 해야 할 수 있습니다.'
                ]
            },
            'HLL': {
                name: '참여실무형',
                subtitle: '역할 배분, 일정, 진행을 체계적으로 관리해 운영을 안정화하는 스타일',
                description: '목표와 비전 공유는 뛰어나지만 개별적 관계와 성장 지원이 부족한 유형. 투명한 소통과 참여 촉진에 강점, 개인별 케어 보완 필요',
                strengths: [
                    '업무 진행을 체감할 수 있도록 가시화하고, 업무 병목을 조기 발견하여 대응합니다.',
                    '부서간 협업 시 업무 연결이 원활하도록 촉진자 역할을 합니다.'
                ],
                cautions: [
                    '업무 진행에만 초점을 두고 팀 관리 (정서케어 및 동기 관리)를 소홀히 할 경우, 진행 병목 현상으로 인해 완료 스케줄이 지연될 수 있습니다.'
                ]
            },
            'LHH': {
                name: '개별코칭형',
                subtitle: '1:1 맞춤형 코칭을 통해 개인의 업무적 성장과 비전을 촉진하는 스타일',
                description: '상호작용과 성장지향은 강하지만 전체적 공유가 부족한 유형. 개별 구성원 케어와 성장 지원에 뛰어나나 팀 차원의 목표 공유 강화 필요',
                strengths: [
                    '신입의 업무 적응과 저성과자의 업무 동기 재점화에 유리합니다.',
                    '팀의 전문성과 개인별 적합한 업무 방식을 이해할 수 있도록 촉진자 역할을 합니다.'
                ],
                cautions: [
                    '리더의 1:1 시간 투입이 크고 팀 기반 성장의 효율성이 떨어질 수 있습니다.'
                ]
            },
            'LHL': {
                name: '개별친밀형',
                subtitle: '1:1 신뢰, 섬세한 지원으로 몰입과 관계 안정을 높이는 스타일',
                description: '개별적 상호작용에만 강점을 보이는 유형. 구성원들과의 1:1 관계는 좋으나 전체적 방향성 공유와 성장 전략 보완 필요',
                strengths: [
                    '개인의 강점과 약점을 파악해 맞춤 성장을 돕습니다.',
                    '팀의 긴장, 갈등 완충을 위해 리더가 개별적인 케어를 합니다.'
                ],
                cautions: [
                    '리더가 너무 깊게 개입하면 위임이 약해지고 리더에 대한 팀 의존도가 높아질 수 있습니다.'
                ]
            },
            'LLH': {
                name: '개별비전형',
                subtitle: '팀 개인의 미래 비전과 성장을 1:1 케어를 통해 새로운 관점에서 방향을 제시하는 스타일',
                description: '성장지향에만 집중하는 유형. 높은 기준과 성과 지향적이나 팀 차원의 목표 공유와 관계적 상호작용 강화 필요',
                strengths: [
                    '개인의 잠재력을 비전과 연결해 동기를 촉진합니다.',
                    '익숙한 틀을 벗어나 새로운 관점, 새로운 시도를 이끌어냅니다.'
                ],
                cautions: [
                    '개념만 논의하고 결과적으로 어떤 결과물을 산출하는지에 대한 논의가 불분명하면, 해석이 제각각 되어 결과물의 질에 영향을 미칠 수 있습니다.'
                ]
            },
            'LLL': {
                name: '과도기형',
                subtitle: '리더십 활동의 위축기 또는 리더십 정체성을 재정립하는 과도기',
                description: '공유·상호작용·성장 모든 영역에서 개발이 필요한 유형. 링커십 역량 개발을 통해 연결자로서의 잠재력을 발휘할 수 있는 과도기 단계',
                strengths: [
                    '관점을 바꾸고 새 리듬을 만들 수 있는 기회입니다.',
                    '팀 운영에 필요한 전제 (업무 의미, 역할, 방식) 를 다시 세팅할 수 있는 기회입니다.'
                ],
                cautions: [
                    '전환기에 대한 리더의 관점이 부정적일 경우, 팀 성과에 미치는 영향이 클 수 있으므로 과도기가 성장으로 이어질 수 있도록 도움 파트너 (동료 리더, 전문가, 코칭 등) 가 필요할 수 있습니다.'
                ]
            }
        };

        this.responses = {};
        this.currentQuestion = 0;
    }

    recordResponse(questionId, score) {
        this.responses[questionId] = score;
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
        const threshold = 4.5;

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