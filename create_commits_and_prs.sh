#!/bin/bash

echo "🚀 Creating commits for each feature branch and then PRs..."

# Function to create a dummy commit on a branch
create_commit_on_branch() {
    local branch=$1
    local commit_message=$2
    local file_to_modify=$3
    
    echo "📝 Creating commit on branch: $branch"
    
    # Switch to branch
    git checkout "$branch"
    
    # Make a small change to the specified file
    echo "// $commit_message" >> "$file_to_modify"
    
    # Commit the change
    git add "$file_to_modify"
    git commit -m "$commit_message"
    
    # Push the branch
    git push origin "$branch"
    
    echo "✅ Commit created and pushed for: $branch"
    echo "---"
}

# Go to main first
git checkout main

# Create commits for each feature branch
create_commit_on_branch "feature/group-layout-and-styling" "feat: improve group layout styling" "src/App.css"
create_commit_on_branch "feature/random-score-generation" "feat: add random score generation" "src/App.jsx"
create_commit_on_branch "feature/simplified-knockout-stage" "feat: simplify knockout stage" "src/App.jsx"
create_commit_on_branch "refactor/component-architecture" "refactor: improve component structure" "src/App.jsx"
create_commit_on_branch "fix/css-conflicts-and-styling" "fix: resolve CSS conflicts" "src/App.css"
create_commit_on_branch "feature/player-profile-modal" "feat: add player profile modal" "src/App.jsx"
create_commit_on_branch "feature/keyboard-shortcuts" "feat: add keyboard shortcuts" "src/App.jsx"

# Go back to main
git checkout main

echo "✅ All commits created! Now running PR creation script..."
echo ""

# Now run the PR creation script
./create_prs_english.sh
