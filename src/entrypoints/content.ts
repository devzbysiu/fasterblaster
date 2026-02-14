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
 * Extract pipeline ID from the GitHub PR page.
 * TODO: Adjust selector/logic based on where the pipeline ID actually appears.
 */
function extractPipelineId(): string | null {
  const body = document.body.innerText;
  const match = body.match(/pipeline\s*#?(\d+)/i);
  return match?.[1] ?? null;
}

/**
 * Extract Jira task ID from the GitHub PR title.
 * Looks for patterns like "PROJ-1234".
 */
function extractJiraId(): string | null {
  const titleEl = document.querySelector('.gh-header-title .js-issue-title');
  const title = titleEl?.textContent ?? '';
  const match = title.match(/[A-Z]{2,}-\d+/);
  return match?.[0] ?? null;
}
