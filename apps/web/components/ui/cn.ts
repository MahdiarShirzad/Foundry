/** Minimal class-name joiner. Keeps conditional Tailwind strings readable. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
