<div align="center">

  <h1>FasterBlaster</h1>

  <h3>
    <strong>Quickly open GitLab pipelines and Jira tasks from GitHub PRs</strong>
  </h3>

  <p>
    <img alt="WXT" src="https://img.shields.io/badge/WXT-framework-blue?style=for-the-badge"/>
    <img alt="Svelte" src="https://img.shields.io/badge/Svelte-5-orange?style=for-the-badge"/>
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge"/>
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=for-the-badge"/>
  </p>

  <h3>
    <a href="#about">About</a>
    <span> | </span>
    <a href="#features">Features</a>
    <span> | </span>
    <a href="#installation">Installation</a>
    <span> | </span>
    <a href="#configuration">Configuration</a>
    <span> | </span>
    <a href="#development">Development</a>
  </h3>

</div>

# <p id="about">About</p>

FasterBlaster is a browser extension that adds quick keyboard-driven navigation
from GitHub Pull Request pages to related Jira tasks and GitLab pipelines. It
automatically detects Jira task IDs from PR titles and GitLab pipeline IDs from
PR status checks, so you can jump to them instantly without leaving the page.

# <p id="features">Features</p>

- Detects Jira task IDs from PR titles (e.g. `PROJ-1234`)
- Detects GitLab pipeline IDs from PR action/status areas
- Keyboard shortcuts on GitHub PR pages:
  - `Alt+J` - Open related Jira task
  - `Alt+G` - Open related GitLab pipeline
- Settings page to configure your Jira and GitLab base URLs

# <p id="installation">Installation</p>

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

# <p id="configuration">Configuration</p>

Open the extension's options page to set your base URLs:

- **Jira Base URL** - e.g. `https://yourcompany.atlassian.net`
- **GitLab Base URL** - e.g. `https://gitlab.yourcompany.com`

The extension uses these URLs combined with the detected IDs to build navigation links.

# <p id="development">Development</p>

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