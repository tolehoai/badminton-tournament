#!/bin/bash

# Script để tạo các PR cho từng feature

echo "🚀 Bắt đầu tạo các Pull Requests..."

# 1. Fix TypeErrors và Logic Improvements
echo "📝 Tạo PR 1: Fix TypeErrors và Logic Improvements"
git checkout -b fix/type-errors-and-logic-improvements
git add .
git commit -m "fix: resolve TypeError issues and improve tournament logic

- Fix 'Cannot read properties of undefined' errors in multiple functions
- Add comprehensive null/array checks across the application
- Update tournament rules to 16 players, 4 groups format
- Improve player management logic with proper state updates
- Add robust error handling for data operations
- Fix bracket logic inconsistencies

Files changed:
- src/App.jsx: Added null checks and improved logic
- src/utils/helpers.js: Enhanced error handling
- src/constants/data.js: Updated tournament rules"

git push origin fix/type-errors-and-logic-improvements

# 2. Group Layout và Styling
echo "📝 Tạo PR 2: Group Layout và Styling"
git checkout main
git checkout -b feature/group-layout-and-styling
git add .
git commit -m "feat: improve group layout and styling

- Change layout from 4 columns to 2x2 grid layout
- Add distinct styling for each group (A, B, C, D)
- Implement responsive design with media queries
- Add group labels with colored borders
- Fix CSS spacing and visual hierarchy
- Improve overall visual consistency

Files changed:
- src/App.css: Updated grid layout and group styling
- src/components/Group.jsx: Enhanced group structure"

git push origin feature/group-layout-and-styling

# 3. Random Score Generation
echo "📝 Tạo PR 3: Random Score Generation"
git checkout main
git checkout -b feature/random-score-generation
git add .
git commit -m "feat: add random score generation functionality

- Add button to generate random scores for group stage matches
- Add button to generate random scores for knockout stage matches
- Implement scoring rules (15 points for group, 21 for knockout)
- Integrate random score generation into settings menu
- Add proper validation for score generation
- Improve user experience with automated scoring

Files changed:
- src/App.jsx: Added random score generation functions
- src/components/Settings.jsx: Integrated score generation buttons"

git push origin feature/random-score-generation

# 4. Simplified Knockout Stage
echo "📝 Tạo PR 4: Simplified Knockout Stage"
git checkout main
git checkout -b feature/simplified-knockout-stage
git add .
git commit -m "feat: simplify knockout stage structure

- Remove quarter-finals stage completely
- Only top player from each group advances to semifinals
- Update progression logic (A1, B1, C1, D1)
- Simplify bracket structure and labels
- Improve tournament flow efficiency
- Update JSX structure for cleaner code

Files changed:
- src/App.jsx: Simplified knockout stage logic
- src/components/KnockoutStage.jsx: Updated bracket structure"

git push origin feature/simplified-knockout-stage

# 5. Component Architecture Refactor
echo "📝 Tạo PR 5: Component Architecture Refactor"
git checkout main
git checkout -b refactor/component-architecture
git add .
git commit -m "refactor: restructure code into component-based architecture

- Split monolithic App.jsx into smaller, focused components
- Create dedicated files for constants, utilities, and hooks
- Improve code maintainability and reusability
- Organize code structure for better development experience
- Separate concerns and improve component isolation
- Add proper TypeScript-like structure for better organization

Files changed:
- src/components/: Created new component files
- src/constants/data.js: Centralized data constants
- src/utils/helpers.js: Utility functions
- src/hooks/useLocalStorage.js: Custom hook
- src/App.jsx: Simplified main component"

git push origin refactor/component-architecture

# 6. CSS Conflicts và Styling Fixes
echo "📝 Tạo PR 6: CSS Conflicts và Styling Fixes"
git checkout main
git checkout -b fix/css-conflicts-and-styling
git add .
git commit -m "fix: resolve CSS conflicts and improve styling

- Fix modal styling conflicts after refactoring
- Add comprehensive CSS for all new components
- Improve responsive design across all screen sizes
- Fix linter errors and code quality issues
- Add proper styling for new UI elements
- Ensure consistent visual design

Files changed:
- src/App.css: Fixed conflicts and added new styles
- src/components/PlayerModals.jsx: Updated CSS classes
- Various component files: Improved styling"

git push origin fix/css-conflicts-and-styling

# 7. Player Profile Modal
echo "📝 Tạo PR 7: Player Profile Modal"
git checkout main
git checkout -b feature/player-profile-modal
git add .
git commit -m "feat: add player profile modal with detailed statistics

- Create PlayerProfile component for detailed player information
- Add click handlers for ranking cards and player cards
- Display comprehensive player statistics (matches, wins, losses, win rate)
- Implement modal with proper styling and animations
- Add avatar handling with fallback images
- Improve user interaction and information display

Files changed:
- src/components/PlayerProfile.jsx: New component
- src/components/Group.jsx: Added click handlers
- src/App.jsx: Integrated player profile functionality
- src/App.css: Added modal styling
- src/constants/data.js: Added new text constants"

git push origin feature/player-profile-modal

# 8. Keyboard Shortcuts
echo "📝 Tạo PR 8: Keyboard Shortcuts"
git checkout main
git checkout -b feature/keyboard-shortcuts
git add .
git commit -m "feat: add keyboard shortcuts for better user experience

- Add ESC key functionality to close modals
- Implement click outside to close modal functionality
- Add close button for better accessibility
- Improve modal header design with close button
- Enhance user experience with keyboard navigation
- Add proper event handling and cleanup

Files changed:
- src/components/PlayerProfile.jsx: Added ESC key and click outside
- src/components/PlayerModals.jsx: Added ESC key functionality
- src/App.css: Added modal header and close button styles"

git push origin feature/keyboard-shortcuts

echo "✅ Hoàn thành tạo tất cả Pull Requests!"
echo "📋 Danh sách các branch đã tạo:"
echo "1. fix/type-errors-and-logic-improvements"
echo "2. feature/group-layout-and-styling"
echo "3. feature/random-score-generation"
echo "4. feature/simplified-knockout-stage"
echo "5. refactor/component-architecture"
echo "6. fix/css-conflicts-and-styling"
echo "7. feature/player-profile-modal"
echo "8. feature/keyboard-shortcuts"
echo ""
echo "🎯 Bước tiếp theo:"
echo "1. Tạo repository trên GitHub"
echo "2. Push main branch: git push -u origin main"
echo "3. Tạo Pull Request cho từng branch trên GitHub"
echo "4. Sử dụng description từ PR_GUIDE.md"
