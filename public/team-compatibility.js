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

}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamCompatibility;
} else if (typeof window !== 'undefined') {
    window.TeamCompatibility = TeamCompatibility;
}
