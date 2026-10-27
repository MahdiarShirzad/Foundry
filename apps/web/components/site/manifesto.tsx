"use client";

import { motion, useReducedMotion } from "motion/react";
import Eyebrow from "./eyebrow";
import Reveal from "./reveal";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Eight points, deliberately tangled into disconnected pairs. */
const SCATTER_POINTS: [number, number][] = [
  [42, 40],
  [120, 26],
  [212, 44],
  [264, 98],
  [214, 144],
  [126, 134],
  [44, 112],
  [152, 86],
];
const SCATTER_EDGES: [number, number][] = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7],
];

/* The same eight points, ordered into one continuous line. */
const PIPE_X0 = 22;
const PIPE_X1 = 270;
const PIPE_STEP = (PIPE_X1 - PIPE_X0) / 7;

const panelVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export default function Manifesto() {
  const reduce = useReducedMotion();
  const initial = reduce ? "show" : "hidden";

  return (
    <section
      id="problem"
      aria-labelledby="problem-title"
      className="scroll-mt-16 border-b border-line"
    >
      <div className="px-6 py-20 sm:px-10 sm:py-28">
        <Reveal>
          <Eyebrow>Sec. 01 — Fragmentation</Eyebrow>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2
              id="problem-title"
              className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.03em]"
            >
              <span className="block">
                Most tools solve one problem exceptionally well.
              </span>
              <span className="mt-2 block text-accent">
                Foundry solves the fragmentation between them.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[52ch] text-[16.5px] leading-[1.75] text-muted">
              A startup isn&apos;t just an idea, a roadmap, or a launch campaign. It&apos;s
              a sequence of interconnected decisions made under uncertainty — which is why
              every stage of building should inform the next.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Disconnected tools */}
          <motion.figure
            initial={initial}
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            variants={panelVariants}
            className="border border-line bg-panel p-5"
          >
            <figcaption className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
              <span className="text-faint">Scattered</span>
              <span className="text-faint">Context lost between tools</span>
            </figcaption>
            <svg
              viewBox="0 0 300 170"
              className="mt-4 h-auto w-full"
              role="img"
              aria-label="Eight disconnected tool pairs with no shared context"
            >
              {/* Opacity-only entrance: pathLength would override the dashed
                  stroke pattern and leave these edges solid. */}
              {SCATTER_EDGES.map(([a, b]) => (
                <motion.line
                  key={`${a}-${b}`}
                  x1={SCATTER_POINTS[a][0]}
                  y1={SCATTER_POINTS[a][1]}
                  x2={SCATTER_POINTS[b][0]}
                  y2={SCATTER_POINTS[b][1]}
                  stroke="var(--line-2)"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { duration: 0.7, ease: EASE },
                    },
                  }}
                />
              ))}
              {SCATTER_POINTS.map(([x, y], i) => (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4.5"
                  fill="var(--faint)"
                  variants={{
                    hidden: { opacity: 0, scale: 0.4 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.4, ease: EASE },
                    },
                  }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                />
              ))}
            </svg>
          </motion.figure>

          {/* One connected cycle */}
          <motion.figure
            initial={initial}
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            variants={panelVariants}
            className="border border-line bg-panel p-5"
          >
            <figcaption className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
              <span className="text-accent">Connected</span>
              <span className="text-faint">Every stage informs the next</span>
            </figcaption>
            <svg
              viewBox="0 0 300 170"
              className="mt-4 h-auto w-full"
              role="img"
              aria-label="The same eight stages joined into one continuous line"
            >
              {/* Base track — a continuous teal line. Opacity entrance on purpose:
                  pathLength animations on this element could get stuck at their hidden
                  state (stroke-dasharray "0 1") and leave the line invisible. */}
              <motion.line
                x1={PIPE_X0}
                y1={88}
                x2={PIPE_X1}
                y2={88}
                stroke="var(--accent)"
                strokeWidth="1.6"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 0.35,
                    transition: { duration: 0.9, ease: EASE },
                  },
                }}
              />
              {/* Current along the line — opacity-only entrance so the CSS flow
                  animation keeps its own dash pattern and runs continuously. */}
              <motion.line
                x1={PIPE_X0}
                y1={88}
                x2={PIPE_X1}
                y2={88}
                stroke="var(--accent)"
                strokeWidth="1.6"
                strokeDasharray="3 7"
                className="flow flow-slow"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 0.9,
                    transition: { duration: 0.7, delay: 0.9, ease: EASE },
                  },
                }}
              />
              <motion.polygon
                points="268,82.5 278,88 268,93.5"
                fill="var(--accent)"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { duration: 0.3 } },
                }}
              />
              {Array.from({ length: 8 }, (_, i) => {
                const x = PIPE_X0 + i * PIPE_STEP;
                return (
                  <motion.g
                    key={i}
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { duration: 0.35, delay: 0.25 + i * 0.06 },
                      },
                    }}
                  >
                    <circle cx={x} cy={88} r="5" fill="var(--panel)" stroke="var(--fg)" strokeWidth="1.4" />
                    <text
                      x={x}
                      y={112}
                      textAnchor="middle"
                      fill="var(--faint)"
                      fontSize="10"
                      fontFamily="var(--font-geist-mono)"
                    >
                      {i + 1}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}