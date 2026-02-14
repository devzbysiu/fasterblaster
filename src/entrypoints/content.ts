import { getSettings } from '@/lib/storage';

export default defineContentScript({
  matches: ['*://github.com/*/pull/*'],

  main() {
    document.addEventListener('keydown', async (e: KeyboardEvent) => {
      if (!e.altKey) return;

      const settings = await getSettings();

      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        const pipelineId = extractPipelineId();

        if (!settings.gitlabUrl) {
          console.warn('[Quick Nav] GitLab URL not configured. Open extension options.');
          return;
        }
        if (!pipelineId) {
          console.warn('[Quick Nav] Could not find pipeline ID on this page.');
          return;
        }

        window.open(`${settings.gitlabUrl.replace(/\/+$/, '')}/pipelines/${pipelineId}`, '_blank');
      }

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        const jiraId = extractJiraId();

        if (!settings.jiraUrl) {
          console.warn('[Quick Nav] Jira URL not configured. Open extension options.');
          return;
        }
        if (!jiraId) {
          console.warn('[Quick Nav] Could not find Jira task ID on this page.');
          return;
        }

        window.open(`${settings.jiraUrl.replace(/\/+$/, '')}/browse/${jiraId}`, '_blank');
      }
    });
  },
});

/**
 * Extract GitLab pipeline ID from the checks section.
 * Finds the check row titled "GitLab" and reads the pipeline ID
 * from its description text (e.g. "— 3442426").
 */
function extractPipelineId(): string | null {
  const checkRows = document.querySelectorAll('li[aria-label]');
  for (const row of checkRows) {
    const label = row.getAttribute('aria-label')?.trim();
    if (label !== 'GitLab') continue;
    const desc = row.querySelector(
      '[class*="titleDescription"]',
    );
    if (!desc?.textContent) continue;
    const match = desc.textContent.match(/—\s*(\d+)/);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract Jira task ID from the GitHub PR title.
 * Matches patterns like "LVPN-9923" (2+ uppercase letters, dash, digits).
 */
function extractJiraId(): string | null {
  const title = getPrTitle();
  if (!title) return null;
  const match = title.match(/[A-Z]{2,}-\d+/);
  return match?.[0] ?? null;
}

function getPrTitle(): string | null {
  const selectors = [
    'h1 .markdown-title',
    '.gh-header-title .js-issue-title',
    '.gh-header-title bdi',
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el?.textContent?.trim()) return el.textContent.trim();
  }
  return null;
}
