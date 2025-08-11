# GitHub Setup Instructions for FrontX

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: **FrontX**
3. Description: "FFURBIO Frontend - Modern learning platform with EditorJS integration"
4. Choose: **Private** or **Public** (your choice)
5. **DO NOT** initialize with:
   - README
   - .gitignore
   - License
6. Click **Create repository**

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these in your terminal:

### If your GitHub username is different, replace YOUR_USERNAME below:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
cd furbio-frontend
git remote add origin https://github.com/YOUR_USERNAME/FrontX.git

# Push the code
git branch -M main
git push -u origin main
```

### Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/FrontX.git
git branch -M main
git push -u origin main
```

## Step 3: Verify

After pushing, refresh your GitHub repository page. You should see:
- All your code files
- README.md with project documentation
- RULES.md with development guidelines
- API_INTEGRATION_GUIDE.md with API documentation
- ARCHITECTURE.md with architecture decisions

## Repository Structure

```
FrontX/
├── src/
│   ├── pages/          # Page components
│   ├── layouts/        # Layout components
│   ├── stores/         # Zustand stores
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   └── constants/      # Constants
├── API_INTEGRATION_GUIDE.md
├── ARCHITECTURE.md
├── RULES.md
├── README.md
└── package.json
```

## Next Steps

1. **Add collaborators** (if needed):
   - Go to Settings → Manage access → Invite a collaborator

2. **Set up branch protection** (recommended):
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Enable "Require pull request reviews"

3. **Add GitHub Actions** (optional):
   - For automated testing and deployment

4. **Clone on another machine**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FrontX.git
   cd FrontX
   npm install
   npm run dev
   ```

## Troubleshooting

If you get authentication errors:
1. **For HTTPS**: You might need a Personal Access Token
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with repo permissions
   - Use the token as your password when pushing

2. **For SSH**: Set up SSH keys
   - Follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## Project Info

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **UI Library**: Material-UI
- **State Management**: Zustand
- **Rich Text Editor**: EditorJS
- **Key Feature**: Episode page with Study/Practice/Mix modes

---

Created: 2025-08-10