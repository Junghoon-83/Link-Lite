/**
 * Mobile Native Input Component
 * 전문적이고 모바일 최적화된 터치 인터페이스
 */

class MobileNativeInput {
    constructor(container, options = {}) {
        this.container = container;
        this.value = options.defaultValue || null; // No default selection
        this.min = options.min || 1;
        this.max = options.max || 6;
        this.onChange = options.onChange || (() => {});
        this.isTouchDevice = false; // 터치 디바이스 감지

        this.labels = [
            '매우\n그렇지 않다',
            '그렇지\n않다',
            '약간\n그렇지 않다',
            '약간\n그렇다',
            '그렇다',
            '매우\n그렇다'
        ];

        this.shortLabels = [
            '전혀',
            '아니다',
            '약간 아니다',
            '약간 그렇다',
            '그렇다',
            '매우'
        ];

        this.init();
        this.attachEventListeners();
    }

    init() {
        this.container.innerHTML = this.createHTML();
        this.touchZones = this.container.querySelectorAll('.premium-score-button');
        this.feedbackProgress = this.container.querySelector('.feedback-progress');
        this.selectedDisplay = this.container.querySelector('.selected-value-display');

        // CSS 클래스로 터치 존 애니메이션 비활성화
        this.touchZones.forEach(zone => {
            zone.classList.add('fixed-touch-zone');
        });

        if (this.value) {
            this.updateValue(this.value, false);
        } else {
            this.updateInitialState();
        }
    }

    createHTML() {
        return `
            <div class="mobile-input-container">
                <div class="quick-select-header">
                    <span class="select-instruction">아래에서 선택하세요</span>
                    <div class="selected-value-display">${this.value || '-'}</div>
                </div>

                <div class="feedback-bar">
                    <div class="feedback-progress"></div>
                </div>

                <div class="touch-zone-grid">
                    ${Array.from({length: 6}, (_, i) => this.createTouchZone(i + 1)).join('')}
                </div>
            </div>
        `;
    }

    createTouchZone(value) {
        const isSelected = value === this.value;

        // 선택된 버튼만 점수별 고유 색상 적용
        const scoreColors = {
            1: { primary: '#ef4444', secondary: '#dc2626' },
            2: { primary: '#f97316', secondary: '#ea580c' },
            3: { primary: '#f59e0b', secondary: '#d97706' },
            4: { primary: '#84cc16', secondary: '#65a30d' },
            5: { primary: '#22c55e', secondary: '#16a34a' },
            6: { primary: '#10b981', secondary: '#059669' }
        };

        const selectedColor = scoreColors[value];

        const selectedStyle = isSelected ?
            `background: linear-gradient(145deg, ${selectedColor.primary}, ${selectedColor.secondary}) !important;
             color: white !important;
             border: none !important;
             box-shadow:
                0 16px 40px rgba(${this.hexToRgb(selectedColor.primary)}, 0.25),
                0 8px 20px rgba(${this.hexToRgb(selectedColor.primary)}, 0.15),
                0 4px 10px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;` :
            `background: linear-gradient(145deg,
                rgba(255, 255, 255, 0.98),
                rgba(248, 250, 252, 0.95)) !important;
             backdrop-filter: blur(20px) !important;
             color: #4f46e5 !important;
             border: none !important;
             box-shadow:
                0 8px 24px rgba(0, 0, 0, 0.04),
                0 4px 12px rgba(0, 0, 0, 0.02),
                0 2px 6px rgba(0, 0, 0, 0.01),
                inset 0 1px 0 rgba(255, 255, 255, 0.9),
                0 0 0 1px rgba(79, 70, 229, 0.08) !important;`;

        return `
            <button class="premium-score-button ${isSelected ? 'selected' : ''}"
                    data-value="${value}"
                    type="button"
                    aria-label="${this.shortLabels[value - 1]}"
                    aria-pressed="${isSelected}"
                    style="transform: none !important;
                           scale: 1 !important;
                           animation: none !important;
                           transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                           ${selectedStyle}">
                <div class="score-shimmer" style="position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); z-index: 1; pointer-events: none;"></div>
                <span class="zone-value" style="font-size: 1.6rem !important; font-weight: 800 !important; margin-bottom: 2px !important; transform: none !important; z-index: 3 !important; position: relative !important; letter-spacing: -0.02em !important; ${isSelected ? 'color: rgb(255, 255, 255) !important; text-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;' : 'color: #4f46e5 !important;'}">${value}</span>
                <span class="zone-label" style="font-size: 0.7rem !important; font-weight: 600 !important; text-align: center !important; opacity: ${isSelected ? '1' : '0.8'} !important; line-height: 1.2 !important; transform: none !important; z-index: 3 !important; position: relative !important; padding: 0 2px !important; letter-spacing: 0.01em !important; ${isSelected ? 'color: rgb(255, 255, 255) !important; text-shadow: 0 1px 3px rgba(0,0,0,0.25) !important;' : 'color: #6366f1 !important;'}">${this.labels[value - 1]}</span>
            </button>
        `;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '0, 0, 0';
    }

