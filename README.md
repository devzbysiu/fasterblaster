# FasterBlaster

Browser extension that adds quick navigation from GitHub Pull
Request pages to related Jira tasks and GitLab pipelines.

## Features

- Detects Jira task IDs from PR titles (e.g. `PROJ-1234`)
- Detects GitLab pipeline IDs from PR action/status areas
- Keyboard shortcuts on GitHub PR pages:
  `Alt+G` (GitLab), `Alt+J` (Jira)
- Settings page to configure your Jira and GitLab base
  URLs

## Browser Support

- Chromium-based browsers (Chrome, Edge, Brave, etc.)
- Firefox
- Vivaldi

## Development

```bash
npm install

# Chrome
npm run dev

# Firefox
npm run dev:firefox
```

## Build

```bash
# Chrome
npm run build

# Firefox
npm run build:firefox
```
