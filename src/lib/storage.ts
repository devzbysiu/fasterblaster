const KEYS = {
  gitlabUrl: 'gitlabUrl',
  jiraUrl: 'jiraUrl',
} as const;

export interface Settings {
  gitlabUrl: string;
  jiraUrl: string;
}

export async function getSettings(): Promise<Settings> {
  const result = await browser.storage.local.get([KEYS.gitlabUrl, KEYS.jiraUrl]);
  return {
    gitlabUrl: (result[KEYS.gitlabUrl] as string) ?? '',
    jiraUrl: (result[KEYS.jiraUrl] as string) ?? '',
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await browser.storage.local.set({
    [KEYS.gitlabUrl]: settings.gitlabUrl,
    [KEYS.jiraUrl]: settings.jiraUrl,
  });
}
