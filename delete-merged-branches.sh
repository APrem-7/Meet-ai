#!/bin/bash

# Script to delete merged branches from GitHub repository
# Run this script if you have push permissions to the repository

set -e

echo "================================"
echo "Delete Merged Branches Script"
echo "================================"
echo ""
echo "This script will delete the following merged branches:"
echo ""

# List of branches to delete (all merged into main)
BRANCHES_TO_DELETE=(
    "BetterAuth"
    "AuthUI-SignUp"
    "AuthUI-Socials-Callbacks"
    "AuthUI-Socials"
    "AuthUI"
    "Dashboard-Navbar"
    "Dashboard"
    "Backend"
    "Agents"
    "new-Backend"
    "windsurf-changes"
    "windsurf-changes-v2"
)

# Display branches
for branch in "${BRANCHES_TO_DELETE[@]}"; do
    echo "  - $branch"
done

echo ""
read -p "Do you want to continue? (yes/no): " response

if [[ "$response" != "yes" ]]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "Deleting branches..."
echo ""

SUCCESS_COUNT=0
FAILED_COUNT=0

for branch in "${BRANCHES_TO_DELETE[@]}"; do
    echo "Deleting: $branch"
    if git push origin --delete "$branch" 2>/dev/null; then
        echo "  ✓ Successfully deleted $branch"
        ((SUCCESS_COUNT++))
    else
        echo "  ✗ Failed to delete $branch (may already be deleted)"
        ((FAILED_COUNT++))
    fi
    echo ""
done

echo "================================"
echo "Summary:"
echo "  Successfully deleted: $SUCCESS_COUNT"
echo "  Failed/Already deleted: $FAILED_COUNT"
echo "================================"
echo ""
echo "Verifying remaining branches..."
git ls-remote --heads origin | awk '{print $2}' | sed 's|refs/heads/||'
echo ""
echo "Done!"