    attachEventListeners() {
        this.touchZones.forEach((zone, index) => {
            const value = index + 1;

            // 실시간 스타일 변경 감지 및 차단
            this.observeZoneStyles(zone);

            // Touch Events
            zone.addEventListener('touchstart', (e) => {
                this.isTouchDevice = true; // 터치 디바이스로 표시
                this.handleTouchStart(e, value);
            }, { passive: true });
            zone.addEventListener('touchend', (e) => this.handleTouchEnd(e, value), { passive: true });

            // Mouse Events (for desktop testing)
            zone.addEventListener('mousedown', (e) => this.handleTouchStart(e, value));
            zone.addEventListener('mouseup', (e) => this.handleTouchEnd(e, value));
            zone.addEventListener('click', (e) => this.selectValue(value));

            // Hover Events - 우측 상단 점수 미리보기 (데스크톱만)
            zone.addEventListener('mouseenter', () => {
                // 터치 디바이스에서는 호버 미리보기 비활성화
                if (!this.isTouchDevice) {
                    this.handleHoverPreview(value);
                }
            });
            zone.addEventListener('mouseleave', () => {
                // 터치 디바이스에서는 호버 미리보기 비활성화
                if (!this.isTouchDevice) {
                    this.handleHoverEnd();
                }
            });

            // Keyboard Support
            zone.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectValue(value);
                }
            });

