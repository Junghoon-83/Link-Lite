// ========================================
// Security Utils - 입력 검증 및 XSS 방지
// ========================================

class SecurityUtils {
    /**
     * HTML 특수문자를 이스케이프하여 XSS 공격 방지
     * @param {string} str - 이스케이프할 문자열
     * @returns {string} 이스케이프된 문자열
     */
    static escapeHTML(str) {
        if (str === null || str === undefined) return '';
        const div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

    /**
     * 사용자 입력 문자열 정제 (트림 + 길이 제한 + 특수문자 제거)
     * @param {string} str - 정제할 문자열
     * @param {number} maxLength - 최대 길이 (기본값: 50)
     * @returns {string} 정제된 문자열
     */
    static sanitizeInput(str, maxLength = 50) {
        if (str === null || str === undefined) return '';
        return String(str)
            .trim()
            .slice(0, maxLength)
            .replace(/[<>\"'&]/g, ''); // HTML 태그 및 특수문자 제거
    }
}

// ========================================
// App Controller - 애플리케이션 상태 및 생명주기 관리
// ========================================

class AppController {
    constructor() {
        // Core instances
        this.assessment = new LeadershipAssessment();
        this.teamCompatibility = new TeamCompatibility();
        this.storageManager = new StorageManager();
        this.analyticsManager = new AnalyticsManager();

        // State management
        this.state = {
            currentQuestion: 0,
            selectedFollowers: [], // { id: string, name: string, memberName: string }
            currentSection: 'welcome',
            currentLeadershipCode: null,
            isInitialized: false
        };

        // UI references
        this.ui = {
            mobileInput: null,
            mobileNav: null
        };

        // Event manager
        this.eventManager = new EventManager();
    }

    // ========================================
    // Initialization
    // ========================================

    async init() {
        try {
            console.log('🚀 AppController 초기화 시작');

            // 시작 버튼 비활성화
            const startBtn = document.querySelector('.premium-btn');
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.textContent = '데이터 로딩 중...';
            }

            // 1. 데이터 병렬 로딩
            await Promise.all([
                this.assessment.init(),
                this.teamCompatibility.init()
            ]);
            console.log('✓ Assessment 및 TeamCompatibility 초기화 완료');

            // 2. 시작 버튼 활성화
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.innerHTML = '<span>진단 시작</span><span>→</span>';
            }

            // 3. 이벤트 리스너 등록
            this.setupEventListeners();

            // 4. 모바일 네비게이션 초기화
            if (window.innerWidth <= 768) {
                this.ui.mobileNav = new MobileNavigationManager();
                console.log('✓ 모바일 네비게이션 초기화 완료');
            }

            // 5. 세션 복구 시도
            await this.tryRestoreSession();

            this.state.isInitialized = true;
            console.log('✅ AppController 초기화 완료');

        } catch (error) {
            console.error('❌ 초기화 오류:', error);
            this.showErrorMessage('앱을 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        }
    }

    async tryRestoreSession() {
        const savedSession = this.storageManager.restoreCurrentSession();

        if (savedSession && !savedSession.isComplete) {
            const totalQuestions = this.assessment.getTotalQuestions();
            const shouldResume = confirm(
                '진행 중인 진단이 있습니다. 이어서 하시겠습니까?\n\n' +
                `마지막 진행: ${savedSession.currentQuestionIndex + 1}/${totalQuestions}번 질문`
            );

            if (shouldResume) {
                this.assessment.responses = savedSession.responses;
                this.state.currentQuestion = savedSession.currentQuestionIndex;
                this.showSection('assessment');
                this.loadQuestion(this.state.currentQuestion);
                console.log('✓ 세션 복구 완료:', savedSession.id);
            } else {
                this.storageManager.clearCurrentSession();
            }
        }
    }

    setupEventListeners() {
        // 전역 에러 핸들러
        window.addEventListener('error', (event) => {
            console.error('전역 에러 발생:', event.error);
            this.showErrorMessage('일시적인 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('처리되지 않은 Promise 거부:', event.reason);
            this.showErrorMessage('데이터 처리 중 오류가 발생했습니다.');
        });

        // 추가 이벤트 리스너는 EventManager를 통해 등록
        console.log('✓ 이벤트 리스너 설정 완료');
    }

    // ========================================
    // Section Navigation
    // ========================================

    showSection(sectionId) {
        // 모든 섹션 숨기기
        document.querySelectorAll('.premium-section').forEach(section => {
            section.classList.remove('active');
        });

        // body 클래스 변경
        document.body.className = sectionId === 'welcome' ? 'welcome-page' : 'content-page';

        // 모바일 네비게이션 처리
        if (this.ui.mobileNav) {
            if (sectionId === 'results' || sectionId === 'welcome') {
                this.ui.mobileNav.hide();
            } else if (sectionId === 'assessment') {
                this.ui.mobileNav.show();
            } else if (sectionId === 'followership') {
                this.ui.mobileNav.show();
            }
        }

        // 새 섹션 즉시 표시 (setTimeout 제거로 부드러운 전환)
        document.getElementById(sectionId).classList.add('active');

        this.state.currentSection = sectionId;
        this.analyticsManager.trackPageView(sectionId);
    }

    // ========================================
    // Assessment
    // ========================================

    startAssessment() {
        if (!this.state.isInitialized) {
            this.showErrorMessage('데이터가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        try {
            this.showSection('assessment');

            this.loadQuestion(0);
            this.analyticsManager.trackAssessmentStart();
        } catch (error) {
            console.error('진단 시작 오류:', error);
            this.showErrorMessage('진단을 시작할 수 없습니다. 페이지를 새로고침해주세요.');
        }
    }

    loadQuestion(index) {
        try {
            const question = this.assessment.getQuestion(index);
            if (!question) {
                console.error('질문을 찾을 수 없습니다:', index);
                return;
            }

            this.state.currentQuestion = index;

        // UI 업데이트
        const questionNumberEl = document.getElementById('questionNumber');
        const questionTextEl = document.getElementById('questionText');
        const questionCategoryEl = document.getElementById('questionCategory');
        const progressBar = document.getElementById('progressBar');

        if (questionNumberEl) {
            questionNumberEl.textContent = `${index + 1} / ${this.assessment.getTotalQuestions()}`;
        }
        if (questionTextEl) {
            questionTextEl.textContent = question.text;
        }
        if (questionCategoryEl) {
            questionCategoryEl.textContent = question.category;
        }
        if (progressBar) {
            const progress = ((index + 1) / this.assessment.getTotalQuestions()) * 100;
            progressBar.style.width = `${progress}%`;

            // 접근성: 진행률 업데이트
            const progressContainer = progressBar.parentElement;
            if (progressContainer) {
                progressContainer.setAttribute('aria-valuenow', Math.round(progress));
            }
        }

        // 모바일 네이티브 입력 시스템 초기화
        const inputContainer = document.getElementById('interactiveInput');
        if (inputContainer) {
            // 기존 인스턴스 정리
            if (this.ui.mobileInput) {
                this.ui.mobileInput.destroy();
            }

            // 새 모바일 입력 생성
            const currentResponse = this.assessment.responses[question.id];
            const totalQuestions = this.assessment.getTotalQuestions();
            const isLastQuestion = index === totalQuestions - 1;

            this.ui.mobileInput = new MobileNativeInput(inputContainer, {
                defaultValue: currentResponse, // 이전 응답 복원
                min: 1,
                max: 6,
                onChange: (value) => {
                    this.assessment.recordResponse(question.id, value);
                    this.updateNextButton();

                    // 마지막 질문이 아닐 때만 자동으로 다음으로 이동
                    if (!isLastQuestion) {
                        setTimeout(() => {
                            this.nextQuestion();
                        }, 300);
                    } else {
                        // 마지막 질문에서 점수 선택 시 완료 모달 표시
                        setTimeout(() => {
                            this.showAssessmentCompleteModal();
                        }, 300);
                    }
                }
            });
        }

        // 버튼 상태 업데이트
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.disabled = false; // 이전 버튼은 항상 활성화
        }
        this.updateNextButton();

        // 모바일 네비게이션 업데이트
        if (this.ui.mobileNav && window.innerWidth <= 768) {
            const totalQuestions = this.assessment.getTotalQuestions();
            const isLastQuestion = index === totalQuestions - 1;
            const canGoPrev = true;
            const canGoNext = this.assessment.responses[question.id] !== undefined;
            const buttonText = isLastQuestion ? '완료' : '다음';
            this.ui.mobileNav.updateNavigation(canGoPrev, canGoNext, buttonText);
        }

            // 세션 저장
            this.storageManager.saveCurrentSession(this.assessment, this.state.currentQuestion);
        } catch (error) {
            console.error('질문 로드 오류:', error);
            this.showErrorMessage('질문을 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        }
    }

    updateNextButton() {
        const question = this.assessment.getQuestion(this.state.currentQuestion);
        if (!question) return;

        const hasResponse = this.assessment.responses[question.id] !== undefined;
        const totalQuestions = this.assessment.getTotalQuestions();
        const isLastQuestion = this.state.currentQuestion === totalQuestions - 1;

        const nextBtn = document.getElementById('nextBtn');
        const nextBtnText = document.getElementById('nextBtnText');

        if (nextBtn) {
            nextBtn.disabled = !hasResponse;
        }
        if (nextBtnText) {
            // 마지막 질문이면 "완료", 아니면 "다음"
            nextBtnText.textContent = isLastQuestion ? '완료' : '다음';
        }

        // 모바일 네비게이션도 업데이트
        if (this.ui.mobileNav && window.innerWidth <= 768) {
            const canGoPrev = true;
            const buttonText = isLastQuestion ? '완료' : '다음';
            this.ui.mobileNav.updateNavigation(canGoPrev, hasResponse, buttonText);
        }
    }

    selectScore(score) {
        // 모든 점수 카드 선택 해제
        document.querySelectorAll('.score-card').forEach(card => {
            card.classList.remove('selected');
        });

        // 선택한 점수 카드 활성화
        const selectedCard = document.querySelector(`.score-card[data-score="${score}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }

    clearScoreSelection() {
        document.querySelectorAll('.score-card').forEach(card => {
            card.classList.remove('selected');
        });
    }

    recordScore(score) {
        const question = this.assessment.getQuestion(this.state.currentQuestion);
        if (!question) return;

        this.assessment.recordResponse(question.id, score);
        this.selectScore(score);

        // 다음 질문으로 자동 이동
        if (this.state.currentQuestion < this.assessment.getTotalQuestions() - 1) {
            setTimeout(() => {
                this.nextQuestion();
            }, 300);
        } else {
            // 마지막 질문 - 팔로워십 선택으로 이동
            setTimeout(() => {
                this.completeAssessment();
            }, 500);
        }

        // 분석 추적
        this.analyticsManager.trackQuestionAnswer(
            this.state.currentQuestion,
            question.category,
            score
        );
    }

    nextQuestion() {
        console.log('=== nextQuestion 호출 ===');
        console.log('현재 질문:', this.state.currentQuestion);
        console.log('전체 질문 수:', this.assessment.getTotalQuestions());
        console.log('마지막 질문인가:', this.state.currentQuestion === this.assessment.getTotalQuestions() - 1);

        if (this.state.currentQuestion < this.assessment.getTotalQuestions() - 1) {
            console.log('다음 질문으로 이동');
            this.loadQuestion(this.state.currentQuestion + 1);
        } else {
            console.log('마지막 질문 - completeAssessment() 호출');
            // 마지막 질문에서 다음 버튼 클릭 시 팔로워십 선택으로 이동
            this.completeAssessment();
        }
    }

    previousQuestion() {
        if (this.state.currentQuestion > 0) {
            this.loadQuestion(this.state.currentQuestion - 1);
        } else {
            // 첫 번째 질문에서 이전 버튼 클릭 시 Welcome 페이지로
            this.showSection('welcome');
        }
    }

    showAssessmentCompleteModal() {
        console.log('=== showAssessmentCompleteModal 호출 ===');

        const modal = document.getElementById('assessmentCompleteModal');
        if (!modal) {
            console.error('완료 모달을 찾을 수 없습니다');
            return;
        }

        // 모달 표시
        modal.style.display = 'flex';

        // 팔로워십 선택 버튼 이벤트
        const proceedBtn = document.getElementById('proceedToFollowershipBtn');
        if (proceedBtn) {
            // 기존 이벤트 리스너 제거 (중복 방지)
            const newProceedBtn = proceedBtn.cloneNode(true);
            proceedBtn.parentNode.replaceChild(newProceedBtn, proceedBtn);

            newProceedBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                this.completeAssessment();
            });
        }

        // 배경 클릭 시 모달 닫기 비활성화 (사용자가 버튼을 통해서만 진행)
        console.log('✓ 완료 모달 표시');
    }

    completeAssessment() {
        console.log('=== completeAssessment 호출 ===');
        console.log('assessment.isComplete():', this.assessment.isComplete());

        if (!this.assessment.isComplete()) {
            this.showErrorMessage('모든 질문에 답변해주세요.');
            return;
        }

        const result = this.assessment.determineLeadershipType();
        this.state.currentLeadershipCode = result.code;

        console.log('리더십 타입 결정:', result);
        console.log('currentLeadershipCode:', this.state.currentLeadershipCode);

        this.analyticsManager.trackAssessmentComplete(
            result.type,
            Date.now() - this.storageManager.restoreCurrentSession()?.startedAt || 0
        );

        console.log('팔로워십 섹션으로 이동');
        this.showSection('followership');

        console.log('팔로워십 옵션 페이지 생성');
        this.createFollowershipOptionsPage();
        console.log('✓ completeAssessment 완료');
    }

    // ========================================
    // Followership
    // ========================================

    createFollowershipOptionsPage() {
        console.log('=== createFollowershipOptionsPage 호출 ===');
        const container = document.getElementById('followershipOptionsPage');
        console.log('container:', container);

        if (!container) {
            console.error('❌ followershipOptionsPage 컨테이너를 찾을 수 없음');
            return;
        }

        container.innerHTML = '';
        const followershipTypes = this.teamCompatibility.followershipTypes;
        console.log('followershipTypes:', Object.keys(followershipTypes));

        Object.keys(followershipTypes).forEach(typeId => {
            const type = followershipTypes[typeId];
            const card = document.createElement('div');
            card.className = 'followership-card';
            card.setAttribute('data-type-id', typeId);

            // 안전한 HTML 생성 (JSON 데이터도 이스케이프 처리)
            const safeTypeId = SecurityUtils.escapeHTML(typeId);
            card.innerHTML = `
                <label class="followership-card-main" for="follower_${safeTypeId}">
                    <div class="followership-checkbox">
                        <input type="checkbox" id="follower_${safeTypeId}" value="${safeTypeId}">
                    </div>
                    <div class="followership-info">
                        <h4 class="followership-type-name">${SecurityUtils.escapeHTML(type.name)}</h4>
                        <p class="followership-type-desc">${SecurityUtils.escapeHTML(type.description)}</p>
                    </div>
                </label>
                <div class="member-name-input" id="memberInput_${safeTypeId}" style="display: none;">
                    <input type="text" placeholder="팀원 이름 입력 (여러 명은 쉼표(,)나 공백으로 구분)" class="member-name-field" id="memberName_${safeTypeId}" maxlength="100">
                </div>
            `;

            // 체크박스 이벤트
            const checkbox = card.querySelector('input[type="checkbox"]');
            const label = card.querySelector('.followership-card-main');

            console.log(`체크박스 이벤트 등록: ${typeId}`, checkbox);

            // 체크박스 change 이벤트
            this.eventManager.add(checkbox, 'change', () => {
                console.log(`체크박스 change 이벤트 발생: ${typeId}`);
                this.toggleFollowershipType(typeId);
            });

            // 카드 전체 클릭 시 체크박스 토글 (모바일 터치 향상)
            this.eventManager.add(label, 'click', (e) => {
                // 체크박스 자체를 클릭한 경우는 제외 (중복 방지)
                // 체크박스나 그 부모 요소(.followership-checkbox)를 클릭한 경우 제외
                if (e.target === checkbox || e.target.closest('.followership-checkbox')) {
                    return;
                }

                // 이미 label의 기본 동작으로 체크박스가 토글되지 않는 경우를 위한 추가 처리
                e.preventDefault();
                console.log(`카드 영역 클릭 → 체크박스 토글: ${typeId}`);
                checkbox.click(); // 체크박스 클릭을 프로그래밍적으로 트리거
            });

            container.appendChild(card);
        });

        console.log('✓ 팔로워십 카드 생성 완료, 카드 수:', container.children.length);
    }

    toggleFollowershipType(typeId) {
        console.log('=== toggleFollowershipType 호출 ===', typeId);
        const checkbox = document.getElementById(`follower_${typeId}`);
        const memberInput = document.getElementById(`memberInput_${typeId}`);

        console.log('checkbox:', checkbox);
        console.log('checkbox.checked:', checkbox?.checked);

        if (checkbox.checked) {
            memberInput.style.display = 'block';
            if (!this.state.selectedFollowers.find(f => f.id === typeId)) {
                this.state.selectedFollowers.push({ id: typeId, name: '', memberName: '' });
            }
        } else {
            memberInput.style.display = 'none';
            this.state.selectedFollowers = this.state.selectedFollowers.filter(f => f.id !== typeId);
        }

        console.log('현재 선택된 팔로워십:', this.state.selectedFollowers);

        // 결과 보기 버튼 상태 업데이트
        this.updateShowResultsButton();
    }

    updateShowResultsButton() {
        const btn = document.getElementById('showResultsBtn');
        console.log('updateShowResultsButton - 버튼:', btn);
        console.log('updateShowResultsButton - 선택 수:', this.state.selectedFollowers.length);
        if (btn) {
            btn.disabled = this.state.selectedFollowers.length === 0;
            console.log('updateShowResultsButton - 버튼 disabled:', btn.disabled);
        }
    }

    // ========================================
    // Results
    // ========================================

    showResultsPage() {
        console.log('=== AppController.showResultsPage 시작 ===');
        console.log('selectedFollowers:', this.state.selectedFollowers);
        console.log('currentLeadershipCode:', this.state.currentLeadershipCode);

        // 팔로워십 선택 확인
        if (this.state.selectedFollowers.length === 0) {
            this.showErrorMessage('팔로워십 유형을 최소 1개 이상 선택해주세요.');
            return;
        }

        console.log('✓ 팔로워십 선택 확인 완료');

        // 팀원 이름 수집 및 다중 이름 처리 (입력값 정제 적용)
        const expandedFollowers = [];
        this.state.selectedFollowers.forEach(follower => {
            const nameInput = document.getElementById(`memberName_${follower.id}`);
            if (nameInput && nameInput.value.trim()) {
                const names = nameInput.value
                    .split(/[,\s]+/)
                    .map(name => SecurityUtils.sanitizeInput(name, 30)) // XSS 방지 및 길이 제한
                    .filter(name => name.length > 0);

                if (names.length > 0) {
                    names.forEach(name => {
                        expandedFollowers.push({
                            id: follower.id,
                            name: this.teamCompatibility.followershipTypes[follower.id].name,
                            memberName: name
                        });
                    });
                } else {
                    expandedFollowers.push({
                        id: follower.id,
                        name: this.teamCompatibility.followershipTypes[follower.id].name,
                        memberName: '팀원'
                    });
                }
            } else {
                expandedFollowers.push({
                    id: follower.id,
                    name: this.teamCompatibility.followershipTypes[follower.id].name,
                    memberName: '팀원'
                });
            }
        });

        this.state.selectedFollowers = expandedFollowers;

        console.log('✓ 확장된 팀원 정보:', expandedFollowers);

        // 리더십 진단 결과 계산 (한 번만)
        const leadershipResult = this.assessment.determineLeadershipType();
        console.log('리더십 결과:', leadershipResult);

        try {
            console.log('=== 결과 화면 렌더링 시작 ===');

            // 1. 리더십 결과 표시 (AppController 내부 메서드 사용)
            this._displayLeadershipResults(leadershipResult);

            // 2. 팀원 궁합 분석 (AppController 내부 메서드 사용)
            this._analyzeTeamCompatibility(leadershipResult, expandedFollowers);

            console.log('=== 결과 페이지로 이동 ===');

            // 애널리틱스 추적
            this.analyticsManager.trackFollowershipSelection(expandedFollowers);

            // 결과 페이지로 이동 (섹션 전환)
            this.showSection('results');

            console.log('✓ 결과 페이지 표시 완료');
        } catch (error) {
            console.error('❌ 결과 페이지 표시 중 오류:', error);
            console.error('에러 스택:', error.stack);
            this.showErrorMessage('결과 페이지 표시 중 오류가 발생했습니다: ' + error.message);
        }
    }

    // ========================================
    // Private Helper Methods
    // ========================================

    _analyzeTeamCompatibility(leadershipResult, selectedFollowers) {
        console.log('=== _analyzeTeamCompatibility 시작 ===');
        console.log('리더십 코드:', leadershipResult.code);
        console.log('선택된 팔로워십:', selectedFollowers);

        const compatibilityList = document.getElementById('compatibilityList');
        if (!compatibilityList) {
            console.error('❌ compatibilityList 엘리먼트를 찾을 수 없음');
            return;
        }

        compatibilityList.innerHTML = '';

        if (selectedFollowers.length === 0) {
            compatibilityList.innerHTML = '<p class="empty-message">선택된 팀원이 없습니다.</p>';
            return;
        }

        // 동일한 팔로워십 유형끼리 그룹화
        const groupedFollowers = {};
        selectedFollowers.forEach(follower => {
            if (!groupedFollowers[follower.id]) {
                groupedFollowers[follower.id] = [];
            }
            groupedFollowers[follower.id].push(follower.memberName);
        });

        // 그룹화된 데이터로 카드 생성
        Object.keys(groupedFollowers).forEach(followerId => {
            const memberNames = groupedFollowers[followerId];
            const followerType = this.teamCompatibility.followershipTypes[followerId];
            const compatibility = this.teamCompatibility.analyzeCompatibility(leadershipResult.code, followerId);

            console.log('분석 중:', followerId, memberNames);
            console.log('분석 결과:', compatibility);

            const card = document.createElement('div');
            card.className = 'compatibility-unified-card';

            // 팀원 이름들을 개별 배지로 표시 (XSS 방지를 위해 이스케이프 처리)
            const nameBadges = memberNames.map(name =>
                `<span class="member-name-badge">${SecurityUtils.escapeHTML(name)}</span>`
            ).join('');

            // 안전한 HTML 생성 (모든 동적 데이터 이스케이프 처리)
            card.innerHTML = `
                <div class="compatibility-card-header">
                    <div class="follower-info">
                        <div class="follower-type-line">
                            <h4 class="follower-type-name">${SecurityUtils.escapeHTML(followerType.name)}</h4>
                            <span class="follower-type-subtitle">${SecurityUtils.escapeHTML(followerType.subtitle)}</span>
                        </div>
                    </div>
                    <div class="member-names-container">${nameBadges}</div>
                </div>
                <div class="compatibility-analysis-grid">
                    <div class="analysis-box analysis-strength">
                        <div class="analysis-box-label"><span class="analysis-icon">✓</span> 강점</div>
                        <div class="analysis-box-content">${SecurityUtils.escapeHTML(compatibility.strengths[0])}</div>
                    </div>
                    <div class="analysis-box analysis-caution">
                        <div class="analysis-box-label"><span class="analysis-icon">⚠</span> 주의</div>
                        <div class="analysis-box-content">${SecurityUtils.escapeHTML(compatibility.challenges[0])}</div>
                    </div>
                </div>
            `;

            compatibilityList.appendChild(card);
        });

        console.log('✓ 팔로워십 분석 완료');
    }

    _displayLeadershipResults(leadershipResult) {
        console.log('=== _displayLeadershipResults 시작 ===');
        console.log('리더십 결과:', leadershipResult);

        // SVG 요소 강제 초기화 (캐시 이슈 방지)
        this._resetRadarChart();

        // 리더십 유형 표시
        const leadershipTypeElement = document.getElementById('leadershipType');
        const leadershipSubtitleElement = document.getElementById('leadershipSubtitle');
        const leadershipStrengthsElement = document.getElementById('leadershipStrengths');
        const leadershipCautionsElement = document.getElementById('leadershipCautions');

        if (!leadershipTypeElement || !leadershipSubtitleElement ||
            !leadershipStrengthsElement || !leadershipCautionsElement) {
            console.error('❌ 리더십 결과 표시 엘리먼트를 찾을 수 없음');
            return;
        }

        if (leadershipResult.type && leadershipResult.type.name) {
            leadershipTypeElement.textContent = leadershipResult.type.name;
            leadershipSubtitleElement.textContent = leadershipResult.type.subtitle || '';

            // 강점 표시
            leadershipStrengthsElement.innerHTML = '';
            if (leadershipResult.type.strengths && leadershipResult.type.strengths.length > 0) {
                leadershipResult.type.strengths.forEach(strength => {
                    const li = document.createElement('li');
                    li.textContent = strength;
                    leadershipStrengthsElement.appendChild(li);
                });
            }

            // 주의점 표시
            leadershipCautionsElement.innerHTML = '';
            if (leadershipResult.type.cautions && leadershipResult.type.cautions.length > 0) {
                leadershipResult.type.cautions.forEach(caution => {
                    const li = document.createElement('li');
                    li.textContent = caution;
                    leadershipCautionsElement.appendChild(li);
                });
            }

            console.log('✓ 리더십 유형 표시 완료:', leadershipResult.type.name);
        } else {
            console.error('❌ 리더십 유형 정보 없음:', leadershipResult);
            leadershipTypeElement.textContent = '리더십 유형 정보를 불러올 수 없습니다';
        }

        // 점수 및 유형 검증 로그
        console.log('=== 리더십 결과 검증 ===');
        console.log('🔢 원본 응답 데이터:', this.assessment.responses);
        console.log('📊 점수:', leadershipResult.scores);
        console.log('  - Sharing:', leadershipResult.scores.sharing);
        console.log('  - Interaction:', leadershipResult.scores.interaction);
        console.log('  - Growth:', leadershipResult.scores.growth);
        console.log('🏷️  유형 코드:', leadershipResult.code);
        console.log('📝 유형 이름:', leadershipResult.type.name);
        console.log('⚖️  임계값 4.5 기준:');
        console.log('  - Sharing >= 4.5?', leadershipResult.scores.sharing >= 4.5 ? '✅' : '❌', leadershipResult.scores.sharing >= 4.5);
        console.log('  - Interaction >= 4.5?', leadershipResult.scores.interaction >= 4.5 ? '✅' : '❌', leadershipResult.scores.interaction >= 4.5);
        console.log('  - Growth >= 4.5?', leadershipResult.scores.growth >= 4.5 ? '✅' : '❌', leadershipResult.scores.growth >= 4.5);
        console.log('====================');

        // 레이더 차트 업데이트 (내부 메서드 사용)
        this._updateRadarChart(leadershipResult.scores);

        // 리더십 팁 로드 (내부 메서드 사용)
        this._loadLeadershipTips(leadershipResult.code);

        console.log('✓ 리더십 결과 표시 완료');
    }

    _resetRadarChart() {
        console.log('🔄 레이더 차트 초기화 시작');

        // SVG 요소들을 중앙(200, 200)으로 강제 리셋
        const center = 200;

        // 점수 포인트 초기화
        const sharingPoint = document.getElementById('sharingPoint');
        const interactionPoint = document.getElementById('interactionPoint');
        const growthPoint = document.getElementById('growthPoint');

        if (sharingPoint && interactionPoint && growthPoint) {
            sharingPoint.setAttribute('cx', center);
            sharingPoint.setAttribute('cy', center);
            interactionPoint.setAttribute('cx', center);
            interactionPoint.setAttribute('cy', center);
            growthPoint.setAttribute('cx', center);
            growthPoint.setAttribute('cy', center);

            // 스타일 초기화
            sharingPoint.style.opacity = '0';
            sharingPoint.style.transform = 'scale(0)';
            interactionPoint.style.opacity = '0';
            interactionPoint.style.transform = 'scale(0)';
            growthPoint.style.opacity = '0';
            growthPoint.style.transform = 'scale(0)';
        }

        // 폴리곤 영역 초기화
        const scoreArea = document.getElementById('scoreArea');
        if (scoreArea) {
            scoreArea.setAttribute('points', `${center},${center} ${center},${center} ${center},${center}`);
            scoreArea.style.opacity = '0';
            scoreArea.style.transform = 'scale(0)';
        }

        console.log('✓ 레이더 차트 초기화 완료');
    }

    _updateRadarChart(scores) {
        console.log('📈 레이더 차트 업데이트 시작:', scores);

        // 점수를 0-6 범위에서 0-160으로 변환 (중심에서 최대 반지름까지)
        const center = 200;
        const maxRadius = 160;

        // 각 축의 각도 (라디안) - 120도씩 균등 분할
        const angles = {
            sharing: -Math.PI / 2,           // 위쪽 (90도)
            interaction: Math.PI / 6,        // 오른쪽 아래 (30도)
            growth: 5 * Math.PI / 6          // 왼쪽 아래 (150도)
        };

        // 점수에 따른 반지름 계산 (1~6점 범위)
        const sharingRadius = ((scores.sharing - 1) / 5) * maxRadius;
        const interactionRadius = ((scores.interaction - 1) / 5) * maxRadius;
        const growthRadius = ((scores.growth - 1) / 5) * maxRadius;

        console.log('📐 반지름 계산:');
        console.log('  - Sharing:', sharingRadius.toFixed(1), 'px');
        console.log('  - Interaction:', interactionRadius.toFixed(1), 'px');
        console.log('  - Growth:', growthRadius.toFixed(1), 'px');

        // 각 점의 좌표 계산
        const sharingX = center + sharingRadius * Math.cos(angles.sharing);
        const sharingY = center + sharingRadius * Math.sin(angles.sharing);

        const interactionX = center + interactionRadius * Math.cos(angles.interaction);
        const interactionY = center + interactionRadius * Math.sin(angles.interaction);

        const growthX = center + growthRadius * Math.cos(angles.growth);
        const growthY = center + growthRadius * Math.sin(angles.growth);

        // 점수 포인트 위치 업데이트
        document.getElementById('sharingPoint').setAttribute('cx', sharingX);
        document.getElementById('sharingPoint').setAttribute('cy', sharingY);

        document.getElementById('interactionPoint').setAttribute('cx', interactionX);
        document.getElementById('interactionPoint').setAttribute('cy', interactionY);

        document.getElementById('growthPoint').setAttribute('cx', growthX);
        document.getElementById('growthPoint').setAttribute('cy', growthY);

        // 폴리곤 영역 업데이트
        const polygonPoints = `${sharingX},${sharingY} ${interactionX},${interactionY} ${growthX},${growthY}`;
        document.getElementById('scoreArea').setAttribute('points', polygonPoints);

        // 애니메이션 효과 추가
        this._animateRadarChart();

        // 인터랙티브 효과 추가
        this._addRadarChartInteraction(scores);
    }

    _animateRadarChart() {
        const scoreArea = document.getElementById('scoreArea');
        const points = document.querySelectorAll('.score-point');

        // 초기 상태 설정
        scoreArea.style.opacity = '0';
        scoreArea.style.transform = 'scale(0)';

        points.forEach((point, index) => {
            point.style.opacity = '0';
            point.style.transform = 'scale(0)';
        });

        // 애니메이션 실행
        setTimeout(() => {
            scoreArea.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            scoreArea.style.opacity = '1';
            scoreArea.style.transform = 'scale(1)';
        }, 300);

        points.forEach((point, index) => {
            setTimeout(() => {
                point.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                point.style.opacity = '1';
                point.style.transform = 'scale(1)';
            }, 500 + index * 200);
        });
    }

    _addRadarChartInteraction(scores) {
        const scorePoints = document.querySelectorAll('.score-point');
        const scoreCards = document.querySelectorAll('.score-detail-card');

        // 점수 포인트 클릭/호버 이벤트
        scorePoints.forEach((point) => {
            const category = point.classList[1]; // sharing, interaction, growth

            point.addEventListener('mouseenter', () => {
                // 해당 카테고리 카드 하이라이트
                const targetCard = document.querySelector(`[data-category="${category}"]`);
                if (targetCard) {
                    targetCard.style.transform = 'translateY(-4px) scale(1.02)';
                    targetCard.style.boxShadow = '0 12px 32px rgba(71, 85, 105, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.7)';
                }

                // 점수 영역 하이라이트
                const scoreArea = document.getElementById('scoreArea');
                scoreArea.style.fill = `rgba(${this._getCategoryColor(category)}, 0.3)`;
                scoreArea.style.stroke = `rgba(${this._getCategoryColor(category)}, 0.8)`;
            });

            point.addEventListener('mouseleave', () => {
                // 카드 원래 상태로
                const targetCard = document.querySelector(`[data-category="${category}"]`);
                if (targetCard) {
                    targetCard.style.transform = '';
                    targetCard.style.boxShadow = '';
                }

                // 점수 영역 원래 상태로
                const scoreArea = document.getElementById('scoreArea');
                scoreArea.style.fill = 'rgba(139, 92, 246, 0.15)';
                scoreArea.style.stroke = 'rgba(139, 92, 246, 0.6)';
            });

            point.addEventListener('click', () => {
                // 점수 카드 애니메이션
                const targetCard = document.querySelector(`[data-category="${category}"]`);
                if (targetCard) {
                    targetCard.style.animation = 'scoreCardPulse 0.6s ease';
                    setTimeout(() => {
                        targetCard.style.animation = '';
                    }, 600);
                }
            });
        });

        // 점수 카드 호버 이벤트
        scoreCards.forEach((card) => {
            const category = card.dataset.category;

            card.addEventListener('mouseenter', () => {
                // 해당 점수 포인트 하이라이트
                const targetPoint = document.querySelector(`.score-point.${category}`);
                if (targetPoint) {
                    targetPoint.setAttribute('r', '9');
                    targetPoint.style.filter = 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))';
                }
            });

            card.addEventListener('mouseleave', () => {
                // 점수 포인트 원래 상태로
                const targetPoint = document.querySelector(`.score-point.${category}`);
                if (targetPoint) {
                    targetPoint.setAttribute('r', '6');
                    targetPoint.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))';
                }
            });
        });
    }

    _getCategoryColor(category) {
        switch (category) {
            case 'sharing':
                return '16, 185, 129';  // green
            case 'interaction':
                return '59, 130, 246';  // blue
            case 'growth':
                return '245, 158, 11';  // amber
            default:
                return '139, 92, 246';  // purple
        }
    }

    async _loadLeadershipTips(leadershipCode) {
        const container = document.getElementById('leadershipTipsContainer');

        try {
            // 데이터 로드 (캐싱)
            if (!this._leadershipTipsData) {
                const response = await fetch('data/leadership-tips.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this._leadershipTipsData = await response.json();
            }

            const typeData = this._leadershipTipsData[leadershipCode];
            if (!typeData) {
                console.warn('리더십 팁 데이터를 찾을 수 없습니다:', leadershipCode);
                if (container) {
                    container.innerHTML = '<p class="empty-message">해당 리더십 유형의 팁 데이터를 찾을 수 없습니다.</p>';
                }
                return;
            }

            this._currentTipsData = typeData;
            this._activeWhenFilters = [];

            // 소개 문구 설정
            const introElement = document.getElementById('leadershipMoreIntro');
            if (introElement) {
                introElement.textContent = typeData.intro;
            }

            // 팁 카드 생성
            if (!container) return;

            container.innerHTML = '';

            if (typeData.tips && typeData.tips.length > 0) {
                // 상황별 필터 UI 생성
                const filterUI = this._createSituationFilter(typeData.tips);
                container.appendChild(filterUI);

                // 팁 카드들을 담을 컨테이너
                const cardsContainer = document.createElement('div');
                cardsContainer.className = 'tip-cards-container';
                cardsContainer.id = 'tipCardsContainer';

                typeData.tips.forEach((tip, index) => {
                    const card = this._createTipCard(tip, index);
                    cardsContainer.appendChild(card);
                });

                container.appendChild(cardsContainer);
            } else {
                container.innerHTML = '<p class="empty-message">추가 팁이 준비 중입니다.</p>';
            }
        } catch (error) {
            console.error('리더십 팁 로드 실패:', error);
            // 사용자에게 에러 메시지 표시
            if (container) {
                container.innerHTML = `
                    <div class="error-message" style="
                        background: #fee2e2;
                        border: 1px solid #f87171;
                        border-radius: 8px;
                        padding: 16px;
                        color: #991b1b;
                        text-align: center;
                    ">
                        <p style="margin: 0 0 8px 0; font-weight: 600;">팁을 불러오는 데 실패했습니다</p>
                        <p style="margin: 0; font-size: 14px;">페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>
                    </div>
                `;
            }
            // 에러 추적 (AnalyticsManager가 있으면 사용)
            if (this.analyticsManager) {
                this.analyticsManager.trackError('Leadership tips load failed', error.message);
            }
        }
    }

    _createSituationFilter(tips) {
        // 모든 상황들을 수집
        const allSituations = [];
        tips.forEach(tip => {
            if (tip.when && tip.when.length > 0) {
                tip.when.forEach(situation => {
                    if (!allSituations.includes(situation)) {
                        allSituations.push(situation);
                    }
                });
            }
        });

        const filterWrapper = document.createElement('div');
        filterWrapper.className = 'situation-filter-wrapper';

        filterWrapper.innerHTML = `
            <div class="situation-filter-header">
                <h4 class="situation-filter-title">지금 어떤 상황인가요?</h4>
                <p class="situation-filter-desc">해당하는 상황을 선택하세요 (복수 선택 가능)</p>
            </div>
            <div class="situation-filter-chips" id="situationFilterChips">
                ${allSituations.map(situation => `
                    <button class="situation-chip" data-situation="${situation}">
                        ${situation}
                    </button>
                `).join('')}
            </div>
            <div class="filter-result-message" id="filterResultMessage" style="display: none;">
                <span class="result-count"></span>개의 추천 팁이 있습니다
            </div>
        `;

        // 필터 클릭 이벤트 (토글 방식)
        setTimeout(() => {
            const chips = filterWrapper.querySelectorAll('.situation-chip');
            chips.forEach(chip => {
                this.eventManager.add(chip, 'click', () => {
                    const situation = chip.dataset.situation;

                    // 토글: 이미 선택되었으면 제거, 아니면 추가
                    if (chip.classList.contains('active')) {
                        chip.classList.remove('active');
                        this._activeWhenFilters = this._activeWhenFilters.filter(s => s !== situation);
                    } else {
                        chip.classList.add('active');
                        this._activeWhenFilters.push(situation);
                    }

                    this._filterTipsByMultipleSituations();
                });
            });
        }, 0);

        return filterWrapper;
    }

    _filterTipsByMultipleSituations() {
        const cards = document.querySelectorAll('.tip-card');
        const messageEl = document.getElementById('filterResultMessage');
        let matchCount = 0;

        cards.forEach(card => {
            const tipIndex = parseInt(card.dataset.tipIndex);
            const tip = this._currentTipsData.tips[tipIndex];

            if (this._activeWhenFilters.length === 0) {
                // 선택된 필터가 없으면 모든 카드 표시
                card.style.display = 'block';
                card.classList.remove('filtered-out', 'highlighted');
            } else {
                // 선택된 상황 중 하나라도 포함되면 표시
                const matches = tip.when && this._activeWhenFilters.some(filter => tip.when.includes(filter));
                if (matches) {
                    card.style.display = 'block';
                    card.classList.remove('filtered-out');
                    card.classList.add('highlighted');
                    matchCount++;
                } else {
                    card.style.display = 'none';
                    card.classList.add('filtered-out');
                    card.classList.remove('highlighted');
                }
            }
        });

        // 결과 메시지 표시
        if (messageEl) {
            if (this._activeWhenFilters.length > 0) {
                messageEl.style.display = 'block';
                messageEl.querySelector('.result-count').textContent = matchCount;
            } else {
                messageEl.style.display = 'none';
            }
        }
    }

    _createTipCard(tip, index) {
        const card = document.createElement('div');
        card.className = 'tip-card';
        card.dataset.tipIndex = index;

        card.innerHTML = `
            <div class="tip-card-header">
                <div class="tip-card-number">${index + 1}</div>
                <h3 class="tip-card-title">${tip.title}</h3>
                <button class="tip-card-toggle" aria-expanded="false" aria-label="상세 내용 펼치기">
                    <svg class="toggle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>
            <div class="tip-card-content">
                <div class="tip-section why-section">
                    <h4 class="tip-section-title">왜 필요할까요?</h4>
                    <div class="panel-content why-panel">
                        <p class="why-text">${tip.why}</p>
                    </div>
                </div>
                <div class="tip-section how-section">
                    <h4 class="tip-section-title">이렇게 해보세요</h4>
                    <div class="panel-content how-panel">
                        ${tip.actions.map((action, i) => `
                            <div class="action-card">
                                <div class="action-step-number">Step ${i + 1}</div>
                                <div class="action-situation-text">${action.situation}</div>
                                <div class="action-detail">
                                    <div class="action-label">실행 방법</div>
                                    <div class="action-text">${action.action}</div>
                                </div>
                                <div class="action-example-box">
                                    <div class="example-label">예시 문장</div>
                                    <div class="example-text">"${action.example}"</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // 카드 토글 이벤트
        const toggleBtn = card.querySelector('.tip-card-toggle');
        this.eventManager.add(toggleBtn, 'click', () => {
            const isOpen = card.classList.contains('expanded');
            toggleBtn.setAttribute('aria-expanded', !isOpen);
            card.classList.toggle('expanded', !isOpen);
        });

        return card;
    }

    // ========================================
    // Utility
    // ========================================

    resetAssessment() {
        if (confirm('진단을 처음부터 다시 시작하시겠습니까?')) {
            this.assessment.reset();
            this.state.currentQuestion = 0;
            this.state.selectedFollowers = [];
            this.state.currentLeadershipCode = null;
            this.storageManager.clearCurrentSession();
            this.showSection('welcome');
        }
    }

    showErrorMessage(message) {
        const existingError = document.querySelector('.error-toast');
        if (existingError) {
            existingError.remove();
        }

        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.textContent = message;
        errorToast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-weight: 500;
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(errorToast);

        setTimeout(() => {
            errorToast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => errorToast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // Cleanup
    // ========================================

    cleanup() {
        this.eventManager.removeAll();
        console.log('✓ AppController cleanup 완료');
    }
}

// ========================================
// Event Manager - 이벤트 리스너 생명주기 관리
// ========================================

class EventManager {
    constructor() {
        this.listeners = [];
    }

    add(element, event, handler, options = {}) {
        if (!element) return;

        element.addEventListener(event, handler, options);
        this.listeners.push({ element, event, handler, options });
    }

    remove(element, event, handler) {
        const index = this.listeners.findIndex(
            l => l.element === element && l.event === event && l.handler === handler
        );

        if (index !== -1) {
            const listener = this.listeners[index];
            listener.element.removeEventListener(listener.event, listener.handler);
            this.listeners.splice(index, 1);
        }
    }

    removeAll() {
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners = [];
    }
}

// Export
if (typeof window !== 'undefined') {
    window.SecurityUtils = SecurityUtils;
    window.AppController = AppController;
    window.EventManager = EventManager;
}
