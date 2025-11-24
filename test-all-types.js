// ========================================
// 8가지 리더십 유형 전체 검증 테스트
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
            'HLH': { name: '참여비전형', subtitle: 'Visionary Leader' },
            'HLL': { name: '참여실무형', subtitle: 'Task-Oriented Leader' },
            'LHH': { name: '개별코칭형', subtitle: 'Individual Coaching Leader' },
            'LHL': { name: '개별친밀형', subtitle: 'Personal Connection Leader' },
            'LLH': { name: '개별비전형', subtitle: 'Individual Vision Leader' },
            'LLL': { name: '과도기형', subtitle: 'Transitional Leader' }
        };

        this.responses = {};
    }

    recordResponses(responses) {
        this.responses = responses;
    }

    calculateCategoryScoreByCategory(category) {
        const categoryQuestions = this.questions.filter(q => q.category === category);
        const total = categoryQuestions.reduce((sum, q) => sum + (this.responses[q.id] || 0), 0);
        return total / categoryQuestions.length;
    }

    calculateScores() {
        const sharing = this.calculateCategoryScoreByCategory('sharing');
        const interaction = this.calculateCategoryScoreByCategory('interaction');
        const growth = this.calculateCategoryScoreByCategory('growth');

        return { sharing, interaction, growth };
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

    calculateRadarCoordinates(scores) {
        const center = 200;
        const maxRadius = 160;

        const sharingRadius = ((scores.sharing - 1) / 5) * maxRadius;
        const interactionRadius = ((scores.interaction - 1) / 5) * maxRadius;
        const growthRadius = ((scores.growth - 1) / 5) * maxRadius;

        const angles = {
            sharing: -Math.PI / 2,
            interaction: Math.PI / 6,
            growth: 5 * Math.PI / 6
        };

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
// 테스트 실행 함수
// ========================================

function runTest(testName, responses, expectedCode, expectedName) {
    const assessment = new LeadershipAssessmentTest();
    assessment.recordResponses(responses);

    const result = assessment.determineLeadershipType();
    const coordinates = assessment.calculateRadarCoordinates(result.scores);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`테스트: ${testName}`);
    console.log('='.repeat(60));

    console.log('\n📊 점수:');
    console.log(`  Sharing:     ${result.scores.sharing.toFixed(2)} ${result.scores.sharing >= 4.5 ? '(High ✅)' : '(Low ❌)'}`);
    console.log(`  Interaction: ${result.scores.interaction.toFixed(2)} ${result.scores.interaction >= 4.5 ? '(High ✅)' : '(Low ❌)'}`);
    console.log(`  Growth:      ${result.scores.growth.toFixed(2)} ${result.scores.growth >= 4.5 ? '(High ✅)' : '(Low ❌)'}`);

    console.log('\n🏷️  결과:');
    console.log(`  유형 코드: ${result.code}`);
    console.log(`  유형 이름: ${result.type.name}`);
    console.log(`  영문 설명: ${result.type.subtitle}`);

    console.log('\n📍 레이더 차트 좌표 (반지름):');
    console.log(`  Sharing:     ${coordinates.sharing.radius.toFixed(1)}px`);
    console.log(`  Interaction: ${coordinates.interaction.radius.toFixed(1)}px`);
    console.log(`  Growth:      ${coordinates.growth.radius.toFixed(1)}px`);

    const codeMatch = result.code === expectedCode;
    const nameMatch = result.type.name === expectedName;

    console.log('\n✅ 검증:');
    console.log(`  예상 코드: ${expectedCode} / 실제: ${result.code} ${codeMatch ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  예상 이름: ${expectedName} / 실제: ${result.type.name} ${nameMatch ? '✅ PASS' : '❌ FAIL'}`);

    if (codeMatch && nameMatch) {
        console.log('\n🎉 테스트 통과!');
    } else {
        console.log('\n⚠️  테스트 실패!');
    }

    return { result, coordinates, passed: codeMatch && nameMatch };
}

// ========================================
// 8가지 리더십 유형 테스트
// ========================================

console.log('\n🔬 8가지 리더십 유형 전체 검증 시작\n');

const tests = [];

// Test 1: HHH - 참여코칭형 (모든 영역 High)
tests.push(runTest(
    'Test 1: HHH - 참여코칭형 (Transformational Leader)',
    {
        q1: 5, q2: 6, q3: 5, q4: 6, q5: 5,    // Sharing: 5.4
        q6: 5, q7: 6, q8: 5, q9: 6, q10: 5,   // Interaction: 5.4
        q11: 5, q12: 6, q13: 5, q14: 6, q15: 5 // Growth: 5.4
    },
    'HHH',
    '참여코칭형'
));

// Test 2: HHL - 참여친밀형 (Growth Low)
tests.push(runTest(
    'Test 2: HHL - 참여친밀형 (Engaging Leader)',
    {
        q1: 5, q2: 6, q3: 5, q4: 6, q5: 5,    // Sharing: 5.4
        q6: 5, q7: 6, q8: 5, q9: 6, q10: 5,   // Interaction: 5.4
        q11: 3, q12: 4, q13: 3, q14: 4, q15: 3 // Growth: 3.4
    },
    'HHL',
    '참여친밀형'
));

// Test 3: HLH - 참여비전형 (Interaction Low)
tests.push(runTest(
    'Test 3: HLH - 참여비전형 (Visionary Leader)',
    {
        q1: 5, q2: 6, q3: 5, q4: 6, q5: 5,    // Sharing: 5.4
        q6: 3, q7: 4, q8: 3, q9: 4, q10: 3,   // Interaction: 3.4
        q11: 5, q12: 6, q13: 5, q14: 6, q15: 5 // Growth: 5.4
    },
    'HLH',
    '참여비전형'
));

// Test 4: HLL - 참여실무형 (Interaction & Growth Low)
tests.push(runTest(
    'Test 4: HLL - 참여실무형 (Task-Oriented Leader)',
    {
        q1: 5, q2: 6, q3: 5, q4: 6, q5: 5,    // Sharing: 5.4
        q6: 3, q7: 4, q8: 3, q9: 4, q10: 3,   // Interaction: 3.4
        q11: 3, q12: 4, q13: 3, q14: 4, q15: 3 // Growth: 3.4
    },
    'HLL',
    '참여실무형'
));

// Test 5: LHH - 개별코칭형 (Sharing Low)
tests.push(runTest(
    'Test 5: LHH - 개별코칭형 (Individual Coaching Leader)',
    {
        q1: 3, q2: 4, q3: 3, q4: 4, q5: 3,    // Sharing: 3.4
        q6: 5, q7: 6, q8: 5, q9: 6, q10: 5,   // Interaction: 5.4
        q11: 5, q12: 6, q13: 5, q14: 6, q15: 5 // Growth: 5.4
    },
    'LHH',
    '개별코칭형'
));

// Test 6: LHL - 개별친밀형 (Sharing & Growth Low)
tests.push(runTest(
    'Test 6: LHL - 개별친밀형 (Personal Connection Leader)',
    {
        q1: 3, q2: 4, q3: 3, q4: 4, q5: 3,    // Sharing: 3.4
        q6: 5, q7: 6, q8: 5, q9: 6, q10: 5,   // Interaction: 5.4
        q11: 3, q12: 4, q13: 3, q14: 4, q15: 3 // Growth: 3.4
    },
    'LHL',
    '개별친밀형'
));

// Test 7: LLH - 개별비전형 (Sharing & Interaction Low)
tests.push(runTest(
    'Test 7: LLH - 개별비전형 (Individual Vision Leader)',
    {
        q1: 3, q2: 4, q3: 3, q4: 4, q5: 3,    // Sharing: 3.4
        q6: 3, q7: 4, q8: 3, q9: 4, q10: 3,   // Interaction: 3.4
        q11: 5, q12: 6, q13: 5, q14: 6, q15: 5 // Growth: 5.4
    },
    'LLH',
    '개별비전형'
));

// Test 8: LLL - 과도기형 (모든 영역 Low)
tests.push(runTest(
    'Test 8: LLL - 과도기형 (Transitional Leader)',
    {
        q1: 3, q2: 4, q3: 3, q4: 4, q5: 3,    // Sharing: 3.4
        q6: 3, q7: 4, q8: 3, q9: 4, q10: 3,   // Interaction: 3.4
        q11: 3, q12: 4, q13: 3, q14: 4, q15: 3 // Growth: 3.4
    },
    'LLL',
    '과도기형'
));

// ========================================
// 경계값 테스트 (4.5 정확히)
// ========================================

console.log('\n\n' + '='.repeat(60));
console.log('🔍 경계값 테스트 (임계값 4.5)');
console.log('='.repeat(60));

// Test 9: 경계값 - 정확히 4.5 (High로 처리되어야 함)
tests.push(runTest(
    'Test 9: 경계값 - Sharing 4.5 (정확히)',
    {
        q1: 4, q2: 5, q3: 5, q4: 4, q5: 4.5,  // Sharing: 4.5
        q6: 5, q7: 5, q8: 5, q9: 5, q10: 5,   // Interaction: 5.0
        q11: 5, q12: 5, q13: 5, q14: 5, q15: 5 // Growth: 5.0
    },
    'HHH',
    '참여코칭형'
));

// Test 10: 경계값 - 4.49 (Low로 처리되어야 함)
tests.push(runTest(
    'Test 10: 경계값 - Interaction 4.4 (Low)',
    {
        q1: 5, q2: 5, q3: 5, q4: 5, q5: 5,    // Sharing: 5.0
        q6: 4, q7: 4, q8: 5, q9: 4, q10: 5,   // Interaction: 4.4
        q11: 5, q12: 5, q13: 5, q14: 5, q15: 5 // Growth: 5.0
    },
    'HLH',
    '참여비전형'
));

// ========================================
// 전체 요약
// ========================================

console.log('\n\n' + '='.repeat(60));
console.log('📋 전체 테스트 요약');
console.log('='.repeat(60));

const passedTests = tests.filter(t => t.passed).length;
const totalTests = tests.length;

console.log(`\n총 테스트: ${totalTests}`);
console.log(`통과: ${passedTests} ✅`);
console.log(`실패: ${totalTests - passedTests} ❌`);
console.log(`통과율: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

// 유형별 결과 매트릭스
console.log('\n📊 8가지 리더십 유형 매트릭스:');
console.log('┌─────────────────┬────────┬─────────────┬────────┬────────────────────┐');
console.log('│ 유형 코드       │ S      │ I           │ G      │ 유형 이름          │');
console.log('├─────────────────┼────────┼─────────────┼────────┼────────────────────┤');
console.log('│ HHH             │ High ✅ │ High ✅      │ High ✅ │ 참여코칭형         │');
console.log('│ HHL             │ High ✅ │ High ✅      │ Low ❌  │ 참여친밀형         │');
console.log('│ HLH             │ High ✅ │ Low ❌       │ High ✅ │ 참여비전형         │');
console.log('│ HLL             │ High ✅ │ Low ❌       │ Low ❌  │ 참여실무형         │');
console.log('│ LHH             │ Low ❌  │ High ✅      │ High ✅ │ 개별코칭형         │');
console.log('│ LHL             │ Low ❌  │ High ✅      │ Low ❌  │ 개별친밀형         │');
console.log('│ LLH             │ Low ❌  │ Low ❌       │ High ✅ │ 개별비전형         │');
console.log('│ LLL             │ Low ❌  │ Low ❌       │ Low ❌  │ 과도기형           │');
console.log('└─────────────────┴────────┴─────────────┴────────┴────────────────────┘');

console.log('\n📌 임계값: 4.5');
console.log('   - >= 4.5: High (H)');
console.log('   - < 4.5:  Low (L)');

if (passedTests === totalTests) {
    console.log('\n🎊 모든 테스트 통과! 8가지 리더십 유형이 정확히 도출됩니다.');
} else {
    console.log('\n⚠️  일부 테스트 실패. 로직 검토가 필요합니다.');
}

console.log('\n' + '='.repeat(60));
