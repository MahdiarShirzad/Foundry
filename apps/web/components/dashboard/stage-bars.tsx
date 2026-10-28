"use client";

type Row = { id: string; name: string; verb: string; count: number };

/**
 * Horizontal bars for initiatives per stage. Rows are buttons because
 * selecting a stage is a real, local view state (it narrows the attention list).
 */
export default function StageBars({
  rows,
  selected,
  onSelect,
}: {
  rows: Row[];
  selected: string | null;
  onSelect: (stageId: string | null) => void;
}) {
  const max = Math.max(1, ...rows.map((row) => row.count));

  return (
    <div>
      <ul className="space-y-[3px]">
        {rows.map((row) => {
          const active = selected === row.id;
          return (
            <li key={row.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(active ? null : row.id)}
                className="group block w-full py-[5px] text-left"
              >
                <span className="flex items-baseline gap-2">
                  <span
                    className={`font-mono text-[9.5px] tracking-[0.14em] ${
                      active ? "text-accent" : "text-faint"
                    }`}
                  >
                    {row.id}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-[12.5px] transition-colors ${
                      active ? "text-accent" : "text-fg group-hover:text-accent"
                    }`}
                  >
                    {row.name}
                  </span>
                  <span className="font-mono text-[10px] text-faint">
                    {row.count === 0 ? "—" : row.count}
                  </span>
                </span>
                <span aria-hidden className="mt-1.5 block h-[3px] bg-line">
                  <span
                    className="block h-full bg-accent transition-[width,opacity] duration-300"
                    style={{
                      width: `${(row.count / max) * 100}%`,
                      opacity: active ? 1 : row.count === 0 ? 0 : 0.55,
                    }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-2.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
          {selected ? "filtering attention list" : "select a stage to filter"}
        </p>
        {selected ? (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
