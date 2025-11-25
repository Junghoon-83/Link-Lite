# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Link-Lite** is a Korean leadership assessment web application using the **SIG model** (Sharing & Participation, Interaction, Growth). Users answer 23 Likert-scale questions to determine one of 8 leadership types, then analyze compatibility with 5 followership types for team insights.

## Development Commands

### Local Development
```bash
# Start local server
python3 -m http.server 8000 --directory public
# OR
npm run dev

# Access at http://localhost:8000
```

### Testing
```bash
# Run manual verification tests (no automated test framework)
node test-all-types.js        # Tests all 8 leadership type calculations
node test-verification.js     # Tests scoring logic and radar coordinates
```

### Deployment
- **Production**: https://link-lite.netlify.app/
- Deployment is automatic via Netlify on push to `main`
- No build step required (vanilla JS/HTML/CSS)

## Architecture & Data Flow

### Assessment Flow
```
Welcome → Assessment (23 questions) → Followership Selection → Results
```

1. **Welcome**: User initiates assessment
2. **Assessment**: 23 questions across 3 dimensions (6-point Likert scale)
3. **Followership**: Select team members' followership types (multiple allowed)
4. **Results**: Leadership type, radar chart, compatibility matrix

### Core Modules (public/)

| File | Lines | Purpose |
|------|-------|---------|
| `app-controller.js` | 1,261 | Central state management, lifecycle orchestration |
| `leadership-assessment.js` | ~200 | Question management, scoring, type determination |
| `team-compatibility.js` | ~130 | Compatibility analysis with 5 followership types |
| `mobile-native.js` | 788 | Touch-optimized input UI, mobile navigation |
| `storage-manager.js` | 391 | LocalStorage with versioning, session recovery |
| `analytics-manager.js` | ~200 | Google Analytics 4 integration |

### Data Models (public/data/)

```
questions.json           # 23 questions with category, upperFactor, lowerFactor
leadership-types.json    # 8 types with strengths[], cautions[], descriptions
followership-types.json  # 5 types (driver, doer, supporter, thinker, follower)
compatibility-matrix.json # 8×5 grid: leadership × followership → {strength, caution}
```

## Leadership Type Calculation

### SIG Model Dimensions
- **Sharing (공유및참여)**: 6 questions - goal/progress sharing, opinion reflection
- **Interaction (상호작용)**: 8 questions - emotional care, problem-solving, openness
- **Growth (성장촉진)**: 9 questions - failure learning, challenge encouragement, autonomy

### Type Determination Algorithm
```javascript
// Threshold: 4.5
const typeCode = [
    avgScores.sharing >= 4.5 ? 'H' : 'L',      // High/Low
    avgScores.interaction >= 4.5 ? 'H' : 'L',
    avgScores.growth >= 4.5 ? 'H' : 'L'
].join('');  // Results in 'HHH', 'HHL', 'HLH', 'HLL', 'LHH', 'LHL', 'LLH', 'LLL'
```

### 8 Leadership Types
- **HHH**: Participatory Coaching (참여코칭형) - Ideal balanced leader
- **HHL**: Participatory Intimacy (참여친밀형) - Strong in sharing/interaction
- **HLH**: Participatory Vision (참여비전형) - Clear direction, growth focus
- **HLL**: Participatory Operations (참여실무형) - Process-focused
- **LHH**: Individual Coaching (개별코칭형) - 1:1 development focus
- **LHL**: Individual Intimacy (개별친밀형) - 1:1 trust-focused
- **LLH**: Individual Vision (개별비전형) - Potential-focused
- **LLL**: Transitional (과도기형) - All areas need development

## State Management (AppController)

### Central State Object
```javascript
this.state = {
    currentQuestion: number,                   // Question index (0-22)
    selectedFollowers: [{id, memberName}],     // Multiple selections allowed
    currentSection: 'welcome'|'assessment'|'followership'|'results',
    currentLeadershipCode: 'HHH'|'HHL'|...|'LLL',
    isInitialized: boolean
};
```

### Initialization Sequence
```javascript
// 1. Parallel data loading
await Promise.all([
    assessment.init(),          // Load questions.json, leadership-types.json
    teamCompatibility.init()    // Load followership-types.json, compatibility-matrix.json
]);

// 2. Setup event listeners & mobile navigation
setupEventListeners();
if (window.innerWidth <= 768) {
    ui.mobileNav = new MobileNavigationManager();
}

// 3. Attempt session recovery (if user refreshed mid-assessment)
await tryRestoreSession();
```

## Mobile-First UI Patterns

### Responsive Breakpoint
- **Desktop**: ≥769px - Top navigation visible, scrollable content
- **Mobile**: ≤768px - Top nav hidden, floating bottom nav (prev/next buttons)

### Mobile-Native Input System
- **6 color-coded buttons**: Red (1) → Green (6) with gradient backgrounds
- **Auto-advance**: 300ms delay after selection, automatically moves to next question
- **Touch optimization**: Hover preview disabled on touch devices
- **Keyboard support**: Arrow keys, Enter/Space
- **Style protection**: MutationObserver prevents accidental style changes

### CSS Versioning Strategy
```html
<!-- Cache busting via query params -->
<link rel="stylesheet" href="mobile-native.css?v=1764003976">
<script src="app-controller.js?v=6"></script>
```
Increment version number when CSS/JS files are modified to force browser reload.

## Storage & Session Management

### LocalStorage Keys
- **`linkLite_currentSession`**: Active assessment (24-hour expiry)
  - `questionIndex`, `responses`, `startTime`, `sessionId`