            // Focus Events
            zone.addEventListener('focus', () => this.handleFocus(zone));
            zone.addEventListener('blur', () => this.handleBlur(zone));
        });

        // Keyboard Navigation
        this.container.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }

    observeZoneStyles(zone) {
        // 기존 observer가 있으면 먼저 해제 (메모리 누수 방지)
        const existingObserver = zone.__mutationObserver;
        if (existingObserver) {
            existingObserver.disconnect();
            // observers 배열에서도 제거
            if (this.observers) {
                const index = this.observers.indexOf(existingObserver);
                if (index > -1) {
                    this.observers.splice(index, 1);
                }
            }
        }

        // MutationObserver로 스타일 변경 감지
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // 스타일이 변경되면 즉시 애니메이션 차단
                    this.forceNoAnimation(zone);
                }
            });
        });

        observer.observe(zone, {
            attributes: true,
            attributeFilter: ['style']
        });

        // zone에 직접 저장하여 중복 방지
        zone.__mutationObserver = observer;

        // 클래스에 observer 저장
        if (!this.observers) this.observers = [];
        this.observers.push(observer);
    }

    forceNoAnimation(zone) {
        // CSS 클래스로 애니메이션 비활성화
        zone.classList.add('fixed-touch-zone');
    }

    handleTouchStart(e, value) {
        const zone = e.currentTarget;

        console.log('=== TOUCH START DEBUG ===');
        console.log('Before touch - computed styles:', {
            transform: window.getComputedStyle(zone).transform,
            scale: window.getComputedStyle(zone).scale,
            width: window.getComputedStyle(zone).width,
            height: window.getComputedStyle(zone).height
        });

        // 애니메이션 강제 비활성화
        zone.style.setProperty('transform', 'none', 'important');
        zone.style.setProperty('scale', '1', 'important');
        zone.style.setProperty('animation', 'none', 'important');
        zone.style.setProperty('transition', 'none', 'important');
        zone.style.setProperty('width', zone.offsetWidth + 'px', 'important');
        zone.style.setProperty('height', zone.offsetHeight + 'px', 'important');

        console.log('After force styles:', {
            transform: window.getComputedStyle(zone).transform,
            scale: window.getComputedStyle(zone).scale,
            width: window.getComputedStyle(zone).width,
            height: window.getComputedStyle(zone).height
        });

        this.createRippleEffect(e, zone);
        this.triggerHapticFeedback('light');
    }

    handleTouchEnd(e, value) {
        const zone = e.currentTarget;

        console.log('=== TOUCH END DEBUG ===');
        console.log('Touch end - computed styles:', {
            transform: window.getComputedStyle(zone).transform,
            scale: window.getComputedStyle(zone).scale,
            width: window.getComputedStyle(zone).width,
            height: window.getComputedStyle(zone).height
        });

        // 애니메이션 강제 비활성화
        zone.style.setProperty('transform', 'none', 'important');
        zone.style.setProperty('scale', '1', 'important');
        zone.style.setProperty('animation', 'none', 'important');
        zone.style.setProperty('transition', 'none', 'important');

        // Small delay to ensure ripple effect is visible
        setTimeout(() => {
            console.log('Before selectValue - computed styles:', {
                transform: window.getComputedStyle(zone).transform,
                scale: window.getComputedStyle(zone).scale,
                width: window.getComputedStyle(zone).width,
                height: window.getComputedStyle(zone).height
            });
            this.selectValue(value);
        }, 50);
    }

    handleFocus(zone) {
        zone.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    }

    handleBlur(zone) {
        if (!zone.classList.contains('selected')) {
            zone.style.boxShadow = '';
        }
    }

    handleHoverPreview(value) {
        // 점수 색상 정의
        const scoreColors = {
            1: '#ef4444', // Red
            2: '#f97316', // Orange
            3: '#f59e0b', // Amber
            4: '#84cc16', // Lime
            5: '#22c55e', // Green
            6: '#10b981'  // Emerald
        };

        // 우측 상단 점수 표시 영역 업데이트 (호버 중)
        this.selectedDisplay.textContent = value;
        this.selectedDisplay.style.setProperty('background', scoreColors[value], 'important');
        this.selectedDisplay.style.setProperty('opacity', '0.8', 'important'); // 미리보기는 살짝 투명하게

        // 피드백 바도 업데이트
        const percentage = ((value - this.min) / (this.max - this.min)) * 100;
        this.feedbackProgress.style.width = `${percentage}%`;
        this.feedbackProgress.style.setProperty('background', scoreColors[value], 'important');
        this.feedbackProgress.style.setProperty('opacity', '0.8', 'important');
    }

    handleHoverEnd() {
        // 호버가 끝나면 실제 선택된 값으로 복원
        if (this.value) {
            const scoreColors = {
                1: '#ef4444',
                2: '#f97316',
                3: '#f59e0b',
                4: '#84cc16',
                5: '#22c55e',
                6: '#10b981'
            };

            this.selectedDisplay.textContent = this.value;
            this.selectedDisplay.style.setProperty('background', scoreColors[this.value], 'important');
            this.selectedDisplay.style.removeProperty('opacity'); // 투명도 제거

            const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
            this.feedbackProgress.style.width = `${percentage}%`;
            this.feedbackProgress.style.setProperty('background', scoreColors[this.value], 'important');
            this.feedbackProgress.style.removeProperty('opacity');
        } else {
            // 아직 선택하지 않았으면 초기 상태로
            this.selectedDisplay.textContent = '-';
            this.selectedDisplay.style.setProperty('background', '#8E8E93', 'important');
            this.selectedDisplay.style.removeProperty('opacity');

            this.feedbackProgress.style.width = '0%';
            this.feedbackProgress.style.setProperty('background', '#8E8E93', 'important');
            this.feedbackProgress.style.removeProperty('opacity');
        }
    }

    selectValue(value) {
        if (value === this.value) return; // No change needed

        // 모든 터치 존의 애니메이션 강제 비활성화
        this.touchZones.forEach(zone => {
            zone.style.transform = 'none';
            zone.style.scale = '1';
            zone.style.animation = 'none';
            zone.style.transition = 'none';
        });

        this.updateValue(value, true);
        this.triggerHapticFeedback('medium');
        this.createSelectionFeedback();
        this.onChange(value);
    }

    updateInitialState() {
        // Set up initial state with no selection
        this.touchZones.forEach((zone) => {
            zone.classList.remove('selected');
            zone.setAttribute('aria-pressed', 'false');
            // Reset all custom styles completely
            zone.style.removeProperty('background');
            zone.style.removeProperty('background-color');
            zone.style.removeProperty('border-color');
            zone.style.removeProperty('color');
            zone.style.removeProperty('outline-color');
            zone.removeAttribute('data-selected-color');
            zone.removeAttribute('data-text-color');
        });

        // Reset feedback bar
        this.feedbackProgress.style.width = '0%';
        this.feedbackProgress.style.removeProperty('background');

        // Set display to dash
        this.selectedDisplay.textContent = '-';
        this.selectedDisplay.style.setProperty('background', '#8E8E93', 'important');
    }

    updateValue(newValue, animate = true) {
        const oldValue = this.value;
        this.value = Math.max(this.min, Math.min(this.max, newValue));

        // Define score colors
        const scoreColors = {
            1: '#ef4444', // Red
            2: '#f97316', // Orange
            3: '#f59e0b', // Amber
            4: '#84cc16', // Lime
            5: '#22c55e', // Green
            6: '#10b981'  // Emerald
        };

        const textColors = {
            1: '#ffffff', // White on red
            2: '#ffffff', // White on orange
            3: '#000000', // Black on amber
            4: '#000000', // Black on lime
            5: '#ffffff', // White on green
            6: '#ffffff'  // White on emerald
        };

        // Update touch zones
        this.touchZones.forEach((zone, index) => {
            const zoneValue = index + 1;
            const isSelected = zoneValue === this.value;

            // Reset all styling first - more comprehensive
            zone.classList.remove('selected');
            zone.setAttribute('aria-pressed', 'false');
            zone.style.removeProperty('background');
            zone.style.removeProperty('background-color');
            zone.style.removeProperty('border-color');
            zone.style.removeProperty('color');
            zone.style.removeProperty('outline-color');
            zone.removeAttribute('data-selected-color');
            zone.removeAttribute('data-text-color');

            // 강제로 애니메이션 비활성화
            zone.style.setProperty('transform', 'none', 'important');
            zone.style.setProperty('scale', '1', 'important');
            zone.style.setProperty('animation', 'none', 'important');
            zone.style.setProperty('transition', 'none', 'important');

            if (isSelected) {
                zone.classList.add('selected');
                zone.setAttribute('aria-pressed', 'true');

                // 선택된 버튼의 글자 색상을 강제로 하얀색으로 설정
                const valueSpan = zone.querySelector('.zone-value');
                const labelSpan = zone.querySelector('.zone-label');
                if (valueSpan) {
                    valueSpan.style.setProperty('color', '#ffffff', 'important');
                    valueSpan.style.setProperty('text-shadow', '0 2px 4px rgba(0,0,0,0.3)', 'important');
                }
                if (labelSpan) {
                    labelSpan.style.setProperty('color', '#ffffff', 'important');
                    labelSpan.style.setProperty('text-shadow', '0 1px 3px rgba(0,0,0,0.25)', 'important');
                    labelSpan.style.setProperty('opacity', '1', 'important');
                }

                // Debug log
                console.log(`Applying colors to zone ${this.value}: bg=${scoreColors[this.value]}, text=${textColors[this.value]}`);

                // Force apply colors with !important and direct values
                zone.style.setProperty('background-color', scoreColors[this.value], 'important');
                zone.style.setProperty('background', scoreColors[this.value], 'important');
                zone.style.setProperty('border-color', scoreColors[this.value], 'important');
                zone.style.setProperty('color', textColors[this.value], 'important');
                zone.style.setProperty('outline-color', scoreColors[this.value], 'important');

                // Also set as attributes for debugging
                zone.setAttribute('data-selected-color', scoreColors[this.value]);
                zone.setAttribute('data-text-color', textColors[this.value]);

                // Verify styles were applied
                console.log('Applied styles:', {
                    background: zone.style.background,
                    backgroundColor: zone.style.backgroundColor,
                    borderColor: zone.style.borderColor,
                    color: zone.style.color
                });

                if (animate) {
                    // 부드러운 시각적 피드백만 제공
                }
            } else {
                // 미선택된 버튼의 글자 색상을 인디고 블루로 설정
                const valueSpan = zone.querySelector('.zone-value');
                const labelSpan = zone.querySelector('.zone-label');
                if (valueSpan) {
                    valueSpan.style.setProperty('color', '#4f46e5', 'important');
                    valueSpan.style.removeProperty('text-shadow');
                }
                if (labelSpan) {
                    labelSpan.style.setProperty('color', '#6366f1', 'important');
                    labelSpan.style.setProperty('opacity', '0.8', 'important');
                    labelSpan.style.removeProperty('text-shadow');
                }
            }
        });

        // Update feedback bar with selected color
        const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
        this.feedbackProgress.style.width = `${percentage}%`;
        this.feedbackProgress.style.setProperty('background', scoreColors[this.value] || '#8E8E93', 'important');

        // Update selected value display
        this.selectedDisplay.textContent = this.value;
        this.selectedDisplay.style.setProperty('background', scoreColors[this.value] || '#8E8E93', 'important');

        if (animate) {
            // 부드러운 시각적 피드백만 제공
        }
    }

    createRippleEffect(e, zone) {
        const ripple = document.createElement('div');
        ripple.className = 'zone-ripple';

        const rect = zone.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (e.clientX || e.touches[0].clientX) - rect.left - size / 2;
        const y = (e.clientY || e.touches[0].clientY) - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        zone.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 300);
    }

    createSelectionFeedback() {
        // Visual feedback for selection
        this.container.style.background = 'rgba(0, 122, 255, 0.05)';
        setTimeout(() => {
            this.container.style.background = '';
        }, 200);
    }

    triggerHapticFeedback(intensity = 'medium') {
        // Use Vibration API if available
        if (navigator.vibrate) {
            const patterns = {
                light: 10,
                medium: 20,
                heavy: 50
            };
            navigator.vibrate(patterns[intensity] || patterns.medium);
        }

        // 부드러운 시각적 피드백만 제공
    }

    handleKeyboardNavigation(e) {
        const currentIndex = this.value - 1;
        let newIndex = currentIndex;

        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                newIndex = Math.max(0, currentIndex - 1);
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                newIndex = Math.min(this.max - 1, currentIndex + 1);
                e.preventDefault();
                break;
            case 'Home':
                newIndex = 0;
                e.preventDefault();
                break;
            case 'End':
                newIndex = this.max - 1;
                e.preventDefault();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
                newIndex = parseInt(e.key) - 1;
                e.preventDefault();
                break;
            default:
                return;
        }

        if (newIndex !== currentIndex) {
            this.selectValue(newIndex + 1);
            this.touchZones[newIndex].focus();
        }
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.updateValue(value, true);
    }


    destroy() {
        // Clean up observers
        if (this.observers) {
            this.observers.forEach(observer => observer.disconnect());
            this.observers = [];
        }

        // Clean up event listeners if needed
        this.container.innerHTML = '';
    }
}

