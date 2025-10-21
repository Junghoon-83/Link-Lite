/**
 * Team Compatibility Analysis
 * 팀 궁합 분석 시스템
 */

class TeamCompatibility {
    constructor() {
        this.followershipTypes = {
            'driver': {
                name: 'Driver',
                subtitle: '모호함 속에서 길을 먼저 내는 추진형',
                description: '팀원은 리더가 제안한 내용 뿐 아니라 내용을 발전시켜오는 적극적인 업무 참여 태도를 보인다. 문제가 발생할때에는 원인에 대한 분석 뿐만 아니라 해결책을 모색한다.'
            },
            'thinker': {
                name: 'Thinker',
                subtitle: '깊이 파고들어 본질을 파악하는 탐구형',
                description: '한가지 일에 대한 몰입이 높은편이고 여러가지 일에 대해 정신 에너지를 전환하는 것을 어려워한다. 새로운 아이디어를 많이 내는 편이지만, 실행을 위한 행동은 느린편이다.'
            },
            'supporter': {
                name: 'Supporter',
                subtitle: '업무 관계의 빈틈을 메워 흐름을 지키는 연결형',
                description: '리더의 업무 지시에 빠르게 순응하고 업무를 처리한다. 리더를 포함한 팀 구성원의 업무를 지원하는 역할을 편안해한다. 주도적으로 나서서 업무를 진행하는 것에 부담이 있는 편이라, 리더로서 팀원의 리더십 개발이 고민이 된다.'
            },
            'doer': {
                name: 'Doer',
                subtitle: '역할이 분명할 때 빠르고 정확한 실행형',
                description: 'R&R이 분명할 경우 업무에 대한 이해가 빠르고 정확도 높게 업무를 처리한다. 다만 새로운 아이디어가 필요하거나 개념 수준에서 논의가 필요한 상황일 때 혼란스러워한다.'
            },
            'follower': {
                name: 'Follower',
                subtitle: '최근 동기, 몰입이 낮아 재점화가 필요한 대기형',
                description: '업무 동기가 떨어져 보이고, 업무 실수 및 업무 몰입도가 많이 떨어져 있다. 최근들어 이 팀원의 업무 몰입을 높이기 위해 어떻게 접근해야 할지에 대한 고민이 깊어졌다.'
            }
        };

        // 리더십 유형과 팔로워십 유형 간의 궁합도 매트릭스
        this.compatibilityMatrix = {
            'HLH': { // 참여비전형
                'driver': {
                    strength: '비전을 설계하고 빠르게 실행으로 바꾸는 조합. 큰 방향만 잡히면 Driver가 스스로 방법을 찾아 추진합니다.',
                    caution: '\'오늘 무엇을\'이 불분명하면 업무 재작업 가능성이 높음'
                },
                'doer': {
                    strength: '큰 그림을 정확한 결과로 바꾸는 리더-팔로워 조합',
                    caution: '무엇을/왜/언제부터/누가 등에 대한 구체적 논의없이 방향만 논의하면 혼선/업무 진행 속도 늦어짐'
                },
                'thinker': {
                    strength: '아이디어가 풍부하고 정교한 장기 로드맵 구상이 가능합니다.',
                    caution: '업무 진행 시 각 단계별 마감 일자가 정확하지 않으면 실행이 지연될 수 있습니다.'
                },
                'supporter': {
                    strength: '팀원의 도움으로 업무 진행이 정렬될 수 있습니다. 또한 서포터는 원활한 업무 합의에 중요한 역할을 합니다.',
                    caution: '서포터의 보이지 않는 수고를 인정해 주는 것이 소진을 예방할 수 있습니다.'
                },
                'follower': {
                    strength: '팀원이 소진 상태에 있을 수 있습니다. 리더의 의미에 대한 질문은 업무에 대한 동기를 상기시킬 수 있습니다.',
                    caution: '팀원에게 주어진 업무가 없다면 리더는 관망상태에 있을 수 있습니다.'
                }
            },
            'HHH': { // 참여코칭형
                'driver': {
                    strength: '업무 진행 시 장애 제거가 빨라 추진력이 유지됨.',
                    caution: '의견을 매번 듣기 보다, Driver에게 맡길 수 있는 영역은 권한 위임 필요'
                },
                'doer': {
                    strength: '리더의 짧은 피드백 주기를 통해 Doer의 산출물의 품질과 일관성이 높아질 수 있음.',
                    caution: '세세한 지시가 잦으면 스스로의 판단이 줄을 수 있음.'
                },
                'thinker': {
                    strength: '리더의 경청으로 Thinker의 분석력 촉진 (문제 정의 및 원인 파악 도움)',
                    caution: '설득 또는 경청의 비중이 높을 경우 실행 연결이 늦을 수 있음.'
                },
                'supporter': {
                    strength: 'Supporter가 안정적으로 업무를 진행할 수 있는 환경 조성',
                    caution: '\'항상 가능한 팀원\'이라는 기대는 팀원의 과부하로 이어질 수 있음.'
                },
                'follower': {
                    strength: '리더의 공감, 인정으로 동기 회복',
                    caution: '케어가 너무 길어질 경우 의존도가 높아질 수 있음.'
                }
            },
            'HLL': { // 참여실무형
                'driver': {
                    strength: '진행 가시화로 업무 진행에 불필요한 장애물 제거',
                    caution: '회의 의존이 길어질 경우 결정 지연.'
                },
                'doer': {
                    strength: '역할, 마감 일정 등을 선명하게 해주어 팀원의 실수 최소화',
                    caution: '전체 방향성과 업무 실행이 연결되지 않아 방향성이 변경될 경우 업무 잠재력 감소'
                },
                'thinker': {
                    strength: '업무 구조가 확실해서 안정적인 진행이 가능할 경우 깊이 있는 작업 보장',
                    caution: '불필요한 회의가 많아질 경우 집중이 끊어짐.'
                },
                'supporter': {
                    strength: '협업을 위한 구체적 가이드라인 체크리스트 정립에 도움',
                    caution: '정서적 케어가 부족할 경우 소진으로 이어질 가능성 있음.'
                },
                'follower': {
                    strength: '팀원의 루틴을 체크함으로써 일상 복귀에 도움이 될 수 있음.',
                    caution: '마이크로매니징으로 이어지지 않게 주의.'
                }
            },
            'HHL': { // 참여친밀형
                'driver': {
                    strength: '신뢰 기반으로 고난이도 업무 추진시 장점이 있음.',
                    caution: '팀원의 자율성이 보장되지 않고, 정렬 및 업무에 관한 대화가 너무 많아질 경우 속도 저하됨.'
                },
                'doer': {
                    strength: '세밀한 가이드라인을 바탕으로 팀원의 잠재력이 발휘되는 업무 환경 조성',
                    caution: '과도한 가이드라인 제공은 업무 판단 및 독립성에 부정적 영향을 미칠 수 있음.'
                },
                'thinker': {
                    strength: '리더의 공감속에서 팀원의 아이디어 확장',
                    caution: '완료일에 대한 명시적 소통이 없을 경우 마감일 지연의 위험 있음.'
                },
                'supporter': {
                    strength: '팀 협업 및 분위기 촉진에 있어 리더와 함께 좋은 역할을 할 수 있음.',
                    caution: '보이지 않는 곳에서의 누적된 노동 강도가 있을 수 있음.'
                },
                'follower': {
                    strength: '팀원의 상황에 대한 세밀한 관심으로 동기 회복에 도움.',
                    caution: '의존이 길어질 경우 성장에 정체 발생.'
                }
            },
            'LLH': { // 개별비전형
                'driver': {
                    strength: '큰 그림을 개인 목표와 빠르게 잇고 주도적으로 업무에 임함.',
                    caution: '최종 그림에 대한 이해가 없을 경우 해석이 달라져 업무를 되돌리는 상황 발생할 수 있음'
                },
                'doer': {
                    strength: '리더의 방향성을 표준화 또는 체계화하는 역할을 맡을 수 있음.',
                    caution: '업무 방향성이 추상적이거나 최종 산출물에 대한 그림 없이 변경이 잦을 경우 업무 혼선이 크게 일어남.'
                },
                'thinker': {
                    strength: '새 관점을 구조화해 문제 정의와 로드맵이 더욱 정교화될 수 있음.',
                    caution: '구체적인 실행 계획없이 로드맵만 반복할 수 있음.'
                },
                'supporter': {
                    strength: '업무 방향성을 현실 과제와 연결해 협업의 빈틈을 메움',
                    caution: '보이지 않는 수고가 쌓이면 소진 가능성 높음.'
                },
                'follower': {
                    strength: '팀원 개인의 비전을 찾아 업무 동기를 재점화하는데 리더가 도움이 될 수 있음.',
                    caution: '의미는 있지만 오늘 할 일에 대한 논의가 없을 경우 동기 저하 상태가 길어질 수 있음.'
                }
            },
            'LHL': { // 개별친밀형
                'driver': {
                    strength: '1:1 신뢰로 팀원의 업무 진행에 지지',
                    caution: '리더가 과도하게 개입할 경우 위임 약화됨.'
                },
                'doer': {
                    strength: '맞춤 피드백을 제공하여 팀원이 오차를 줄이는데 도움',
                    caution: '확인 과정에서 리더에게 의존할 가능성 있음.'
                },
                'thinker': {
                    strength: '깊이 있는 업무에 대한 리더의 지원',
                    caution: '결과물에 대한 완성도에 과도하게 에너지를 쓸 경우 완료일 지연'
                },
                'supporter': {
                    strength: '팀 내 관계 역동을 완충해주고 팀 운영의 빈 틈을 메워줌.',
                    caution: '성장 경로에 대한 모호함을 경험할 경우 의욕 저하로 이어질 수 있음.'
                },
                'follower': {
                    strength: '1:1 의 세심한 관찰과 관심을 통해 팀원 상황을 빨리 인지하고 도움 행동 제공',
                    caution: '지나친 관심으로 타 팀원들에게 편애로 보일 가능성 주의'
                }
            },
            'LHH': { // 개별코칭형
                'driver': {
                    strength: '장애 제거로 성과 즉시 향상',
                    caution: '논의가 잦아질 경우 업무 리듬 방해 될 수 있음'
                },
                'doer': {
                    strength: '팀원의 전문성과 정밀도가 빠르게 향상되는 데 리더가 도움을 줄 수 있음.',
                    caution: '과도한 1:1 케어는 잦은 피드백 요청을 유발하여 리더의 시간 소모가 높아질 수 있음.'
                },
                'thinker': {
                    strength: '문제를 정의하고 구조화하여 품질을 높이는데 기여할 수 있는 조합',
                    caution: '완벽주의로 초안이 지연될 수 있음.'
                },
                'supporter': {
                    strength: '팀 업무 지원이 필요한 경우, 과정을 정리하고 팀 신뢰를 높이는데 기여할 수 있는 조합',
                    caution: '리더의 팀원에 대한 의존도가 높아질 경우, 팀원의 과부화 유발할 수 있음.'
                },
                'follower': {
                    strength: '팀원의 상황에 대한 세밀한 관심으로 작은 성공을 쌓아 동기를 회복하는데 도움을 줄 수 있음',
                    caution: '리더의 코칭에만 의존하는 경우로 이어지지 않도록 주의'
                }
            },
            'LLL': { // 과도기형
                'driver': {
                    strength: '리더가 팀 운영에 대한 고민 시 객관적 관점 제공 가능',
                    caution: '팀원의 의견을 수용하고 변화 시도가 있어야 팀원 동기 유지 가능'
                },
                'doer': {
                    strength: '팀의 프로세스 재정립 및 표준화 과정에서 도움을 받을 수 있음.',
                    caution: '원인에 대한 논의가 아닌 구체적 실행에 대한 논의가 필요'
                },
                'thinker': {
                    strength: '현재 팀 운영의 근본적인 원인 및 해결책 이해에 도움을 받을 수 있음',
                    caution: '통제 불가능한 요인에 대한 논의가 길어질 경우 무기력감 생길 수 있음.'
                },
                'supporter': {
                    strength: '팀의 분위기 관리 및 팀 상황에 대한 이해가 필요한 경우 도움을 받을 수 있음.',
                    caution: '팀 사기 고취 역할로 과도하게 의존할 경우 팀원 소진의 원인이 될 수 있음.'
                },
                'follower': {
                    strength: '에너지 소진에 대한 상호 공감의 기회가 있을 수 있음.',
                    caution: '에너지 동반 하락의 위험이 있으니, 가급적이면 팀 내 적절한 구성원을 통해 팀원 케어를 할 필요가 있음.'
                }
            }
        };
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