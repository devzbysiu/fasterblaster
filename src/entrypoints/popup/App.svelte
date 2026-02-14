<script lang="ts">
  import { getSettings } from '@/lib/storage';

  let gitlabConfigured = $state(false);
  let jiraConfigured = $state(false);

  $effect(() => {
    checkConfig();
  });

  async function checkConfig() {
    const settings = await getSettings();
    gitlabConfigured = !!settings.gitlabUrl;
    jiraConfigured = !!settings.jiraUrl;
  }

  function openOptions() {
    browser.runtime.openOptionsPage();
  }
</script>

<div class="w-72 bg-gray-950 p-5">
  <h1 class="text-base font-bold text-gray-100 mb-3">FasterBlaster</h1>

  <div class="space-y-2 text-sm mb-4">
    <div class="flex items-center gap-2">
      <span class={gitlabConfigured ? 'text-emerald-400' : 'text-red-400'}>
        {gitlabConfigured ? '✓' : '✗'}
      </span>
      <span class="text-gray-400">GitLab URL</span>
    </div>
    <div class="flex items-center gap-2">
      <span class={jiraConfigured ? 'text-emerald-400' : 'text-red-400'}>
        {jiraConfigured ? '✓' : '✗'}
      </span>
      <span class="text-gray-400">Jira URL</span>
    </div>
  </div>

  <button
    onclick={openOptions}
    class="w-full bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-indigo-500 cursor-pointer"
  >
    Settings
  </button>

  <div class="mt-3 text-xs text-gray-400 border-t border-gray-700 pt-3">
    <p class="font-medium mb-1">Shortcuts (on GitHub PR pages):</p>
    <ul class="space-y-0.5">
      <li><kbd class="bg-gray-800 text-gray-300 border border-gray-600 px-1 rounded">Alt+G</kbd> GitLab pipeline</li>
      <li><kbd class="bg-gray-800 text-gray-300 border border-gray-600 px-1 rounded">Alt+J</kbd> Jira task</li>
    </ul>
  </div>
</div>
