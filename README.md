# FasterBlaster

Quickly open GitLab pipelines and Jira tasks from GitHub PRs.

<p>
  <img alt="WXT" src="https://img.shields.io/badge/WXT-framework-blue"/>
  <img alt="Svelte" src="https://img.shields.io/badge/Svelte-5-orange"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue"/>
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8"/>
</p>

[About](#about) | [Features](#features) | [Installation](#installation) | [Configuration](#configuration) | [Development](#development)

## About

FasterBlaster is a browser extension that adds quick keyboard-driven navigation
from GitHub Pull Request pages to related Jira tasks and GitLab pipelines. It
automatically detects Jira task IDs from PR titles and GitLab pipeline IDs from
PR status checks, so you can jump to them instantly without leaving the page.

## Features

- Detects Jira task IDs from PR titles (e.g. `PROJ-1234`)
- Detects GitLab pipeline IDs from PR action/status areas
- Keyboard shortcuts on GitHub PR pages:
  - `Alt+J` - Open related Jira task
  - `Alt+G` - Open related GitLab pipeline
- Settings page to configure your Jira and GitLab base URLs

## Installation

### Browser Support

- Chromium-based browsers (Chrome, Edge, Brave, etc.)
- Firefox
- Vivaldi

### From Source

```bash
npm install

# Chrome
npm run build

# Firefox
npm run build:firefox
```

Then load the unpacked extension from the `.output/chrome-mv3` or `.output/firefox-mv2` directory in your browser's extension settings.

## Configuration

Open the extension's options page to set your base URLs:

- **Jira Base URL** - e.g. `https://yourcompany.atlassian.net`
- **GitLab Base URL** - e.g. `https://gitlab.yourcompany.com`

The extension uses these URLs combined with the detected IDs to build navigation links.

## Development

```bash
npm install

# Chrome (hot-reload)
npm run dev

# Firefox (hot-reload)
npm run dev:firefox
```

### Build

```bash
# Chrome
npm run build

# Firefox
npm run build:firefox
```

### Package

```bash
# Chrome
npm run zip

# Firefox
npm run zip:firefox
```