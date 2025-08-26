#!/bin/bash

# Script to automatically create Pull Requests with GitHub CLI
# Requirements: GitHub CLI (gh) must be installed and authenticated

echo "🚀 Starting automatic Pull Request creation..."

# Check GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "📥 Install: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Not logged in to GitHub CLI"
    echo "🔐 Run: gh auth login"
    exit 1
fi

# Repository info
REPO="tolehoai/badminton-tournament"
BASE_BRANCH="main"

# Function to create PR
create_pr() {
    local branch=$1
    local title=$2
    local description=$3
    
    echo "📝 Creating PR: $title"
    
    # Create PR with GitHub CLI
    gh pr create \
        --repo "$REPO" \
        --base "$BASE_BRANCH" \
        --head "$branch" \
        --title "$title" \
        --body "$description" \
        --draft
    
    if [ $? -eq 0 ]; then
        echo "✅ PR created successfully: $title"
    else
        echo "❌ Error creating PR: $title"
    fi
    
    echo "---"
}

# PR 1: Fix TypeErrors
PR1_TITLE="fix: resolve TypeError issues and improve tournament logic"
PR1_DESC="## 🎯 Objective
Fix TypeError issues and improve tournament application logic

## ✨ New Features
- Add comprehensive null/array checks
- Improve error handling
- Fix tournament rules logic

## 🔧 Bug Fixes
- Fix 'Cannot read properties of undefined' errors in multiple functions
- Fix bracket logic inconsistencies
- Improve player management logic

