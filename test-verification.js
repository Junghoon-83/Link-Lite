// ========================================
// 리더십 진단 로직 자동 검증 테스트
// ========================================

// Leadership Assessment 클래스 시뮬레이션
class LeadershipAssessmentTest {
    constructor() {
        this.questions = [
            // Sharing (5문항)
            { id: 'q1', category: 'sharing' },
            { id: 'q2', category: 'sharing' },
            { id: 'q3', category: 'sharing' },
            { id: 'q4', category: 'sharing' },
            { id: 'q5', category: 'sharing' },
            // Interaction (5문항)
            { id: 'q6', category: 'interaction' },
            { id: 'q7', category: 'interaction' },
            { id: 'q8', category: 'interaction' },
            { id: 'q9', category: 'interaction' },
            { id: 'q10', category: 'interaction' },
            // Growth (5문항)
            { id: 'q11', category: 'growth' },
            { id: 'q12', category: 'growth' },
            { id: 'q13', category: 'growth' },
            { id: 'q14', category: 'growth' },
            { id: 'q15', category: 'growth' }
        ];

        this.leadershipTypes = {
            'HHH': { name: '참여코칭형', subtitle: 'Transformational Leader' },
            'HHL': { name: '참여친밀형', subtitle: 'Engaging Leader' },
            'HLH': { name: '비전형', subtitle: 'Visionary Leader' },
            'HLL': { name: '통찰형', subtitle: 'Insight Leader' },
            'LHH': { name: '촉진형', subtitle: 'Facilitative Leader' },
            'LHL': { name: '조율형', subtitle: 'Coordinating Leader' },
            'LLH': { name: '개발형', subtitle: 'Development Leader' },
            'LLL': { name: '과업형', subtitle: 'Task-Oriented Leader' }
        };

        this.responses = {};
    }

    // 응답 기록
    recordResponses(responses) {
        this.responses = responses;
    }

    // 카테고리별 점수 계산
    calculateCategoryScoreByCategory(category) {
        const categoryQuestions = this.questions.filter(q => q.category === category);
        const total = categoryQuestions.reduce((sum, q) => sum + (this.responses[q.id] || 0), 0);
        return total / categoryQuestions.length;
    }

    // 전체 점수 계산
    calculateScores() {
        const sharing = this.calculateCategoryScoreByCategory('sharing');
        const interaction = this.calculateCategoryScoreByCategory('interaction');
        const growth = this.calculateCategoryScoreByCategory('growth');

        return { sharing, interaction, growth };
    }

    // 리더십 유형 도출
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

    // 레이더 차트 좌표 계산
    calculateRadarCoordinates(scores) {
        const center = 200;
        const maxRadius = 160;

        // 점수를 반지름으로 변환 (1-6점 → 0-160px)
        const sharingRadius = ((scores.sharing - 1) / 5) * maxRadius;
        const interactionRadius = ((scores.interaction - 1) / 5) * maxRadius;
        const growthRadius = ((scores.growth - 1) / 5) * maxRadius;

        // 각도 설정
        const angles = {
            sharing: -Math.PI / 2,      // -90도 (위)
            interaction: Math.PI / 6,    // 30도 (오른쪽 아래)
            growth: 5 * Math.PI / 6      // 150도 (왼쪽 아래)
        };

        // 극좌표 → 직교좌표 변환
        return {
            sharing: {
                x: center + sharingRadius * Math.cos(angles.sharing),
                y: center + sharingRadius * Math.sin(angles.sharing),
                radius: sharingRadius
            },
            interaction: {
                x: center + interactionRadius * Math.cos(angles.interaction),
                y: center + interactionRadius * Math.sin(angles.interaction),
                radius: interactionRadius
            },
            growth: {
                x: center + growthRadius * Math.cos(angles.growth),
                y: center + growthRadius * Math.sin(angles.growth),
                radius: growthRadius
            }
        };
    }
}

// ========================================
// 테스트 시나리오
// ========================================

function runTest(testName, responses, expectedCode, expectedName) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`테스트: ${testName}`);
    console.log('='.repeat(50));

    const assessment = new LeadershipAssessmentTest();
    assessment.recordResponses(responses);

    const result = assessment.determineLeadershipType();
    const coordinates = assessment.calculateRadarCoordinates(result.scores);

    console.log('\n📊 점수 계산 결과:');
    console.log(`  - Sharing: ${result.scores.sharing.toFixed(2)}`);
    console.log(`  - Interaction: ${result.scores.interaction.toFixed(2)}`);
    console.log(`  - Growth: ${result.scores.growth.toFixed(2)}`);

    console.log('\n🎯 임계값 비교 (4.5):');
    console.log(`  - Sharing >= 4.5? ${result.scores.sharing >= 4.5} ${result.scores.sharing >= 4.5 ? '✅' : '❌'}`);
    console.log(`  - Interaction >= 4.5? ${result.scores.interaction >= 4.5} ${result.scores.interaction >= 4.5 ? '✅' : '❌'}`);
    console.log(`  - Growth >= 4.5? ${result.scores.growth >= 4.5} ${result.scores.growth >= 4.5 ? '✅' : '❌'}`);

    console.log('\n🏷️  리더십 유형:');
    console.log(`  - 유형 코드: ${result.code}`);
    console.log(`  - 유형 이름: ${result.type.name}`);
    console.log(`  - 서브타이틀: ${result.type.subtitle}`);

    console.log('\n📍 레이더 차트 좌표:');
    console.log(`  - Sharing: (${coordinates.sharing.x.toFixed(1)}, ${coordinates.sharing.y.toFixed(1)}) - 반지름: ${coordinates.sharing.radius.toFixed(1)}px`);
    console.log(`  - Interaction: (${coordinates.interaction.x.toFixed(1)}, ${coordinates.interaction.y.toFixed(1)}) - 반지름: ${coordinates.interaction.radius.toFixed(1)}px`);
    console.log(`  - Growth: (${coordinates.growth.x.toFixed(1)}, ${coordinates.growth.y.toFixed(1)}) - 반지름: ${coordinates.growth.radius.toFixed(1)}px`);

    console.log('\n✅ 검증 결과:');
    const codeMatch = result.code === expectedCode;
    const nameMatch = result.type.name === expectedName;

    console.log(`  - 예상 코드: ${expectedCode} / 실제 코드: ${result.code} ${codeMatch ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  - 예상 이름: ${expectedName} / 실제 이름: ${result.type.name} ${nameMatch ? '✅ PASS' : '❌ FAIL'}`);

    if (codeMatch && nameMatch) {
        console.log('\n🎉 테스트 통과!');
    } else {
        console.log('\n⚠️  테스트 실패!');
    }

    return { result, coordinates, passed: codeMatch && nameMatch };
}

