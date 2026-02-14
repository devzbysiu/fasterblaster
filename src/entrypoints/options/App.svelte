<script lang="ts">
  import { getSettings, saveSettings } from '@/lib/storage';

  let gitlabValue = $state('');
  let jiraValue = $state('');
  let saved = $state(false);

  $effect(() => {
    loadSettings();
  });

  async function loadSettings() {
    const settings = await getSettings();
    gitlabValue = settings.gitlabUrl;
    jiraValue = settings.jiraUrl;
  }

  async function save() {
    await saveSettings({ gitlabUrl: gitlabValue, jiraUrl: jiraValue });
    saved = true;
    setTimeout(() => (saved = false), 2000);
  }
</script>

<div class="min-h-screen bg-gray-950 flex items-start justify-center pt-16 px-4">
  <div class="bg-gray-900 rounded-xl ring-1 ring-gray-800 p-8 w-full max-w-lg">
    <h1 class="text-2xl font-bold text-gray-100 mb-6">FasterBlaster</h1>

    <form onsubmit={(e) => { e.preventDefault(); save(); }}>
      <label class="block mb-4">
        <span class="block text-sm font-medium text-gray-400 mb-1">GitLab Base URL</span>
        <input
          type="url"
          bind:value={gitlabValue}
          placeholder="https://gitlab.example.com"
          class="w-full rounded border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <span class="block text-xs text-gray-400 mt-1">Pipeline will open at: {gitlabValue || '...'}/pipelines/&#123;id&#125;</span>
      </label>

      <label class="block mb-6">
        <span class="block text-sm font-medium text-gray-400 mb-1">Jira Base URL</span>
        <input
          type="url"
          bind:value={jiraValue}
          placeholder="https://jira.example.com"
          class="w-full rounded border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <span class="block text-xs text-gray-400 mt-1">Task will open at: {jiraValue || '...'}/browse/&#123;id&#125;</span>
      </label>

      <div class="flex items-center gap-3">
        <button
          type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          Save
        </button>
        {#if saved}
          <span class="text-emerald-400 text-sm">Settings saved!</span>
        {/if}
      </div>
    </form>

    <div class="mt-8 border-t border-gray-700 pt-4 text-xs text-gray-400">
      <p class="font-medium mb-1">Keyboard shortcuts (on GitHub PR pages):</p>
      <ul class="list-disc list-inside space-y-0.5">
        <li><kbd class="bg-gray-800 text-gray-300 border border-gray-600 px-1 rounded">Alt+G</kbd> — Open GitLab pipeline</li>
        <li><kbd class="bg-gray-800 text-gray-300 border border-gray-600 px-1 rounded">Alt+J</kbd> — Open Jira task</li>
      </ul>
    </div>
  </div>
</div>
