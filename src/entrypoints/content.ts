import { getSettings } from '@/lib/storage';
import { extractJiraIdFromTitle } from '@/lib/parsers';
import { getPrTitle, findPipelineIdInDom, getChecksExpandButton } from '@/lib/dom';
import { waitFor } from '@/lib/wait-for';

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

function extractJiraId(): string | null {
  const title = getPrTitle();
  if (!title) return null;
  return extractJiraIdFromTitle(title);
}
