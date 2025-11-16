/**
 * Team Compatibility Analysis
 * 팀 궁합 분석 시스템
 */

class TeamCompatibility {
    constructor() {
        this.followershipTypes = {};
        this.compatibilityMatrix = {};
        this.isInitialized = false;
    }

    async init() {
        try {
            const [followershipData, matrixData] = await Promise.all([
                fetch('data/followership-types.json').then(r => r.json()),
                fetch('data/compatibility-matrix.json').then(r => r.json())
            ]);

            this.followershipTypes = followershipData;
            this.compatibilityMatrix = matrixData;
            this.isInitialized = true;

            console.log('TeamCompatibility initialized:', {
                followershipTypesCount: Object.keys(this.followershipTypes).length,
                matrixCount: Object.keys(this.compatibilityMatrix).length
            });
        } catch (error) {
            console.error('Failed to load compatibility data:', error);
            throw error;
        }
    }

    getFollowershipTypes() {
        return this.followershipTypes;
    }

    analyzeCompatibility(leadershipType, followershipType) {
        const leaderCode = typeof leadershipType === 'string' ? leadershipType : leadershipType.code;
        const compatibility = this.compatibilityMatrix[leaderCode];

        if (!compatibility || !compatibility[followershipType]) {
            return {
                strengths: ['기본적인 협업이 가능합니다'],
                challenges: ['구체적인 궁합 데이터가 없습니다']
            };
        }

        const result = compatibility[followershipType];

        return {
            strengths: [result.strength],
            challenges: [result.caution]
        };
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
