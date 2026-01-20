# Beacon Website Deployment Guide

This document explains how to deploy the Beacon static website to Dreamhost.

## Overview

The site is deployed automatically via GitHub Actions whenever changes are pushed to the `main` branch. The workflow uses FTPS to upload files to Dreamhost's shared hosting.

## Architecture

```
GitHub Repository (main branch)
         │
         ▼ (push trigger)
   GitHub Actions
         │
         ▼ (FTPS upload)
   Dreamhost Server
         │
         ▼
   https://beaconfiscal.org
```

## Initial Setup (One-Time)

### 1. Dreamhost Configuration

1. **Log into Dreamhost Panel**: https://panel.dreamhost.com
2. **Set up the domain**:
   - Go to "Manage Domains" → "Add Hosting to a Domain"
   - Add `beaconfiscal.org` (or your chosen domain)
   - Note the web directory path (typically `/home/username/beaconfiscal.org`)
3. **Create FTP user** (if needed):
   - Go to "Manage Users"
   - Create or use existing user with FTP/SFTP access
   - Note the username
4. **Enable FTPS**:
   - Dreamhost supports FTPS on port 21
   - Server is typically `ftp.dreamhost.com` or your domain

### 2. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. Go to: `https://github.com/YOUR_USERNAME/beacon/settings/secrets/actions`
2. Click "New repository secret" and add each:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `FTP_SERVER` | Dreamhost FTP server | `ftp.dreamhost.com` |
| `FTP_USERNAME` | Your FTP username | `username` |
| `FTP_PASSWORD` | Your FTP password | `your-secure-password` |
| `FTP_REMOTE_PATH` | Path on server | `/home/username/beaconfiscal.org/` |

**Important**:
- The `FTP_REMOTE_PATH` must end with a trailing slash
- Use the full path from the server root

### 3. Verify Setup

1. Push a small change to the `main` branch
2. Go to the "Actions" tab in GitHub
3. Watch the "Deploy to Dreamhost" workflow
4. Check for green checkmark (success) or red X (failure)

## Manual Deployment

If you need to deploy manually:

1. Go to the "Actions" tab in GitHub
2. Select "Deploy to Dreamhost" workflow
3. Click "Run workflow" button
4. Select the `main` branch
5. Click "Run workflow"

## Deployment Workflow Details

The workflow (`.github/workflows/deploy.yml`) does the following:

1. **Triggers**: On push to `main` or manual trigger
2. **Checkout**: Pulls the latest code
3. **Deploy**: Uses `SamKirkland/FTP-Deploy-Action` to:
   - Connect via FTPS (encrypted FTP)
   - Upload all files except excluded patterns
   - Only uploads changed files (incremental)

### Excluded Files

These files are NOT deployed to production:
- `.git*` - Git metadata
- `node_modules/` - Build dependencies (if any)
- `.claude/` - Claude Code local config
- `.mcp.json` - MCP configuration
- `docs/` - Documentation (except README)
- `*.md` files - Markdown docs (except README)

## Troubleshooting

### Deployment Failed

1. **Check GitHub Actions logs**:
   - Go to Actions tab → failed workflow → click on the job
   - Expand failed step to see error details

2. **Common issues**:
   - Wrong FTP credentials → Update secrets
   - Server unreachable → Check Dreamhost status
   - Permission denied → Check user has write access to directory
   - Path incorrect → Verify `FTP_REMOTE_PATH` exists on server

### Files Not Updating

1. Clear browser cache or use incognito mode
2. Check if file is in the exclude list
3. Verify the file was committed and pushed

### FTPS Connection Issues

Dreamhost requires FTPS (FTP over TLS). If connection fails:
- Ensure `protocol: ftps` is set in the workflow
- Use port 21 (standard FTP port with STARTTLS)
- Server should be `ftp.dreamhost.com`

## Adding New Files

Simply add files to the repository and push:

```bash
# Add new page
git add new-page.html
git commit -m "Add new page"
git push origin main
```

The deployment will automatically include the new files.

## SSL/HTTPS

Dreamhost provides free Let's Encrypt SSL certificates:

1. Go to Dreamhost Panel → "Manage Domains"
2. Click "Edit" next to your domain
3. Enable "Secure Hosting" with Let's Encrypt
4. Wait 15-30 minutes for certificate provisioning

## Custom 404 Page

To add a custom 404 page:

1. Create `404.html` in the repository root
2. Push to main branch
3. Dreamhost will automatically use it for 404 errors

## Monitoring

Check deployment status:
- **GitHub Actions**: `https://github.com/YOUR_USERNAME/beacon/actions`
- **Site uptime**: Visit the live site
- **SSL status**: Check browser padlock icon

---

## Quick Reference

### GitHub Secrets Required

```
FTP_SERVER=ftp.dreamhost.com
FTP_USERNAME=your_username
FTP_PASSWORD=your_password
FTP_REMOTE_PATH=/home/your_username/beaconfiscal.org/
```

### Deploy Commands

```bash
# Normal deploy (automatic)
git push origin main

# Manual deploy
# Go to GitHub → Actions → Deploy to Dreamhost → Run workflow
```

### File Structure

```
beacon/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Deployment workflow
├── docs/
│   ├── deployment.md       # This file
│   ├── domain-notes.md     # Domain purchase notes
│   └── jira-setup.md       # Jira project setup
├── index.html              # Main landing page
├── styles.css              # Stylesheet
├── .gitignore              # Git ignore rules
└── README.md               # Repository readme
```

---

**Last Updated**: January 2026
