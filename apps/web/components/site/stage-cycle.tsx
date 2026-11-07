"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Plate from "./plate";
import { STAGES } from "./data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const RING_R = 38;

function nodePosition(index: number) {
  const angle = ((-90 + index * 45) * Math.PI) / 180;
  return {
    left: 50 + RING_R * Math.cos(angle),
    top: 50 + RING_R * Math.sin(angle),
  };
}

/** Interactive stage cycle diagram: hover a node to inspect a stage, click to
 *  open it in the index below. Requires client state for the active stage. */
export default function StageCycle() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const activeStage = active === null ? null : STAGES[active];
  return (
    <div className="relative lg:col-span-5">
      <div
        aria-hidden
        className="absolute inset-y-12 left-0 hidden w-px bg-[linear-gradient(to_bottom,transparent,var(--line)_16%,var(--line)_84%,transparent)] lg:block"
      />
      <div
        aria-hidden
        className="absolute left-0 top-1/2 hidden size-1.5 -translate-x-1/2 -translate-y-1/2 bg-mint lg:block"
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        className="relative lg:pl-8"
      >
        <Plate
          className="mx-auto w-full max-w-[440px]"
          bodyClassName="p-4 sm:p-6"
          footer={
            <div className="min-h-[118px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeStage?.id ?? "loop"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {activeStage ? (
                    <>
                      <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                        <span>{activeStage.id}</span>
                        <span className="text-faint">{activeStage.verb}</span>
                      </div>
                      <p className="mt-2 text-lg font-medium tracking-tight">{activeStage.name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {activeStage.tagline}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                        The loop
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        Eight connected stages. Evidence moves forward, insights cycle back to
                        the Idea Lab. Hover a node to inspect a stage — click to open it in
                        the index below.
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          }
        >
          <div
            className="relative mx-auto aspect-square w-full"
            onMouseLeave={() => setActive(null)}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <motion.circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.35"
                className="text-line-2"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.8"
                strokeDasharray="3 7"
                className="flow"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              />
              {STAGES.map((stage, i) => {
                const mid = ((-90 + i * 45 + 22.5) * Math.PI) / 180;
                const x = 50 + RING_R * Math.cos(mid);
                const y = 50 + RING_R * Math.sin(mid);
                return (
                  <motion.polygon
                    key={stage.id}
                    points="-1.8,-1.3 1.9,0 -1.8,1.3"
                    fill="var(--accent)"
                    opacity={0.75}
                    transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(-90 + i * 45 + 22.5 + 90).toFixed(1)})`}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 0.75 }}
                    transition={{ duration: 0.4, delay: 1.2 + i * 0.04 }}
                  />
                );
              })}
            </svg>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3"
            >
              <Image
                src="/icon.png"
                alt=""
                width={316}
                height={314}
                className="w-[21%] max-w-[88px]"
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-faint">
                The cycle
              </span>
            </div>

            {STAGES.map((stage, i) => {
              const pos = nodePosition(i);
              const isActive = active === i;
              return (
                <motion.a
                  key={stage.id}
                  href={`#stage-${stage.id}`}
                  aria-label={`Stage ${stage.id} — ${stage.name}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  initial={reduce ? false : { opacity: 0, scale: 0.6, x: "-50%", y: "-50%" }}
                  animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                  transition={{ duration: 0.45, delay: 0.75 + i * 0.05, ease: EASE }}
                  style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                  className={`absolute flex size-9 items-center justify-center rounded-full border font-mono text-[12px] transition-colors duration-200 sm:size-10 ${
                    isActive
                      ? "border-ink bg-ink text-mint"
                      : "border-line-2 bg-panel text-faint hover:border-accent hover:text-accent"
                  }`}
                >
                  {stage.id}
                </motion.a>
              );
            })}
          </div>
        </Plate>
      </motion.div>
    </div>
  );
}
