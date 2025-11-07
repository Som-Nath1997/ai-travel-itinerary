# Quick Start - GitHub Setup

## 🎯 Step 1: Create GitHub Repository

### Go to GitHub and create a new repository:

1. Visit: **https://github.com/new**
2. Repository name: `ai-travel-itinerary` (or any name)
3. Description: `AI Travel Itinerary Generator - Bootcamp Project`
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### After creating, copy the repository URL
It will look like: `https://github.com/YOUR_USERNAME/ai-travel-itinerary.git`

---

## 🚀 Step 2: Run the Setup Script

Once you have your GitHub repository URL, run:

```bash
./setup_github.sh
```

The script will:
- ✅ Add your repository as remote
- ✅ Stage all files
- ✅ Create initial commit
- ✅ Push to GitHub on `sprint-0` branch

---

## 📝 Manual Method (Alternative)

If you prefer to do it manually:

```bash
# 1. Add remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/ai-travel-itinerary.git

# 2. Stage all files
git add .

# 3. Create commit
git commit -m "chore(sprint-0): initialized Next.js + FastAPI project setup"

# 4. Push to GitHub
git push -u origin sprint-0
```

---

## ⚠️ Authentication Note

If you get authentication errors, you may need to:

1. **Use Personal Access Token**:
   - Go to: https://github.com/settings/tokens
   - Generate new token (classic)
   - Use token as password when pushing

2. **Or use SSH** (more secure):
   - Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## ✅ Verification

After pushing, visit your GitHub repository URL to see your code!

