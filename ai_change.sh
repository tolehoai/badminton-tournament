#!/bin/bash

# Quick AI Change Script
# Usage: ./ai_change.sh "description of changes"

DESCRIPTION="${1:-AI-assisted code changes}"

echo "🤖 Processing AI code changes..."
echo "Description: $DESCRIPTION"
echo ""

# Run the automated workflow
./auto_pr_workflow.sh "feat: $DESCRIPTION" "$DESCRIPTION" true
