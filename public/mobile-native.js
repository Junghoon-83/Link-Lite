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
        this.touchZones = this.container.querySelectorAll('.touch-zone');
        this.feedbackProgress = this.container.querySelector('.feedback-progress');
        this.selectedDisplay = this.container.querySelector('.selected-value-display');

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
        return `
            <div class="touch-zone ${isSelected ? 'selected' : ''}"
                 data-value="${value}"
                 tabindex="0"
                 role="button"
                 aria-label="${this.shortLabels[value - 1]}"
                 aria-pressed="${isSelected}">
                <div class="zone-value">${value}</div>
                <div class="zone-label">${this.labels[value - 1]}</div>
            </div>
        `;
    }

    attachEventListeners() {
        this.touchZones.forEach((zone, index) => {
            const value = index + 1;

            // Touch Events
            zone.addEventListener('touchstart', (e) => this.handleTouchStart(e, value), { passive: true });
            zone.addEventListener('touchend', (e) => this.handleTouchEnd(e, value), { passive: true });

            // Mouse Events (for desktop testing)
            zone.addEventListener('mousedown', (e) => this.handleTouchStart(e, value));
            zone.addEventListener('mouseup', (e) => this.handleTouchEnd(e, value));
            zone.addEventListener('click', (e) => this.selectValue(value));

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

    handleTouchStart(e, value) {
        const zone = e.currentTarget;
        this.createRippleEffect(e, zone);
        this.triggerHapticFeedback('light');
    }

    handleTouchEnd(e, value) {
        // Small delay to ensure ripple effect is visible
        setTimeout(() => {
            this.selectValue(value);
        }, 50);
    }

    handleFocus(zone) {
        zone.style.transform = 'scale(1.02)';
    }

    handleBlur(zone) {
        if (!zone.classList.contains('selected')) {
            zone.style.transform = '';
        }
    }

    selectValue(value) {
        if (value === this.value) return; // No change needed

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

            if (isSelected) {
                zone.classList.add('selected');
                zone.setAttribute('aria-pressed', 'true');

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
                    zone.classList.add('haptic-pulse');
                    setTimeout(() => zone.classList.remove('haptic-pulse'), 150);
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
            this.selectedDisplay.classList.add('haptic-pulse');
            setTimeout(() => this.selectedDisplay.classList.remove('haptic-pulse'), 150);
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

        // Fallback visual feedback
        this.container.classList.add('haptic-pulse');
        setTimeout(() => this.container.classList.remove('haptic-pulse'), 150);
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
        if (!this.isFixedNav) return;

        // Check if mobile nav already exists
        if (document.querySelector('.mobile-nav')) return;

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

        // Attach navigation events
        document.getElementById('mobileNavPrev').addEventListener('click', () => {
            document.getElementById('prevBtn')?.click();
        });

        document.getElementById('mobileNavNext').addEventListener('click', () => {
            document.getElementById('nextBtn')?.click();
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