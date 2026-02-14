import { getSettings } from '@/lib/storage';

export default defineContentScript({
  matches: ['*://github.com/*/pull/*'],

  main() {
    document.addEventListener('keydown', async (e: KeyboardEvent) => {
      if (!e.altKey) return;

      const settings = await getSettings();

      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        const pipelineId = await extractPipelineId();

        if (!settings.gitlabUrl) {
          console.warn('[FasterBlaster] GitLab URL not configured. Open extension options.');
          return;
        }
        if (!pipelineId) {
          console.warn('[FasterBlaster] Could not find pipeline ID on this page.');
          return;
        }

        window.open(`${settings.gitlabUrl.replace(/\/+$/, '')}/pipelines/${pipelineId}`, '_blank');
      }

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        const jiraId = extractJiraId();

        if (!settings.jiraUrl) {
          console.warn('[FasterBlaster] Jira URL not configured. Open extension options.');
          return;
        }
        if (!jiraId) {
          console.warn('[FasterBlaster] Could not find Jira task ID on this page.');
          return;
        }

        window.open(`${settings.jiraUrl.replace(/\/+$/, '')}/browse/${jiraId}`, '_blank');
      }
    });
  },
});

/**
 * Extract GitLab pipeline ID from the checks section.
 * If the section is collapsed, expands it temporarily to read the data.
 */
async function extractPipelineId(): Promise<string | null> {
  const direct = findPipelineIdInDom();
  if (direct) return direct;

  // Wait for the checks section to appear if it hasn't loaded yet
  const expandBtn =
    getChecksExpandButton() ??
    await waitFor(getChecksExpandButton, 5000);
  if (!expandBtn) return null;

  // If checks are already expanded but GitLab row isn't there yet, wait
  if (expandBtn.getAttribute('aria-label') === 'Collapse checks') {
    return await waitFor(findPipelineIdInDom, 2000);
  }

  // Checks section is collapsed — expand it
  expandBtn.click();
  const id = await waitFor(findPipelineIdInDom, 2000);
  // Collapse it back
  expandBtn.click();
  return id;
}

function findPipelineIdInDom(): string | null {
  const checkRows = document.querySelectorAll('li[aria-label]');
  for (const row of checkRows) {
    const label = row.getAttribute('aria-label')?.trim();
    if (label !== 'GitLab') continue;
    const desc = row.querySelector('[class*="titleDescription"]');
    if (!desc?.textContent) continue;
    const match = desc.textContent.match(/—\s*(\d+)/);
    if (match) return match[1];
  }
  return null;
}

function getChecksExpandButton(): HTMLButtonElement | null {
  const section = document.querySelector(
    'section[aria-label="Checks"]',
  );
  return section?.querySelector<HTMLButtonElement>(
    'button[aria-label="Expand checks"], button[aria-label="Collapse checks"]',
  ) ?? null;
}

function waitFor<T>(
  fn: () => T | null,
  timeout: number,
  interval = 100,
): Promise<T | null> {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const result = fn();
      if (result) return resolve(result);
      if (Date.now() - start >= timeout) return resolve(null);
      setTimeout(check, interval);
    };
    check();
  });
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
