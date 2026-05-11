# TeskaLabs Elastic Agent

A React-based management UI for Elastic Agent, built on the [ASAB WebUI](https://github.com/TeskaLabs/asab-webui-shell-lib) framework.

## Screens

| Route | Screen |
|---|---|
| `/agents` | List of enrolled Elastic Agents with status, policy, version, and last activity |
| `/agents/:id` | Agent detail — hostname, IP, OS, policy, version, enrolled and last activity dates |
| `/policies` | List of Agent Policies with enrolled agent counts |
| `/enrollment-tokens` | List of enrollment tokens with copy-to-clipboard support |

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/)

## Getting started

```bash
pnpm install
pnpm start       # dev server at http://localhost:3000
pnpm build       # production build → dist/
pnpm test        # run Jest tests
```

## Libraries

| Package | Role |
|---|---|
| `asab_webui_shell` | App shell — routing, sidebar, Redux, theme, auth |
| `asab_webui_components` | UI toolkit — `DataTableCard2`, `DateTime`, `CopyableInput`, base module/service classes |
