#!/bin/bash

echo "🚀 Pushing to GitHub with token..."
echo ""
echo "Please enter your GitHub Personal Access Token when prompted."
echo ""

# Method 1: Use credential helper (recommended)
read -p "Enter your GitHub username (Som-Nath1997): " GITHUB_USERNAME
read -sp "Enter your Personal Access Token: " GITHUB_TOKEN
echo ""

# Update remote URL with token embedded
git remote set-url origin https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/Som-Nath1997/ai-travel-itinerary.git

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin sprint-0

# Reset remote URL to remove token (for security)
git remote set-url origin https://github.com/Som-Nath1997/ai-travel-itinerary.git

echo ""
echo "✅ Done! Token has been removed from remote URL for security."

