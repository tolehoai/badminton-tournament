#!/bin/bash

# Simple AI Change Script (without GitHub CLI dependency)
# Usage: ./simple_ai_change.sh "description of changes"

DESCRIPTION="${1:-AI-assisted code changes}"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BRANCH_NAME="feature/ai-change-$(echo "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')-$TIMESTAMP"

echo "🤖 Processing AI code changes..."
echo "Description: $DESCRIPTION"
echo "Branch: $BRANCH_NAME"
echo ""

# Check if we have changes
if git diff --quiet && git diff --staged --quiet; then
    echo "❌ No changes detected. Please make code changes first."
    exit 1
fi

# Create and switch to new branch
echo "🌿 Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Add and commit changes
echo "💾 Committing changes..."
git add .
git commit -m "feat: $DESCRIPTION

AI-assisted code changes
Generated at: $(date)
Branch: $BRANCH_NAME"

# Push branch
echo "🚀 Pushing to GitHub..."
git push origin "$BRANCH_NAME"

# Show GitHub PR creation URL
REPO_URL=$(git remote get-url origin | sed 's/\.git$//' | sed 's/git@github\.com:/https:\/\/github.com\//')
PR_URL="$REPO_URL/compare/main...$BRANCH_NAME?quick_pull=1"

echo ""
echo "✅ Changes pushed successfully!"
echo "🔗 Create PR manually: $PR_URL"
echo ""
echo "📋 Or create PR with this command:"
echo "gh pr create --title 'feat: $DESCRIPTION' --body 'AI-assisted code changes' --base main --head $BRANCH_NAME"
echo ""
echo "🔄 To merge and cleanup:"
echo "git checkout main && git pull origin main && git branch -d $BRANCH_NAME"
