# Branch Cleanup - README

## Overview
This PR identifies and provides tools to remove 12 branches that have been merged into `main` and are no longer needed.

## What This PR Contains

1. **BRANCHES_TO_DELETE.md** - Detailed documentation of all merged branches
2. **delete-merged-branches.sh** - Script to automate branch deletion (requires push permissions)
3. **This README** - Instructions for completing the cleanup

## Identified Merged Branches

The following branches have been fully merged into `main` and can be safely deleted:

1. BetterAuth (merged Dec 14, 2025)
2. AuthUI-SignUp (merged Dec 15, 2025)
3. AuthUI-Socials-Callbacks (merged Dec 16, 2025)
4. AuthUI-Socials (merged Dec 16, 2025)
5. AuthUI (merged Dec 16, 2025)
6. Dashboard-Navbar (merged Dec 21, 2025)
7. Dashboard (merged Dec 21, 2025)
8. Backend (merged Dec 22, 2025)
9. Agents (merged Dec 24, 2025)
10. new-Backend (merged Dec 27, 2025)
11. windsurf-changes (merged Dec 27, 2025)
12. windsurf-changes-v2 (merged Dec 29, 2025)

## How to Delete the Branches

### Method 1: Using GitHub Web Interface (Recommended)

1. Go to https://github.com/APrem-7/Meet-ai/branches
2. You'll see a "Merged branches" section
3. Click the delete icon (🗑️) next to each branch listed above
4. Confirm the deletion

### Method 2: Using the Provided Script

If you have push permissions to the repository:

```bash
# Navigate to the repository
cd /path/to/Meet-ai

# Run the script
./delete-merged-branches.sh
```

The script will:
- Show you the list of branches to delete
- Ask for confirmation
- Delete each branch one by one
- Provide a summary of successes and failures
- Show the remaining branches

### Method 3: Manual Command Line

If you prefer to delete branches manually:

```bash
git push origin --delete BetterAuth
git push origin --delete AuthUI-SignUp
git push origin --delete AuthUI-Socials-Callbacks
git push origin --delete AuthUI-Socials
git push origin --delete AuthUI
git push origin --delete Dashboard-Navbar
git push origin --delete Dashboard
git push origin --delete Backend
git push origin --delete Agents
git push origin --delete new-Backend
git push origin --delete windsurf-changes
git push origin --delete windsurf-changes-v2
```

## Important Notes

### ✅ Safe to Delete
All the branches listed above have been:
- Successfully merged into `main`
- Their code is preserved in the main branch
- Associated pull requests are closed
- No longer actively developed

### ❌ Branches Kept
The following branches are NOT being deleted:
- `main` - Protected default branch
- `copilot/remove-unnecessary-branches` - Current working branch
- `copilot/fix-agents-loading-page` - Recent work, potentially useful
- `copilot/vscode-mjaf79kh-mb5z` - Draft PR, not merged
- `sidechanges` - No PR history, needs investigation

## Verification

After deletion, verify the cleanup:

```bash
# List all remote branches
git ls-remote --heads origin

# Or visit GitHub
https://github.com/APrem-7/Meet-ai/branches
```

## Why Clean Up Branches?

1. **Improved Repository Navigation** - Easier to find active branches
2. **Reduced Clutter** - Cleaner branch list
3. **Better Maintenance** - Easier to understand repository structure
4. **Best Practice** - Industry standard to remove merged branches

## Need Help?

If you encounter any issues:
1. Check `BRANCHES_TO_DELETE.md` for detailed information
2. Verify you have push permissions to the repository
3. Ensure the branch has truly been merged (check the PR status)

## Next Steps After This PR

1. Merge this PR to add the documentation to `main`
2. Delete the merged branches using one of the methods above
3. Optionally, delete this branch (`copilot/remove-unnecessary-branches`) after the PR is merged
4. Consider setting up branch protection rules to automatically delete branches after PR merge

---

**Note:** This is documentation and tooling only. The actual branch deletion must be performed by a user with appropriate repository permissions, either through the GitHub web interface or using the provided script.
