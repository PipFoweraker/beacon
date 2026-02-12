# Beacon

Fiscal sponsorship for high-impact projects in AI safety and global catastrophic risk reduction.

## About

Beacon is a US 501(c)(3) fiscal sponsor designed to reduce administrative and compliance friction for research and projects working on catastrophic and existential risk.

## Website

- **Production**: https://beacongcr.org (pending domain setup)
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
├── index.html                          # Home page
├── styles.css                          # Global stylesheet
├── components.js                       # Shared nav + footer (injected via JS)
├── .htaccess                           # Clean URL rewrites
├── about/                              # About section
│   ├── index.html                      # Section landing
│   ├── theory-of-change.html           # Mission & theory of change
│   ├── scope.html                      # Scope & focus
│   └── team.html                       # Team & governance
├── fiscal-sponsorship/                 # Core program section
│   ├── index.html                      # Section landing
│   ├── overview.html                   # What fiscal sponsorship is
│   ├── fit.html                        # Is Beacon right for you?
│   ├── apply.html                      # Application
│   └── current-projects.html           # For sponsored projects
├── resources/                          # Guides and templates
│   ├── index.html                      # Section landing
│   ├── starting.html                   # Starting a GCR project
│   ├── funding.html                    # Funding & grants
│   ├── project-management.html         # Project management
│   └── compliance.html                 # Compliance & governance
├── governance/                         # Policy documents
│   ├── coi.html                        # Conflict of interest policy
│   └── financials.html                 # Financial transparency
├── news.html                           # News & updates
├── contact.html                        # Contact
├── privacy.html                        # Privacy policy
├── terms.html                          # Terms of use
├── accessibility.html                  # Accessibility statement
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions SFTP deployment
└── docs/                               # Internal docs (not deployed)
    ├── deployment.md                    # Deployment guide
    ├── domain-notes.md                  # Domain registration notes
    ├── irs-1023-preparation.md          # IRS Form 1023 prep
    ├── phase0-tracker.md                # Phase 0 task tracking
    └── jira-setup.md                    # Jira project configuration
```

## Related Projects

- **Jira Project**: BEACON - tracks Phase 0 implementation tasks
- **CVTas Integration**: Status dashboard at `/status/` shows BEACON progress

## Contact

- Email: pip@beacongcr.org
- Project Lead: Pip Foweraker
