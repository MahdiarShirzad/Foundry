import { createHighlighter, type Highlighter } from "shiki";

/** One highlighter per process, created lazily at first render and reused for
 *  every code block — highlighting runs at build/prerender time only, so none
 *  of this ships to the browser. */
const highlighter: Promise<Highlighter> = createHighlighter({
  themes: ["github-dark-dimmed"],
  langs: ["bash", "json", "tsx", "typescript", "text"],
});

const THEME = "github-dark-dimmed";

export async function highlight(code: string, lang: string): Promise<string> {
  const h = await highlighter;
  const safeLang = h.getLoadedLanguages().includes(lang) ? lang : "text";
  return h.codeToHtml(code, { lang: safeLang, theme: THEME });
}