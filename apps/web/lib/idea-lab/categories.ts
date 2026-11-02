/**
 * Category source for the Idea Lab controls.
 *
 * The defaults below are only a starting hint for the UI — the caller decides
 * what really feeds the controls (today this list, later whatever the API
 * returns). Categories themselves are free text: a user may type any value,
 * so nothing here is a closed set.
 */
export const DEFAULT_IDEA_CATEGORIES = [
  "Developer tools",
  "B2B SaaS",
  "Consumer",
  "Productivity",
  "Fintech",
];

/**
 * Merge two category lists into one display list: values are trimmed, empty
 * entries dropped, duplicates collapsed (first spelling wins, case-insensitive)
 * and the result sorted so the UI order stays stable regardless of origin.
 */
export function mergeCategories(base: string[], extra: string[]): string[] {
  const byKey = new Map<string, string>();

  for (const value of [...base, ...extra]) {
    const display = value.trim();
    if (!display) continue;
    const key = display.toLowerCase();
    if (!byKey.has(key)) byKey.set(key, display);
  }

  return Array.from(byKey.values()).sort((a, b) => a.localeCompare(b));
}
