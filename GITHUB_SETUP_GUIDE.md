# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository (Do this on GitHub website)

### Option A: Using GitHub Website (Easiest)

1. **Go to GitHub**: Open https://github.com in your browser
2. **Sign in** to your GitHub account (or create one if you don't have it)
3. **Click the "+" icon** in the top right corner
4. **Select "New repository"**
5. **Fill in the details**:
   - **Repository name**: `ai-travel-itinerary` (or any name you prefer)
   - **Description**: "AI Travel Itinerary Generator - Bootcamp Project"
   - **Visibility**: Choose **Public** (for bootcamp) or **Private**
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore or license (we already have them)
6. **Click "Create repository"**

### Option B: Using GitHub CLI (if you have it installed)

```bash
gh repo create ai-travel-itinerary --public --description "AI Travel Itinerary Generator - Bootcamp Project"
```

## Step 2: Copy Your Repository URL

After creating the repository, GitHub will show you a page with setup instructions. You'll see a URL like:
- `https://github.com/YOUR_USERNAME/ai-travel-itinerary.git`

**Copy this URL** - you'll need it in the next step!

## Step 3: Connect Local Repository to GitHub

Once you have your repository URL, run these commands (replace with your actual URL):

```bash
cd /home/somn/Downloads/PRD
git remote add origin https://github.com/YOUR_USERNAME/ai-travel-itinerary.git
git branch -M sprint-0
git add .
git commit -m "chore(sprint-0): initialized Next.js + FastAPI project setup"
git push -u origin sprint-0
```

## Quick Setup Script

I've created a helper script that will do steps 2-3 for you. Just provide your GitHub repository URL when prompted!

