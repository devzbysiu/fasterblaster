import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSettings, saveSettings } from '../storage';

const mockStorage: Record<string, unknown> = {};

vi.stubGlobal('browser', {
  storage: {
    local: {
      get: vi.fn(async (keys: string[]) => {
        const result: Record<string, unknown> = {};
        for (const key of keys) {
          if (key in mockStorage) result[key] = mockStorage[key];
        }
        return result;
      }),
      set: vi.fn(async (items: Record<string, unknown>) => {
        Object.assign(mockStorage, items);
      }),
    },
  },
});

describe('getSettings', () => {
  beforeEach(() => {
    for (const key of Object.keys(mockStorage)) delete mockStorage[key];
    vi.clearAllMocks();
  });

  it('returns empty defaults when storage is empty', async () => {
    const settings = await getSettings();
    expect(settings).toEqual({ gitlabUrl: '', jiraUrl: '' });
  });

  it('returns saved values', async () => {
    mockStorage.gitlabUrl = 'https://gitlab.example.com';
    mockStorage.jiraUrl = 'https://jira.example.com';
    const settings = await getSettings();
    expect(settings).toEqual({
      gitlabUrl: 'https://gitlab.example.com',
      jiraUrl: 'https://jira.example.com',
    });
  });
});

describe('saveSettings', () => {
  beforeEach(() => {
    for (const key of Object.keys(mockStorage)) delete mockStorage[key];
    vi.clearAllMocks();
  });

  it('stores settings correctly', async () => {
    await saveSettings({
      gitlabUrl: 'https://gitlab.test',
      jiraUrl: 'https://jira.test',
    });
    expect(browser.storage.local.set).toHaveBeenCalledWith({
      gitlabUrl: 'https://gitlab.test',
      jiraUrl: 'https://jira.test',
    });
  });
});