// ========================================
// 테스트 실행
// ========================================

console.log('\n🔬 리더십 진단 로직 자동 검증 시작\n');

// 테스트 1: HHH (모든 영역 High)
const test1Responses = {
    q1: 5, q2: 6, q3: 5, q4: 6, q5: 5,    // Sharing: 평균 5.4
    q6: 5, q7: 6, q8: 5, q9: 6, q10: 5,   // Interaction: 평균 5.4
    q11: 5, q12: 6, q13: 5, q14: 6, q15: 5 // Growth: 평균 5.4
};
const test1 = runTest('Test 1: HHH (변혁적 리더)', test1Responses, 'HHH', '참여코칭형');

// 테스트 2: HHL (Growth Low)
const test2Responses = {
    q1: 5, q2: 6, q3: 5, q4: 6, q5: 5,    // Sharing: 평균 5.4
    q6: 5, q7: 6, q8: 5, q9: 6, q10: 5,   // Interaction: 평균 5.4
    q11: 3, q12: 4, q13: 3, q14: 4, q15: 3 // Growth: 평균 3.4
};
const test2 = runTest('Test 2: HHL (참여친밀형)', test2Responses, 'HHL', '참여친밀형');

// 테스트 3: HLH (Interaction Low)
const test3Responses = {
    q1: 5, q2: 6, q3: 5, q4: 6, q5: 5,    // Sharing: 평균 5.4
    q6: 3, q7: 4, q8: 3, q9: 4, q10: 3,   // Interaction: 평균 3.4
    q11: 5, q12: 6, q13: 5, q14: 6, q15: 5 // Growth: 평균 5.4
};
const test3 = runTest('Test 3: HLH (비전형)', test3Responses, 'HLH', '비전형');

// 테스트 4: LLL (모든 영역 Low)
const test4Responses = {
    q1: 3, q2: 4, q3: 3, q4: 4, q5: 3,    // Sharing: 평균 3.4
    q6: 3, q7: 4, q8: 3, q9: 4, q10: 3,   // Interaction: 평균 3.4
    q11: 3, q12: 4, q13: 3, q14: 4, q15: 3 // Growth: 평균 3.4
};
const test4 = runTest('Test 4: LLL (과업형)', test4Responses, 'LLL', '과업형');

// 테스트 5: 경계값 테스트 (4.5 정확히)
const test5Responses = {
    q1: 4, q2: 5, q3: 5, q4: 4, q5: 4.5,  // Sharing: 평균 4.5 (정확히)
    q6: 4, q7: 4, q8: 5, q9: 4, q10: 5,   // Interaction: 평균 4.4 (Low)
    q11: 5, q12: 4, q13: 5, q14: 4, q15: 5 // Growth: 평균 4.6 (High)
};
const test5 = runTest('Test 5: 경계값 (4.5) - HLH', test5Responses, 'HLH', '비전형');

// 테스트 6: 사용자 스크린샷 재현 (HHL인데 HHH로 표시되는 케이스)
const test6Responses = {
    q1: 5, q2: 5, q3: 6, q4: 5, q5: 6,    // Sharing: 평균 5.4
    q6: 5, q7: 6, q8: 5, q9: 5, q10: 6,   // Interaction: 평균 5.4
    q11: 3, q12: 3, q13: 4, q14: 3, q15: 4 // Growth: 평균 3.4
};
const test6 = runTest('Test 6: 스크린샷 재현 (HHL)', test6Responses, 'HHL', '참여친밀형');

// ========================================
// 전체 요약
// ========================================

console.log('\n' + '='.repeat(50));
console.log('📋 전체 테스트 요약');
console.log('='.repeat(50));

const tests = [test1, test2, test3, test4, test5, test6];
const passedTests = tests.filter(t => t.passed).length;
const totalTests = tests.length;

console.log(`\n총 테스트: ${totalTests}`);
console.log(`통과: ${passedTests} ✅`);
console.log(`실패: ${totalTests - passedTests} ❌`);
console.log(`통과율: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
    console.log('\n🎊 모든 테스트 통과! 로직이 정확히 작동합니다.');
} else {
    console.log('\n⚠️  일부 테스트 실패. 로직 검토가 필요합니다.');
}

console.log('\n' + '='.repeat(50));