// Mobile Navigation Manager
class MobileNavigationManager {
    constructor() {
        this.isFixedNav = window.innerWidth <= 768;
        this.navElement = null;

        if (this.isFixedNav) {
            this.init();
        }
        this.attachEventListeners();
    }

    init() {
        this.createMobileNavigation();
        this.adjustContentForMobileNav();
    }

    createMobileNavigation() {
        // Only create mobile nav for mobile screens
        if (!this.isFixedNav) {
            console.log('❌ 모바일 네비게이션 생성 안 함: width =', window.innerWidth);
            return;
        }

        // Check if mobile nav already exists
        const existingNav = document.querySelector('.mobile-nav');
        if (existingNav) {
            console.log('⚠️ 모바일 네비게이션 이미 존재 - 기존 요소 재사용');
            this.navElement = existingNav;
            return;
        }

        console.log('✅ 모바일 네비게이션 생성 시작');
        this.navElement = document.createElement('div');
        this.navElement.className = 'mobile-nav';
        this.navElement.innerHTML = `
            <button class="mobile-nav-btn secondary" id="mobileNavPrev" disabled>
                <span>←</span>
                <span>이전</span>
            </button>
            <button class="mobile-nav-btn" id="mobileNavNext" disabled>
                <span>다음</span>
                <span>→</span>
            </button>
        `;

        document.body.appendChild(this.navElement);
        console.log('✅ 모바일 네비게이션 DOM에 추가 완료');

        // Attach navigation events - directly call navigation functions
        document.getElementById('mobileNavPrev').addEventListener('click', () => {
            // 현재 활성화된 섹션 확인
            const activeSection = document.querySelector('.premium-section.active');
            if (!activeSection) return;

            const sectionId = activeSection.id;

            if (sectionId === 'assessment' && typeof window.previousQuestion === 'function') {
                window.previousQuestion();
            } else if (sectionId === 'followership' && typeof window.goBackToAssessment === 'function') {
                window.goBackToAssessment();
            }
        });

        document.getElementById('mobileNavNext').addEventListener('click', (e) => {
            const btn = e.currentTarget;

            console.log('=== 모바일 다음 버튼 클릭 ===');
            console.log('버튼 disabled 상태:', btn.disabled);

            // 버튼이 비활성화되어 있으면 무시
            if (btn.disabled) {
                console.warn('❌ 다음 버튼이 비활성화되어 있습니다');
                return;
            }

            // 현재 활성화된 섹션 확인
            const activeSection = document.querySelector('.premium-section.active');
            console.log('활성 섹션:', activeSection?.id);
            if (!activeSection) return;

            const sectionId = activeSection.id;

            if (sectionId === 'assessment' && typeof window.nextQuestion === 'function') {
                console.log('→ window.nextQuestion() 호출');
                window.nextQuestion();
            } else if (sectionId === 'followership' && typeof window.showResultsPage === 'function') {
                console.log('→ window.showResultsPage() 호출');
                window.showResultsPage();
            } else {
                console.error('❌ 적절한 함수를 찾을 수 없음:', sectionId);
            }
        });
    }

