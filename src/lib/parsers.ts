/**
 * Extract a Jira task ID from a string.
 * Matches patterns like "PROJ-123" (2+ uppercase letters, dash, digits).
 */
export function extractJiraIdFromTitle(title: string): string | null {
  const match = title.match(/[A-Z]{2,}-\d+/);
  return match?.[0] ?? null;
}

/**
 * Extract a pipeline ID from text containing "— 12345" pattern.
 */
export function extractPipelineIdFromText(text: string): string | null {
  const match = text.match(/—\s*(\d+)/);
  return match?.[1] ?? null;
}
