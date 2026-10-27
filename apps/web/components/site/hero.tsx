"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

const HEAD_LINES = [
  { text: "One idea.", accent: false },
  { text: "Eight stages.", accent: false },
  { text: "One ecosystem.", accent: true },
];

const SPECS: [string, string][] = [
  ["Stages", "01 → 08"],
  ["Flow", "Iterative, never linear"],
  ["Stack", "Next.js · NestJS · PostgreSQL"],
];

/** Signature hero: editorial headline locked to a live diagram of the
 *  eight-stage cycle — the product's core concept, made interactive. */
export default function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const activeStage = active === null ? null : STAGES[active];

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-line"
    >
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0"
        style={{
          maskImage: "linear-gradient(180deg, rgb(0 0 0 / 0.9), transparent 88%)",
          WebkitMaskImage: "linear-gradient(180deg, rgb(0 0 0 / 0.9), transparent 88%)",
        }}
      />
      <div
        aria-hidden
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-faint xl:block"
        style={{ writingMode: "vertical-rl" }}
      >
        Foundry — the startup builder ecosystem
      </div>

      <div className="relative grid w-full items-center gap-14 px-6 py-16 sm:px-10 sm:py-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:gap-8 lg:py-24">
        <div className="lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
            className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-accent"
          >
            <span aria-hidden className="size-1.5 bg-mint" />
            The startup builder ecosystem
          </motion.p>

          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.045em]"
          >
            {HEAD_LINES.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  initial={reduce ? false : { y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.15 + i * 0.12, ease: EASE }}
                  className={`block ${line.accent ? "text-accent" : ""}`}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="mt-7 max-w-[58ch] text-[17px] leading-[1.7] text-muted"
          >
            Foundry turns raw ideas into validated, market-ready products — market
            research, validation, MVP, roadmap, launch, feedback and analytics in one
            connected workflow, so every stage informs the next.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#stages"
              className="group inline-flex h-12 items-center gap-2.5 bg-mint px-6 text-[15px] font-medium text-ink transition duration-200 hover:-translate-y-0.5 hover:brightness-95"
            >
              Explore the eight stages
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#workflow"
              className="inline-flex h-12 items-center border border-line-2 px-6 text-[15px] text-fg transition-colors hover:border-accent hover:bg-mint-tint hover:text-accent"
            >
              See how it works
            </a>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-10 flex flex-wrap items-baseline border-t border-line pt-6 font-mono"
          >
            {SPECS.map(([label, value], i) => (
              <div key={label} className={i > 0 ? "border-l border-line pl-8" : "pr-8"}>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-faint">
                  {label}
                </dt>
                <dd className="mt-1 text-[13px] text-fg">{value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <StageCycle reduce={!!reduce} active={active} setActive={setActive} activeStage={activeStage} />
      </div>
    </section>
  );
}

type CycleProps = {
  reduce: boolean;
  active: number | null;
  setActive: (index: number | null) => void;
  activeStage: (typeof STAGES)[number] | null;
};

function StageCycle({ reduce, active, setActive, activeStage }: CycleProps) {
  return (
    <div className="lg:col-span-5">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
      >
        <div
          className="relative mx-auto aspect-square w-full max-w-[440px]"
          onMouseLeave={() => setActive(null)}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {/* base ring — draws itself in */}
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
            {/* current flowing clockwise around the cycle */}
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
            {/* direction chevrons between stages */}
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

          {/* brand mark at the heart of the cycle */}
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

          {/* stage nodes */}
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

        {/* live caption for the inspected stage */}
        <div className="mx-auto mt-6 min-h-[118px] max-w-[440px] border-t border-line pt-4">
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
      </motion.div>
    </div>
  );
}