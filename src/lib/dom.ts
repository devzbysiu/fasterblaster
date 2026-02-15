import { extractPipelineIdFromText } from './parsers';

const PR_TITLE_SELECTORS = [
  'h1 .markdown-title',
  '.gh-header-title .js-issue-title',
  '.gh-header-title bdi',
];

export function getPrTitle(): string | null {
  for (const sel of PR_TITLE_SELECTORS) {
    const el = document.querySelector(sel);
    if (el?.textContent?.trim()) return el.textContent.trim();
  }
  return null;
}

export function findPipelineIdInDom(): string | null {
  const checkRows = document.querySelectorAll('li[aria-label]');
  for (const row of checkRows) {
    const label = row.getAttribute('aria-label')?.trim();
    if (label !== 'GitLab') continue;
    const desc = row.querySelector('[class*="titleDescription"]');
    if (!desc?.textContent) continue;
    const id = extractPipelineIdFromText(desc.textContent);
    if (id) return id;
  }
  return null;
}

export function getChecksExpandButton(): HTMLButtonElement | null {
  const section = document.querySelector('section[aria-label="Checks"]');
  return section?.querySelector<HTMLButtonElement>(
    'button[aria-label="Expand checks"], button[aria-label="Collapse checks"]',
  ) ?? null;
}
