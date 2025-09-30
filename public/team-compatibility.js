/**
 * Team Compatibility Analysis
 * 팀 궁합 분석 시스템
 */

class TeamCompatibility {
    constructor() {
        this.followershipTypes = [
            { id: 'driver', name: 'Driver', description: '팀원은 리더가 제안한 내용 뿐 아니라 내용을 발전시켜오는 적극적인 업무 참여 태도를 보인다. 문제가 발생할때에는 원인에 대한 분석 뿐만 아니라 해결책을 모색한다.' },
            { id: 'thinker', name: 'Thinker', description: '한가지 일에 대한 몰입이 높은편이고 여러가지 일에 대해 정신 에너지를 전환하는 것을 어려워한다. 새로운 아이디어를 많이 내는 편이지만, 실행을 위한 행동은 느린편이다.' },
            { id: 'supporter', name: 'Supporter', description: '리더의 업무 지시에 빠르게 순응하고 업무를 처리한다. 리더를 포함한 팀 구성원의 업무를 지원하는 역할을 편안해한다. 주도적으로 나서서 업무를 진행하는 것에 부담이 있는 편이라, 리더로서 팀원의 리더십 개발이 고민이 된다.' },
            { id: 'doer', name: 'Doer', description: 'R&R이 분명할 경우 업무에 대한 이해가 빠르고 정확도 높게 업무를 처리한다. 다만 새로운 아이디어가 필요하거나 개념 수준에서 논의가 필요한 상황일 때 혼란스러워한다.' },
            { id: 'follower', name: 'Follower', description: '업무 동기가 떨어져 보이고, 업무 실수 및 업무 몰입도가 많이 떨어져 있다. 최근들어 이 팀원의 업무 몰입을 높이기 위해 어떻게 접근해야 할지에 대한 고민이 깊어졌다.' }
        ];

        // 리더십 유형과 팔로워십 유형 간의 궁합도 매트릭스
        this.compatibilityMatrix = {
            'HHH': { // 변혁적 리더
                'driver': { score: 95, message: '완벽한 조합! 적극적 참여와 전방위적 리더십이 시너지를 만듭니다.' },
                'thinker': { score: 88, message: '좋은 조합! 깊은 사고와 균형잡힌 리더십이 조화를 이룹니다.' },
                'supporter': { score: 90, message: '매우 좋은 조합! 지원적 성향과 포용적 리더십이 안정감을 제공합니다.' },
                'doer': { score: 85, message: '좋은 조합! 실행력과 체계적 리더십이 확실한 성과를 만듭니다.' },
                'follower': { score: 70, message: '보통 조합. 강력한 리더십이 동기부여에 도움이 될 수 있습니다.' }
            },
            'HHL': { // 관계지향 리더
                'driver': { score: 75, message: '보통 조합. 적극성이 있지만 성장 지원이 제한적일 수 있습니다.' },
                'thinker': { score: 82, message: '좋은 조합! 사고력과 관계 중심 리더십이 잘 어울립니다.' },
                'supporter': { score: 95, message: '완벽한 조합! 최고의 팀 화합과 협력을 이룹니다.' },
                'doer': { score: 80, message: '좋은 조합! 실행력과 안정적 관계가 조화를 이룹니다.' },
                'follower': { score: 70, message: '보통 조합. 관계적 지원은 좋지만 동기부여에 한계가 있을 수 있습니다.' }
            },
            'HLH': { // 비전제시 리더
                'driver': { score: 90, message: '매우 좋은 조합! 적극성과 비전이 혁신적 성과를 만듭니다.' },
                'thinker': { score: 85, message: '좋은 조합! 깊은 사고와 비전이 질적 성장을 이룹니다.' },
                'supporter': { score: 70, message: '보통 조합. 지지는 좋지만 관계적 소통이 부족할 수 있습니다.' },
                'doer': { score: 88, message: '좋은 조합! 실행력과 비전이 확실한 결과를 만듭니다.' },
                'follower': { score: 65, message: '주의 필요. 비전만으로는 동기부여에 한계가 있을 수 있습니다.' }
            },
            'HLL': { // 민주적 리더
                'driver': { score: 88, message: '좋은 조합! 적극적 참여와 민주적 리더십이 활발한 소통을 만듭니다.' },
                'thinker': { score: 85, message: '좋은 조합! 신중한 사고와 참여 중심 리더십이 질적 의사결정을 이룹니다.' },
                'supporter': { score: 80, message: '좋은 조합! 지원적 성향과 참여 문화가 안정적 팀워크를 만듭니다.' },
                'doer': { score: 75, message: '보통 조합. 실행력은 좋지만 창의적 참여가 제한적일 수 있습니다.' },
                'follower': { score: 60, message: '주의 필요. 참여만으로는 동기부여와 성장 지원이 부족할 수 있습니다.' }
            },
            'LHH': { // 코칭 리더
                'driver': { score: 85, message: '좋은 조합! 적극성과 성장 코칭이 빠른 발전을 이룹니다.' },
                'thinker': { score: 88, message: '좋은 조합! 사고력과 체계적 코칭이 질적 성장을 만듭니다.' },
                'supporter': { score: 90, message: '매우 좋은 조합! 지원적 성향과 코칭이 이상적 성장 환경을 만듭니다.' },
                'doer': { score: 92, message: '매우 좋은 조합! 실행력과 체계적 코칭이 확실한 성과를 보장합니다.' },
                'follower': { score: 80, message: '좋은 조합! 성장 지향 코칭이 동기부여 회복에 도움이 될 수 있습니다.' }
            },
            'LHL': { // 지지적 리더
                'driver': { score: 65, message: '주의 필요. 적극성은 좋지만 명확한 방향성과 성장 지원이 부족할 수 있습니다.' },
                'thinker': { score: 70, message: '보통 조합. 사고력은 좋지만 체계적 발전 지원이 제한적일 수 있습니다.' },
                'supporter': { score: 95, message: '완벽한 조합! 서로를 지지하는 이상적인 협력 관계를 형성합니다.' },
                'doer': { score: 75, message: '보통 조합. 실행력은 좋지만 성장 기회가 제한적일 수 있습니다.' },
                'follower': { score: 60, message: '주의 필요. 상호 지지는 좋지만 동기부여와 성장에 한계가 있습니다.' }
            },
            'LLH': { // 성과지향 리더
                'driver': { score: 88, message: '좋은 조합! 적극성과 성과 지향이 높은 성과를 만듭니다.' },
                'thinker': { score: 80, message: '좋은 조합! 사고력과 성과 지향이 질적 성과를 이룹니다.' },
                'supporter': { score: 70, message: '보통 조합. 지지는 좋지만 관계적 소통이 부족할 수 있습니다.' },
                'doer': { score: 95, message: '완벽한 조합! 실행력과 성과 지향이 최고의 효율성을 만듭니다.' },
                'follower': { score: 60, message: '주의 필요. 성과 지향만으로는 동기부여 회복에 한계가 있습니다.' }
            },
            'LLL': { // 방임적 리더
                'driver': { score: 70, message: '보통 조합. 적극성이 리더십 부족을 어느 정도 보완할 수 있습니다.' },
                'thinker': { score: 75, message: '보통 조합. 사고력은 좋지만 방향성 부족으로 효과가 제한적일 수 있습니다.' },
                'supporter': { score: 60, message: '주의 필요. 지지적이지만 리더의 방향성 부족으로 혼란이 생길 수 있습니다.' },
                'doer': { score: 65, message: '주의 필요. 실행력은 있지만 명확한 지시와 방향성이 필요합니다.' },
                'follower': { score: 50, message: '개선 필요. 둘 다 소극적 성향으로 팀 성과에 어려움이 있을 수 있습니다.' }
            }
        };
    }

