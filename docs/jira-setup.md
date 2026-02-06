# Jira MCP Setup for Claude Code

## Overview

This project uses the official Atlassian Remote MCP server to connect Claude Code to Jira Cloud. This enables Claude to:
- Create/update Jira issues
- Query project status
- Manage epics, stories, and tasks

## Configuration

The MCP configuration is in `.mcp.json` at the project root:

```json
{
  "mcpServers": {
    "Atlassian": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://mcp.atlassian.com/v1/sse"
      ]
    }
  }
}
```

## First-Time Setup

1. Open a terminal in the beacon project directory
2. Run `claude` (Claude Code CLI)
3. When prompted, authenticate via Atlassian's OAuth flow
4. Verify connection with `/mcp` command

## Authentication Notes

- OAuth tokens may expire; re-authentication required periodically
- Some users report needing to re-auth multiple times per day (known issue as of Jan 2025)
- Authentication is per-user, not stored in repo

## Jira Instance

- **URL:** https://pipfoweraker.atlassian.net/
- **Project Key:** BEACON
- **Project Name:** Beacon Fiscal Sponsor

## Task Structure

```
Project: BEACON
  └── Epic: Phase 0: Minimum Credible Sponsor (Weeks 0-6)
      ├── Story: Legal: Incorporation & 501(c)(3) Application
      ├── Story: Governance: Board Establishment
      ├── Story: Finance: Banking & Payment Rails
      ├── Story: Finance: Accounting System
      ├── Story: Operations: Spend Management
      ├── Story: Governance: Core Policy Set v1
      ├── Story: Operations: Templates & Onboarding
      ├── Story: HR & Payroll Setup
      ├── Story: Technology & Admin Setup
      └── Story: Insurance
```

## Assignee Mapping

| Role | Jira User | Notes |
|------|-----------|-------|
| Pip | Pip Foweraker | Primary owner, Interim CEO |
| Lisha | Lisha Chai | COO / holding CoS tasks with `cos-handover` label |
| EA | Ella Watson | Executive Assistant to Pip |
| US Runner | Paola (Paolabaca527) | US-based runner + customer service hours |
| Attorney | Label: `external-attorney` | PKK Legal (Paul K. Kim) |
| CoS (TBD) | Label: `cos-handover` | Hiring in progress; tasks held by Lisha |
| AUAdmin-TBD | Label: `au-admin-tbd` | Shared resource |

### Labels
| Label | Purpose |
|-------|---------|
| `cos-handover` | CoS tasks held by Lisha for eventual handover |
| `external-attorney` | Attorney-dependent tasks (PKK Legal) |
| `us-runner` | Tasks for Paola / US runner role |
| `au-admin-tbd` | Shared AU admin resource, still TBD |

### Role Notes
- **Lisha (COO):** Holding CoS operational tasks interim. When CoS hired, bulk reassign via `labels = cos-handover`
- **Ella (EA):** Administrative support to Pip; scheduling, comms, some setup tasks
- **Paola (US Runner):** US-based runner, may expand to other US coverage
- **Attorney:** External dependency; track via labels, not direct assignment

## Troubleshooting

### MCP not connecting
- Check you're in the project directory with `.mcp.json`
- Run `/mcp` in Claude Code to see server status
- Try restarting Claude Code session

### Authentication issues
- Clear browser cookies for atlassian.com
- Re-run Claude Code and re-authenticate

## References

- [Atlassian Remote MCP Announcement](https://www.atlassian.com/blog/announcements/remote-mcp-server)
- [Claude Code MCP Docs](https://docs.anthropic.com/en/docs/claude-code/mcp)
