#!/bin/bash
#
# Script to apply the conflict resolution to PR #4
#
# This script will update the copilot/add-backend-boilerplate branch
# with the resolved conflicts from copilot/resolve-merge-conflicts-pr-4
#

set -e  # Exit on error

echo "=========================================="
echo "PR #4 Conflict Resolution Application"
echo "=========================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "Error: Not in a git repository"
    exit 1
fi

echo "Step 1: Fetching latest changes..."
git fetch origin

echo ""
echo "Step 2: Checking out the resolved branch..."
git checkout copilot/resolve-merge-conflicts-pr-4
git pull origin copilot/resolve-merge-conflicts-pr-4

echo ""
echo "Step 3: Getting commit range to apply..."
# Get all commits from this branch that are not in main
COMMITS=$(git log --oneline main..HEAD | wc -l)
echo "Found $COMMITS commits to apply"

echo ""
echo "Step 4: Checking out PR #4 branch..."
git checkout copilot/add-backend-boilerplate || {
    echo "Warning: Local branch doesn't exist, creating from remote..."
    git checkout -b copilot/add-backend-boilerplate origin/copilot/add-backend-boilerplate
}

echo ""
echo "Step 5: Resetting to main..."
git reset --hard origin/main

echo ""
echo "Step 6: Cherry-picking resolved commits..."
# Get the list of commit SHAs (excluding the merge commit)
git checkout copilot/resolve-merge-conflicts-pr-4
FIRST_COMMIT=$(git log --oneline main..HEAD --reverse | head -1 | awk '{print $1}')
LAST_COMMIT=$(git log --oneline main..HEAD | head -1 | awk '{print $1}')

git checkout copilot/add-backend-boilerplate
echo "Cherry-picking from $FIRST_COMMIT to $LAST_COMMIT..."

# Cherry-pick all commits
if git cherry-pick ${FIRST_COMMIT}^..${LAST_COMMIT}; then
    echo "✅ All commits applied successfully"
else
    echo "❌ Error during cherry-pick. You may need to resolve conflicts manually."
    echo "After resolving, run: git cherry-pick --continue"
    exit 1
fi

echo ""
echo "Step 7: Verifying resolution..."
echo "Checking for conflict markers..."
if grep -r "<<<<<<< HEAD" . --include="*.js" --include="*.json" --include="*.md" --include="*.jsx" 2>/dev/null; then
    echo "❌ Conflict markers found! Please review."
    exit 1
else
    echo "✅ No conflict markers found"
fi

echo ""
echo "Step 8: Checking file counts..."
git diff origin/main --stat | tail -5

echo ""
echo "=========================================="
echo "Resolution Applied Successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review the changes: git log -p origin/main..HEAD"
echo "2. Verify locally: run tests, check builds"
echo "3. Push to update PR #4: git push --force-with-lease origin copilot/add-backend-boilerplate"
echo ""
echo "⚠️  WARNING: This will force push and rewrite PR #4 history"
echo "Make sure you're ready before pushing!"