## 📁 Files Changed
- \`src/App.jsx\`: Added null checks and improved logic
- \`src/utils/helpers.js\`: Enhanced error handling
- \`src/constants/data.js\`: Updated tournament rules

## 🧪 Testing
- [x] Test null checks
- [x] Test array operations
- [x] Test player management"

create_pr "fix/type-errors-and-logic-improvements" "$PR1_TITLE" "$PR1_DESC"

# PR 2: Group Layout
PR2_TITLE="feat: improve group layout and styling"
PR2_DESC="## 🎯 Mục tiêu
Cải thiện layout và styling cho 4 groups

## ✨ Tính năng mới
- Layout 2x2 grid thay vì 4 columns
- Distinct styling cho từng group (A, B, C, D)
- Responsive design với media queries

## 🔧 Sửa lỗi
- Fix CSS spacing issues
- Cải thiện visual hierarchy
- Sửa right-side gap

## 📁 Files thay đổi
- \`src/App.css\`: Updated grid layout and group styling
- \`src/components/Group.jsx\`: Enhanced group structure

## 🧪 Testing
- [x] Test responsive design
- [x] Test group layout
- [x] Test visual consistency"

create_pr "feature/group-layout-and-styling" "$PR2_TITLE" "$PR2_DESC"

# PR 3: Random Score Generation
PR3_TITLE="feat: add random score generation functionality"
PR3_DESC="## 🎯 Mục tiêu
Thêm tính năng tự động điền điểm ngẫu nhiên

## ✨ Tính năng mới
- Button generate random scores cho group stage
- Button generate random scores cho knockout stage
- Scoring rules (15 points cho group, 21 cho knockout)

## 🔧 Sửa lỗi
- Tích hợp vào settings menu
- Validation cho score generation

## 📁 Files thay đổi
- \`src/App.jsx\`: Added random score generation functions
- \`src/components/Settings.jsx\`: Integrated score generation buttons

## 🧪 Testing
- [x] Test group stage scoring
- [x] Test knockout stage scoring
- [x] Test scoring rules"

create_pr "feature/random-score-generation" "$PR3_TITLE" "$PR3_DESC"

# PR 4: Simplified Knockout
PR4_TITLE="feat: simplify knockout stage structure"
PR4_DESC="## 🎯 Mục tiêu
Đơn giản hóa knockout stage

## ✨ Tính năng mới
- Loại bỏ quarter-finals stage
- Chỉ top player từ mỗi group vào semifinals
- Progression logic (A1, B1, C1, D1)

## 🔧 Sửa lỗi
- Simplify bracket structure
- Update labels và JSX structure

## 📁 Files thay đổi
- \`src/App.jsx\`: Simplified knockout stage logic
- \`src/components/KnockoutStage.jsx\`: Updated bracket structure

## 🧪 Testing
- [x] Test progression logic
- [x] Test bracket structure
- [x] Test labels"

create_pr "feature/simplified-knockout-stage" "$PR4_TITLE" "$PR4_DESC"

# PR 5: Component Architecture
PR5_TITLE="refactor: restructure code into component-based architecture"
PR5_DESC="## 🎯 Mục tiêu
Refactor code thành component-based architecture

## ✨ Tính năng mới
- Split monolithic App.jsx thành components
- Tạo constants, utils, hooks files
- Improve maintainability và reusability

## 🔧 Sửa lỗi
- Organize code structure
- Separate concerns

## 📁 Files thay đổi
- \`src/components/\`: Created new component files
- \`src/constants/data.js\`: Centralized data constants
- \`src/utils/helpers.js\`: Utility functions
- \`src/hooks/useLocalStorage.js\`: Custom hook
- \`src/App.jsx\`: Simplified main component

## 🧪 Testing
- [x] Test component isolation
- [x] Test code organization
- [x] Test maintainability"

create_pr "refactor/component-architecture" "$PR5_TITLE" "$PR5_DESC"

# PR 6: CSS Fixes
PR6_TITLE="fix: resolve CSS conflicts and improve styling"
PR6_DESC="## 🎯 Mục tiêu
Sửa CSS conflicts sau refactoring

## ✨ Tính năng mới
- Fix modal styling conflicts
- Add CSS cho tất cả components mới
- Improve responsive design

## 🔧 Sửa lỗi
- Fix linter errors
- Resolve CSS conflicts
- Ensure consistent styling

## 📁 Files thay đổi
- \`src/App.css\`: Fixed conflicts and added new styles
- \`src/components/PlayerModals.jsx\`: Updated CSS classes
- Various component files: Improved styling

## 🧪 Testing
- [x] Test modal styling
- [x] Test responsive design
- [x] Test visual consistency"

create_pr "fix/css-conflicts-and-styling" "$PR6_TITLE" "$PR6_DESC"

# PR 7: Player Profile
PR7_TITLE="feat: add player profile modal with detailed statistics"
PR7_DESC="## 🎯 Mục tiêu
Thêm modal thông tin chi tiết VĐV

## ✨ Tính năng mới
- PlayerProfile component với detailed statistics
- Click handlers cho ranking cards và player cards
- Avatar handling với fallback images

## 🔧 Sửa lỗi
- Modal styling và animations
- Avatar error handling

## 📁 Files thay đổi
- \`src/components/PlayerProfile.jsx\`: New component
- \`src/components/Group.jsx\`: Added click handlers
- \`src/App.jsx\`: Integrated player profile functionality
- \`src/App.css\`: Added modal styling
- \`src/constants/data.js\`: Added new text constants

## 🧪 Testing
- [x] Test click handlers
- [x] Test modal functionality
- [x] Test avatar handling"

create_pr "feature/player-profile-modal" "$PR7_TITLE" "$PR7_DESC"

# PR 8: Keyboard Shortcuts
PR8_TITLE="feat: add keyboard shortcuts for better user experience"
PR8_DESC="## 🎯 Mục tiêu
Thêm keyboard shortcuts cho modals

## ✨ Tính năng mới
- ESC key để đóng modal
- Click outside để đóng modal
- Close button cho accessibility

## 🔧 Sửa lỗi
- Improve modal header design
- Enhance user experience

## 📁 Files thay đổi
- \`src/components/PlayerProfile.jsx\`: Added ESC key and click outside
- \`src/components/PlayerModals.jsx\`: Added ESC key functionality
- \`src/App.css\`: Added modal header and close button styles

## 🧪 Testing
- [x] Test ESC key functionality
- [x] Test click outside
- [x] Test close button"

create_pr "feature/keyboard-shortcuts" "$PR8_TITLE" "$PR8_DESC"

echo "✅ Completed creating all Pull Requests!"
echo ""
echo "📋 List of created PRs:"
echo "1. fix/type-errors-and-logic-improvements"
echo "2. feature/group-layout-and-styling"
echo "3. feature/random-score-generation"
echo "4. feature/simplified-knockout-stage"
echo "5. refactor/component-architecture"
echo "6. fix/css-conflicts-and-styling"
echo "7. feature/player-profile-modal"
echo "8. feature/keyboard-shortcuts"
echo ""
echo "🔗 View all PRs at: https://github.com/tolehoai/badminton-tournament/pulls"
echo ""
echo "🎯 Next steps:"
echo "1. Review each PR"
echo "2. Merge in order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8"
echo "3. Cleanup branches after merge"
