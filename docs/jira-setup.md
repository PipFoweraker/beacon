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

| Role | Jira User |
|------|-----------|
| Pip | pip@... (primary owner) |
| CoS-TBD | Ella (assistant) |
| Attorney | Label: `external-attorney` |
| USRunner-TBD | Label: `us-runner-tbd` |
| AUAdmin-TBD | Label: `au-admin-tbd` |

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
