import Link from "next/link";
import type { ReactNode } from "react";
import type { Block } from "@/lib/docs";
import { slugify } from "@/lib/docs";
import { highlight } from "./highlight";
import CodeBlock from "./code-block";

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

/** Inline mini-markup: `code`, **strong**, [label](href). */
function renderInline(text: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter((part) => part.length > 0)
    .map((part, i) => {
      if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="bg-mint-tint px-1.5 py-0.5 font-mono text-[0.85em] text-accent"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-medium text-fg">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const cls =
          "text-accent underline decoration-line underline-offset-4 transition-colors hover:decoration-accent";
        return link[2].startsWith("http") ? (
          <a
            key={i}
            href={link[2]}
            className={cls}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link[1]}
          </a>
        ) : (
          <Link key={i} href={link[2]} className={cls}>
            {link[1]}
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
}

const TEXT = "max-w-[68ch] text-[15.5px] leading-[1.8] text-muted";

/** Renders a page's content blocks. Server component — code blocks are
 *  highlighted here and handed to the client copy control as HTML. */
export default async function DocRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className={`mt-5 ${TEXT}`}>
                {renderInline(block.text)}
              </p>
            );

          case "h2":
            return (
              <h2
                key={i}
                id={slugify(block.text)}
                className="mt-14 scroll-mt-28 border-t border-line pt-8 text-[1.5rem] font-medium tracking-[-0.02em] text-fg"
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                id={slugify(block.text)}
                className="mt-9 scroll-mt-28 text-[1.1rem] font-medium tracking-[-0.01em] text-fg"
              >
                {block.text}
              </h3>
            );

          case "ul":
            return (
              <ul key={i} className={`mt-5 space-y-2.5 ${TEXT}`}>
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.7em] size-1.5 shrink-0 bg-mint"
                    />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol
                key={i}
                className={`mt-5 list-decimal space-y-2.5 pl-5 marker:font-mono marker:text-accent ${TEXT}`}
              >
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            );

          case "note":
            return (
              <div
                key={i}
                className="mt-7 max-w-[68ch] border-l-2 border-accent bg-mint-tint px-5 py-4"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  Note
                </div>
                <p className="mt-1.5 text-[15px] leading-[1.75] text-muted">
                  {renderInline(block.text)}
                </p>
              </div>
            );

          case "table":
            return (
              <div key={i} className="mt-7 overflow-x-auto">
                <table className="w-full border-collapse text-left text-[14.5px]">
                  <thead>
                    <tr>
                      {block.head.map((cell, j) => (
                        <th
                          key={j}
                          scope="col"
                          className="border-b border-line-2 px-3 py-2.5 font-mono text-[10.5px] font-normal uppercase tracking-[0.18em] text-faint"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className={`border-b border-line px-3 py-3 align-top ${
                              k === 0 ? "text-fg" : "text-muted"
                            }`}
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "code": {
            const htmlPromise = highlight(block.code, block.lang);
            return <AsyncCode key={i} block={block} htmlPromise={htmlPromise} />;
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

/** Small async bridge so `highlight` can run inside a server component. */
async function AsyncCode({
  block,
  htmlPromise,
}: {
  block: Extract<Block, { type: "code" }>;
  htmlPromise: Promise<string>;
}) {
  const html = await htmlPromise;
  return (
    <CodeBlock
      html={html}
      code={block.code}
      lang={block.lang}
      label={block.filename ?? block.lang}
    />
  );
}