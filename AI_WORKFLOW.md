# 🤖 AI Code Change Automation Workflow

## Overview

This repository includes an automated workflow that creates Pull Requests and auto-merges them when you request AI code changes. The system is designed to streamline the development process while maintaining proper Git workflow practices.

## 🚀 Quick Start

### Super Simple Method
```bash
./ai_change.sh "Add dark mode toggle"
```

### Advanced Method
```bash
./auto_pr_workflow.sh "feat: Add user authentication" "Implemented JWT-based authentication system" true
```

## 📋 Available Scripts

### 1. `ai_change.sh` (Recommended)
**Quick and simple AI change automation**

```bash
./ai_change.sh "description of your changes"
```

**Examples:**
```bash
./ai_change.sh "Fix mobile responsive issues"
./ai_change.sh "Add search functionality"
./ai_change.sh "Improve performance"
```

### 2. `auto_pr_workflow.sh` (Advanced)
**Full-featured automation with more control**

```bash
./auto_pr_workflow.sh "commit message" "detailed description" [auto_merge]
```

**Parameters:**
- `commit_message`: The commit message and PR title
- `description`: Detailed description of changes
- `auto_merge`: `true` (default) or `false`

**Examples:**
```bash
# Auto-merge enabled (default)
./auto_pr_workflow.sh "feat: Add dark mode" "Implemented dark mode with toggle button"

# Create draft PR (no auto-merge)
./auto_pr_workflow.sh "fix: navbar bug" "Fixed responsive navbar issue" false

# Quick shortcuts
./auto_pr_workflow.sh quick "Quick fix for mobile layout"
./auto_pr_workflow.sh draft "Experimental feature - needs review"
```

## 🔄 Workflow Process

When you run the automation:

1. **📋 Prerequisites Check**
   - Verifies Git repository
   - Checks GitHub CLI installation
   - Ensures authentication

2. **🌿 Branch Creation**
   - Generates unique branch name with timestamp
   - Creates and switches to new branch
   - Syncs with latest main branch

3. **💾 Commit Changes**
   - Adds all current changes
   - Creates detailed commit message
   - Includes metadata and timestamp

4. **🚀 Push & PR Creation**
   - Pushes branch to GitHub
   - Creates Pull Request with detailed description
   - Sets up auto-merge (if enabled)

5. **✅ Auto-Merge**
   - Automatically merges when ready
   - Deletes remote branch
   - Updates local main branch

## 🎯 Use Cases

### Perfect for:
- ✅ AI-assisted code improvements
- ✅ Quick bug fixes
- ✅ Feature additions from AI suggestions
- ✅ Automated refactoring
- ✅ Documentation updates

### Not recommended for:
- ❌ Breaking changes requiring review
- ❌ Security-critical modifications
- ❌ Major architectural changes
- ❌ Changes affecting multiple developers

## 🛡️ Safety Features

### Automatic Checks
- Validates Git repository state
- Ensures clean working directory
- Verifies GitHub authentication
- Checks for changes before committing

### Branch Management
- Creates unique branch names with timestamps
- Automatic cleanup of merged branches
- Safe fallback to main branch

### Error Handling
- Graceful error recovery
- Detailed error messages
- Automatic cleanup on failure

## ⚙️ Configuration

### Default Settings
```bash
REPO="tolehoai/badminton-tournament"
BASE_BRANCH="main"
DEFAULT_BRANCH_PREFIX="feature/ai-change"
DEFAULT_COMMIT_PREFIX="feat: AI-assisted"
```

### Customization
Edit `auto_pr_workflow.sh` to modify:
- Branch naming patterns
- Commit message formats
- PR templates
- Auto-merge behavior

## 🔧 Setup Requirements

### Prerequisites
1. **Git repository** initialized
2. **GitHub CLI** installed and authenticated
3. **Repository permissions** to create branches and PRs

### Installation
```bash
# Make scripts executable
chmod +x ai_change.sh
chmod +x auto_pr_workflow.sh

# Authenticate with GitHub (if not already done)
gh auth login
```

## 📖 Examples

### Scenario 1: Quick AI Fix
```bash
# You made some AI-suggested improvements
./ai_change.sh "Improve button hover effects"
# ✅ Auto-creates PR and merges
```

### Scenario 2: Feature Addition
```bash
# Added a new feature with AI help
./auto_pr_workflow.sh "feat: Add user search" "Implemented search functionality with filters and sorting"
# ✅ Auto-creates PR and merges
```

### Scenario 3: Draft Review Needed
```bash
# Experimental changes that need review
./auto_pr_workflow.sh "experiment: new algorithm" "Testing new sorting algorithm for performance" false
# ✅ Creates draft PR for manual review
```

## 🎨 GitHub Actions Integration

The repository includes a GitHub Actions workflow (`.github/workflows/auto-merge.yml`) that:
- Automatically detects AI-generated PRs
- Auto-approves them
- Enables auto-merge for qualifying PRs

## 🚨 Important Notes

### Best Practices
1. **Review changes locally** before running automation
2. **Use descriptive commit messages** for better tracking
3. **Test critical changes** in draft mode first
4. **Keep commits focused** on single features/fixes

### Limitations
- Requires GitHub CLI authentication
- Only works with repositories you have write access to
- Auto-merge may be delayed by required status checks
- Large changes may need manual review

## 🆘 Troubleshooting

### Common Issues

**"GitHub CLI not authenticated"**
```bash
gh auth login
```

**"No changes to commit"**
- Make sure you have modified files
- Check if changes are staged: `git status`

**"Branch already exists"**
- The script generates unique branch names with timestamps
- If this occurs, try running again

**"PR creation failed"**
- Check repository permissions
- Verify GitHub CLI authentication
- Ensure base branch exists

### Getting Help
```bash
./auto_pr_workflow.sh help
```

## 🔮 Future Enhancements

- Integration with AI coding assistants
- Automated testing before merge
- Slack/Discord notifications
- Custom PR templates per change type
- Rollback functionality
- Batch processing for multiple changes

---

**Happy Coding with AI! 🤖✨**