    adjustContentForMobileNav() {
        const content = document.querySelector('.premium-content');
        if (content && this.isFixedNav) {
            content.classList.add('mobile-content-wrapper');
        }
    }

    updateNavigation(canGoPrev, canGoNext, nextText = '다음') {
        // Only update if mobile nav exists (mobile screen)
        if (!this.isFixedNav) return;

        const prevBtn = document.getElementById('mobileNavPrev');
        const nextBtn = document.getElementById('mobileNavNext');

        if (prevBtn) {
            prevBtn.disabled = !canGoPrev;
        }

        if (nextBtn) {
            nextBtn.disabled = !canGoNext;
            nextBtn.innerHTML = `
                <span>${nextText}</span>
                <span>→</span>
            `;
        }
    }

    hide() {
        if (this.navElement) {
            console.log('🙈 모바일 네비게이션 숨김');
            this.navElement.style.display = 'none';
        }
    }

    show() {
        if (this.navElement) {
            console.log('👁️ 모바일 네비게이션 표시');
            this.navElement.style.display = 'flex';
        } else {
            console.log('❌ 모바일 네비게이션 요소 없음');
        }
    }

    attachEventListeners() {
        window.addEventListener('resize', () => {
            const newIsFixedNav = window.innerWidth <= 768;
            if (newIsFixedNav !== this.isFixedNav) {
                this.isFixedNav = newIsFixedNav;

                if (this.isFixedNav && !this.navElement) {
                    // Switch to mobile - create nav
                    this.init();
                } else if (!this.isFixedNav && this.navElement) {
                    // Switch to desktop - remove nav
                    this.destroy();
                }
            }
        });
    }

    destroy() {
        if (this.navElement) {
            this.navElement.remove();
            this.navElement = null;
        }

        const content = document.querySelector('.premium-content');
        if (content) {
            content.classList.remove('mobile-content-wrapper');
        }
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.MobileNativeInput = MobileNativeInput;
    window.MobileNavigationManager = MobileNavigationManager;
}