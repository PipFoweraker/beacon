# Beacon

Fiscal sponsorship for high-impact projects in AI safety and global catastrophic risk reduction.

## About

Beacon is a US 501(c)(3) fiscal sponsor designed to reduce administrative and compliance friction for research and projects working on catastrophic and existential risk.

## Website

- **Production**: https://beaconfiscal.org (pending domain setup)
- **Status**: Coming Soon

## Development

This is a static website. To work on it locally:

```bash
# Clone the repository
git clone https://github.com/PipFoweraker/beacon.git
cd beacon

# Open index.html in your browser
# Or use a simple HTTP server:
python -m http.server 8000
# Then visit http://localhost:8000
```

## Deployment

The site automatically deploys to Dreamhost when changes are pushed to `main`.

See [docs/deployment.md](docs/deployment.md) for setup instructions.

## Project Structure

```
beacon/
├── index.html          # Main landing page
├── styles.css          # Stylesheet
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
└── docs/
    ├── deployment.md   # Deployment guide
    ├── domain-notes.md # Domain registration notes
    └── jira-setup.md   # Jira project configuration
```

## Related Projects

- **Jira Project**: BEACON - tracks Phase 0 implementation tasks
- **CVTas Integration**: Status dashboard at `/status/` shows BEACON progress

## Contact

- Email: pip@beaconfiscal.org
- Project Lead: Pip Foweraker
