import { describe, it, expect } from 'vitest';
import { extractJiraIdFromTitle, extractPipelineIdFromText } from '../parsers';

describe('extractJiraIdFromTitle', () => {
  it('extracts a standard Jira ID', () => {
    expect(extractJiraIdFromTitle('PROJ-123 fix login bug')).toBe('PROJ-123');
  });

  it('extracts ID with longer project key', () => {
    expect(extractJiraIdFromTitle('feat: LVPN-9923 add feature')).toBe('LVPN-9923');
  });

  it('returns the first match when multiple IDs are present', () => {
    expect(extractJiraIdFromTitle('PROJ-1 and PROJ-2')).toBe('PROJ-1');
  });

  it('returns null when no match', () => {
    expect(extractJiraIdFromTitle('no jira id here')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractJiraIdFromTitle('')).toBeNull();
  });

  it('does not match single-letter prefix', () => {
    expect(extractJiraIdFromTitle('A-123')).toBeNull();
  });

  it('does not match lowercase prefix', () => {
    expect(extractJiraIdFromTitle('proj-123')).toBeNull();
  });

  it('extracts ID at the end of string', () => {
    expect(extractJiraIdFromTitle('fix bug TEAM-42')).toBe('TEAM-42');
  });
});

describe('extractPipelineIdFromText', () => {
  it('extracts pipeline ID from em-dash format', () => {
    expect(extractPipelineIdFromText('— 12345')).toBe('12345');
  });

  it('extracts without space after em-dash', () => {
    expect(extractPipelineIdFromText('—12345')).toBe('12345');
  });

  it('extracts with extra whitespace', () => {
    expect(extractPipelineIdFromText('—  99999')).toBe('99999');
  });

  it('returns null when no em-dash pattern', () => {
    expect(extractPipelineIdFromText('pipeline 12345')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractPipelineIdFromText('')).toBeNull();
  });

  it('extracts from surrounding text', () => {
    expect(extractPipelineIdFromText('some prefix — 67890 suffix')).toBe('67890');
  });
});
