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

            // 4. 세션 복구 시도
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

        // 새 섹션 표시
        setTimeout(() => {
            document.getElementById(sectionId).classList.add('active');
        }, 150);

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

            // 모바일 네비게이션 초기화
            if (window.innerWidth <= 768 && !this.ui.mobileNav) {
                this.ui.mobileNav = new MobileNavigationManager();
            }

            this.loadQuestion(0);
            this.analyticsManager.trackAssessmentStart();
        } catch (error) {
            console.error('진단 시작 오류:', error);
            this.showErrorMessage('진단을 시작할 수 없습니다. 페이지를 새로고침해주세요.');
        }
    }

    loadQuestion(index) {
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
            this.ui.mobileInput = new MobileNativeInput(inputContainer, {
                defaultValue: currentResponse,
                min: 1,
                max: 6,
                onChange: (value) => {
                    this.assessment.recordResponse(question.id, value);
                    this.updateNextButton();
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
            const canGoPrev = true;
            const canGoNext = this.assessment.responses[question.id] !== undefined;
            this.ui.mobileNav.updateNavigation(canGoPrev, canGoNext, '다음');
        }

        // 세션 저장
        this.storageManager.saveCurrentSession(this.assessment, this.state.currentQuestion);
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
            nextBtnText.textContent = '다음';
        }

        // 모바일 네비게이션도 업데이트
        if (this.ui.mobileNav && window.innerWidth <= 768) {
            const canGoPrev = true;
            this.ui.mobileNav.updateNavigation(canGoPrev, hasResponse, '다음');
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
        if (this.state.currentQuestion < this.assessment.getTotalQuestions() - 1) {
            this.loadQuestion(this.state.currentQuestion + 1);
        }
    }

    previousQuestion() {
        if (this.state.currentQuestion > 0) {
            this.loadQuestion(this.state.currentQuestion - 1);
        }
    }

    completeAssessment() {
        if (!this.assessment.isComplete()) {
            this.showErrorMessage('모든 질문에 답변해주세요.');
            return;
        }

        const result = this.assessment.determineLeadershipType();
        this.state.currentLeadershipCode = result.code;

        this.analyticsManager.trackAssessmentComplete(
            result.type,
            Date.now() - this.storageManager.restoreCurrentSession()?.startedAt || 0
        );

        this.showSection('followership');
        this.createFollowershipOptionsPage();
    }

    // ========================================
    // Followership
    // ========================================

    createFollowershipOptionsPage() {
        const container = document.getElementById('followershipOptionsPage');
        if (!container) return;

        container.innerHTML = '';
        const followershipTypes = this.teamCompatibility.followershipTypes;

        Object.keys(followershipTypes).forEach(typeId => {
            const type = followershipTypes[typeId];
            const card = document.createElement('div');
            card.className = 'followership-card';
            card.setAttribute('data-type-id', typeId);

            card.innerHTML = `
                <div class="followership-card-main">
                    <div class="followership-checkbox">
                        <input type="checkbox" id="follower_${typeId}" value="${typeId}">
                    </div>
                    <div class="followership-info">
                        <h4 class="followership-type-name">${type.name}</h4>
                        <p class="followership-type-desc">${type.description}</p>
                    </div>
                </div>
                <div class="member-name-input" id="memberInput_${typeId}" style="display: none;">
                    <input type="text" placeholder="팀원 이름 입력 (여러 명은 쉼표(,)나 공백으로 구분)" class="member-name-field" id="memberName_${typeId}">
                </div>
            `;

            // 체크박스 이벤트
            const checkbox = card.querySelector('input[type="checkbox"]');
            this.eventManager.add(checkbox, 'change', () => {
                this.toggleFollowershipType(typeId);
            });

            container.appendChild(card);
        });
    }

    toggleFollowershipType(typeId) {
        const checkbox = document.getElementById(`follower_${typeId}`);
        const memberInput = document.getElementById(`memberInput_${typeId}`);

        if (checkbox.checked) {
            memberInput.style.display = 'block';
            if (!this.state.selectedFollowers.find(f => f.id === typeId)) {
                this.state.selectedFollowers.push({ id: typeId, name: '', memberName: '' });
            }
        } else {
            memberInput.style.display = 'none';
            this.state.selectedFollowers = this.state.selectedFollowers.filter(f => f.id !== typeId);
        }

        this.updateShowResultsButton();
    }

    updateShowResultsButton() {
        const btn = document.getElementById('showResultsBtn');
        if (btn) {
            btn.disabled = this.state.selectedFollowers.length === 0;
        }
    }

    // ========================================
    // Results
    // ========================================

    showResultsPage() {
        // 결과 표시 로직은 기존 코드 유지
        this.showSection('results');

        const result = this.assessment.determineLeadershipType();
        // ... 기존 결과 표시 로직 ...
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
    window.AppController = AppController;
    window.EventManager = EventManager;
}
