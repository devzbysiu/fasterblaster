import { describe, it, expect, beforeEach } from 'vitest';
import { getPrTitle, findPipelineIdInDom, getChecksExpandButton } from '../dom';

describe('getPrTitle', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns title from h1 .markdown-title', () => {
    document.body.innerHTML = '<h1><span class="markdown-title">PROJ-123 fix bug</span></h1>';
    expect(getPrTitle()).toBe('PROJ-123 fix bug');
  });

  it('returns title from .gh-header-title .js-issue-title', () => {
    document.body.innerHTML = '<div class="gh-header-title"><span class="js-issue-title">PROJ-456 add feature</span></div>';
    expect(getPrTitle()).toBe('PROJ-456 add feature');
  });

  it('returns title from .gh-header-title bdi', () => {
    document.body.innerHTML = '<div class="gh-header-title"><bdi>PROJ-789 refactor</bdi></div>';
    expect(getPrTitle()).toBe('PROJ-789 refactor');
  });

  it('falls back to second selector if first is empty', () => {
    document.body.innerHTML = `
      <h1><span class="markdown-title">   </span></h1>
      <div class="gh-header-title"><span class="js-issue-title">Fallback Title</span></div>
    `;
    expect(getPrTitle()).toBe('Fallback Title');
  });

  it('returns null when no matching elements exist', () => {
    document.body.innerHTML = '<div>nothing here</div>';
    expect(getPrTitle()).toBeNull();
  });

  it('trims whitespace from title', () => {
    document.body.innerHTML = '<h1><span class="markdown-title">  spaced out  </span></h1>';
    expect(getPrTitle()).toBe('spaced out');
  });
});

describe('findPipelineIdInDom', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns pipeline ID from GitLab check row', () => {
    document.body.innerHTML = `
      <ul>
        <li aria-label="GitLab">
          <span class="titleDescription">— 12345</span>
        </li>
      </ul>
    `;
    expect(findPipelineIdInDom()).toBe('12345');
  });

  it('returns null when no GitLab row', () => {
    document.body.innerHTML = `
      <ul>
        <li aria-label="Jenkins">
          <span class="titleDescription">— 99999</span>
        </li>
      </ul>
    `;
    expect(findPipelineIdInDom()).toBeNull();
  });

  it('returns null when no check rows', () => {
    document.body.innerHTML = '<div>empty</div>';
    expect(findPipelineIdInDom()).toBeNull();
  });

  it('returns null when GitLab row has no description element', () => {
    document.body.innerHTML = `
      <ul>
        <li aria-label="GitLab">
          <span class="other">no desc</span>
        </li>
      </ul>
    `;
    expect(findPipelineIdInDom()).toBeNull();
  });

  it('returns null when description has no pipeline pattern', () => {
    document.body.innerHTML = `
      <ul>
        <li aria-label="GitLab">
          <span class="titleDescription">no pipeline here</span>
        </li>
      </ul>
    `;
    expect(findPipelineIdInDom()).toBeNull();
  });
});

describe('getChecksExpandButton', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns expand button', () => {
    document.body.innerHTML = `
      <section aria-label="Checks">
        <button aria-label="Expand checks">Show</button>
      </section>
    `;
    const btn = getChecksExpandButton();
    expect(btn).not.toBeNull();
    expect(btn?.getAttribute('aria-label')).toBe('Expand checks');
  });

  it('returns collapse button', () => {
    document.body.innerHTML = `
      <section aria-label="Checks">
        <button aria-label="Collapse checks">Hide</button>
      </section>
    `;
    const btn = getChecksExpandButton();
    expect(btn).not.toBeNull();
    expect(btn?.getAttribute('aria-label')).toBe('Collapse checks');
  });

  it('returns null when no checks section', () => {
    document.body.innerHTML = '<div>no checks</div>';
    expect(getChecksExpandButton()).toBeNull();
  });

  it('returns null when section exists but no button', () => {
    document.body.innerHTML = '<section aria-label="Checks"><div>no button</div></section>';
    expect(getChecksExpandButton()).toBeNull();
  });
});