    getFollowershipTypes() {
        return this.followershipTypes;
    }

    analyzeCompatibility(leadershipType, followershipType) {
        const compatibility = this.compatibilityMatrix[leadershipType.code];
        if (!compatibility || !compatibility[followershipType]) {
            return {
                score: 50,
                message: '궁합 정보를 찾을 수 없습니다.',
                level: '보통'
            };
        }

        const result = compatibility[followershipType];
        return {
            score: result.score,
            message: result.message,
            level: this.getCompatibilityLevel(result.score)
        };
    }

    getCompatibilityLevel(score) {
        if (score >= 90) return '최고';
        if (score >= 80) return '좋음';
        if (score >= 70) return '보통';
        if (score >= 60) return '주의';
        return '개선 필요';
    }

    generateTeamReport(leadershipType, selectedFollowerTypes) {
        console.log('generateTeamReport 시작');
        console.log('leadershipType:', leadershipType);
        console.log('selectedFollowerTypes:', selectedFollowerTypes);
        console.log('available followershipTypes:', this.followershipTypes);

        const teamAnalysis = selectedFollowerTypes.map(followerItem => {
            // followerItem이 문자열(기존)인지 객체(새로운)인지 확인
            const followerId = typeof followerItem === 'string' ? followerItem : followerItem.id;
            const memberName = typeof followerItem === 'object' ? followerItem.memberName : '';

            console.log('Processing followerItem:', followerItem);
            console.log('followerId:', followerId);
            console.log('memberName:', memberName);

            const compatibility = this.analyzeCompatibility(leadershipType, followerId);
            const follower = this.followershipTypes.find(f => f.id === followerId);

            console.log('Found follower:', follower);
            console.log('Compatibility:', compatibility);

            return {
                follower: follower,
                memberName: memberName,
                compatibility: compatibility
            };
        });

        const averageScore = teamAnalysis.reduce((sum, item) => sum + item.compatibility.score, 0) / teamAnalysis.length;

        return {
            teamMembers: teamAnalysis,
            overallCompatibility: {
                score: Math.round(averageScore),
                level: this.getCompatibilityLevel(averageScore)
            },
            recommendations: this.generateRecommendations(leadershipType, teamAnalysis)
        };
    }

    generateRecommendations(leadershipType, teamAnalysis) {
        const recommendations = [];
        const lowCompatibilityMembers = teamAnalysis.filter(member => member.compatibility.score < 70);

        if (lowCompatibilityMembers.length > 0) {
            recommendations.push('일부 팀원과의 궁합도가 낮습니다. 개별 코칭과 소통 강화가 필요합니다.');
        }

        // 리더십 유형별 맞춤 조언
        switch (leadershipType.code) {
            case 'LLL':
                recommendations.push('방임적 리더십 스타일을 개선하여 팀원들에게 더 명확한 방향성을 제시해보세요.');
                break;
            case 'HLL':
                recommendations.push('상호작용과 성장지향 영역을 강화하여 더 균형잡힌 리더십을 발휘해보세요.');
                break;
            case 'LHL':
                recommendations.push('공유참여와 성장지향 영역을 개발하여 팀의 발전을 도모해보세요.');
                break;
            case 'LLH':
                recommendations.push('공유참여와 상호작용 영역을 강화하여 팀의 결속력을 높여보세요.');
                break;
        }

        return recommendations;
    }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamCompatibility;
} else if (typeof window !== 'undefined') {
    window.TeamCompatibility = TeamCompatibility;
}