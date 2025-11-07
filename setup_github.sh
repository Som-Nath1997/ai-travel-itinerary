#!/bin/bash

echo "🚀 GitHub Repository Setup Script"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Running git init..."
    git init
fi

# Set default branch to sprint-0
git branch -M sprint-0 2>/dev/null || git checkout -b sprint-0

echo ""
echo "📋 Please provide your GitHub repository URL"
echo "   Example: https://github.com/yourusername/ai-travel-itinerary.git"
echo ""
read -p "Enter your GitHub repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists. Updating..."
    git remote set-url origin "$REPO_URL"
else
    echo "✅ Adding remote repository..."
    git remote add origin "$REPO_URL"
fi

echo ""
echo "📦 Staging all files..."
git add .

echo ""
echo "💾 Creating initial commit..."
git commit -m "chore(sprint-0): initialized Next.js + FastAPI project setup"

echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin sprint-0

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code has been pushed to GitHub!"
    echo "   Repository: $REPO_URL"
    echo "   Branch: sprint-0"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   1. Authentication required (use GitHub token or SSH)"
    echo "   2. Repository doesn't exist or URL is incorrect"
    echo "   3. Network connection issue"
    echo ""
    echo "💡 Tip: You may need to set up authentication:"
    echo "   - Use Personal Access Token: https://github.com/settings/tokens"
    echo "   - Or set up SSH keys: https://docs.github.com/en/authentication"
fi