- **`linkLite_resultsHistory`**: Completed assessments (max 3, 30-day expiry)
  - `timestamp`, `leadershipType`, `scores`, `followers`
- **`linkLite_appVersion`**: Version tracking for data migration

### Session Recovery
On page load, `StorageManager.getCurrentSession()` checks for:
1. Valid session (not expired, has responses)
2. Matching app version
3. Restores question index and previous responses

## Analytics Tracking (GA4)

### Custom Events
```javascript
trackPageView(sectionId)                      // welcome, assessment, followership, results
trackAssessmentStart()                        // User begins 23 questions
trackQuestionAnswer(index, category, score)   // Per-question tracking
trackAssessmentComplete(type, timeSpent)      // Leadership type result (conversion)
trackFollowershipSelection(followerTypes)     // Team member selections
trackError(message, errorMsg)                 // Error tracking
```

## Common Development Tasks

### Adding a New Question
1. Edit `public/data/questions.json`
2. Add question object with: `{id, category, upperFactor, lowerFactor, text}`
3. Ensure `category` is one of: `'sharing'`, `'interaction'`, `'growth'`
4. Update total question count in `LeadershipAssessment.getTotalQuestions()`

### Modifying Leadership Type Descriptions
1. Edit `public/data/leadership-types.json`
2. Update `strengths[]`, `cautions[]`, or `description` for specific type code (e.g., `'HHH'`)
3. Changes reflect immediately (no rebuild needed)

### Adjusting Compatibility Matrix
1. Edit `public/data/compatibility-matrix.json`
2. Structure: `{leadershipType: {followershipType: {strength, caution}}}`
3. Example: `"HHH": {"driver": {"strength": "...", "caution": "..."}}`

### Changing Score Threshold
Currently hardcoded to **4.5** in:
- `public/leadership-assessment.js` → `determineLeadershipType()` method
- `test-all-types.js` and `test-verification.js` (for validation)

To change threshold, update all three files and re-run tests.

### CSS Architecture
- **`premium-style.css`**: Main app layout, radar chart (SVG), glass-morphism cards
- **`mobile-native.css`**: Touch button styling, mobile navigation styles
- **`mobile-font-system.css`**: Responsive typography (16-18px base on mobile)

Important: Avoid excessive use of `!important` (see `IMPROVEMENT_PLAN.md` for refactoring roadmap).

## Radar Chart Implementation

### SVG Generation
```javascript
// Polar to Cartesian coordinate conversion
const center = 200;
const maxRadius = 160;
const angles = {
    sharing: -Math.PI / 2,      // -90° (top)
    interaction: Math.PI / 6,    // 30° (bottom-right)
    growth: 5 * Math.PI / 6      // 150° (bottom-left)
};

// Score to radius mapping (1-6 scale → 0-160px)
const radius = ((score - 1) / 5) * maxRadius;
const x = center + radius * Math.cos(angle);
const y = center + radius * Math.sin(angle);
```

### Reset Function
When navigating between results, always call `_resetRadarChart()` to clear previous SVG state before rendering new data (prevents cache issues).

## Known Gotchas

### 1. Auto-Advance Timing
Mobile input has 300ms `setTimeout` before advancing to next question. If users tap rapidly, responses might be lost. The delay balances UX smoothness with responsiveness.

### 2. Feedback Bar Calculation
Changed from `((value - min) / (max - min))` to `(value / max)`:
- Old: 1 point = 0%, 6 points = 100%
- New: 1 point = 16.67%, 6 points = 100%

Ensure visual feedback matches actual score range.

### 3. Hover Preview on Touch Devices
`MobileNativeInput` detects touch devices via `touchstart` event. Once detected, `mouseenter/mouseleave` hover previews are disabled to prevent conflicting UI states.

### 4. Previous Score Display
Uses `defaultValue: currentResponse` in `app-controller.js` to display selected scores when navigating back. Relies on `mobile-native.js` `updateValue()` method to apply colors.

### 5. SVG Icon Display
Direct inline SVG is used instead of Lucide CDN to avoid async loading issues. Icons are embedded directly in `index.html` for immediate rendering.

## File Structure Explained

```
Link-Lite/
├── src/                    # Original source (reference/backup)
├── public/                 # Production deployment (all edits here)
│   ├── index.html          # Single-page application (SPA) structure
│   ├── app-controller.js   # Central orchestrator (DO NOT SPLIT - cohesive state)
│   ├── mobile-native.js    # UI components (MobileNativeInput, MobileNavigationManager)
│   ├── *-manager.js        # Specialized managers (storage, analytics)
│   ├── *.css               # Styles (premium, mobile-native, mobile-font-system)
│   └── data/*.json         # Static data (questions, types, compatibility)
├── test-*.js               # Manual verification scripts
└── IMPROVEMENT_PLAN.md     # Refactoring roadmap (3 stages)
```

## Security Considerations

- **CSP Headers**: Content Security Policy restricts script/style origins
- **Input Validation**: Score range (1-6), question ID checks
- **Session Expiry**: 24-hour active sessions, 30-day history retention
- **XSS Prevention**: All user inputs (team member names) are sanitized via `SecurityUtils.sanitizeInput()`

## Gemini CLI Integration

When analyzing large codebases or multiple files that exceed context limits, use Gemini CLI:

```bash
# Analyze entire codebase
gemini -p "@public/ Summarize the architecture"

# Check specific implementations
gemini -p "@public/app-controller.js @public/mobile-native.js How does mobile navigation work?"

# Verify features across files
gemini -p "@public/ @data/ Is session recovery implemented?"
```

Use `@<path>` syntax to include files/directories. Paths are relative to current working directory.
