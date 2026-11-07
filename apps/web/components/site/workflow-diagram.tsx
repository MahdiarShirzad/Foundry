"use client";

import { motion, useReducedMotion } from "motion/react";
import { STAGES } from "./data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TOP_Y = 90;
const BOTTOM_Y = 250;
const TOP_X = [60, 320, 580, 840];
const BOTTOM_X = [840, 580, 320, 160];

const MAIN_PATH = "M 60 90 H 840 Q 940 90 940 170 Q 940 250 840 250 H 160";
const FEEDBACK_PATH = "M 160 250 Q 60 250 60 175 L 60 118";

type Station = { id: string; x: number; y: number; verb: string; name: string };

const STATION_LAYOUT: Station[] = STAGES.map((stage, i) =>
  i < 4
    ? { id: stage.id, x: TOP_X[i], y: TOP_Y, verb: stage.verb, name: stage.name }
    : { id: stage.id, x: BOTTOM_X[i - 4], y: BOTTOM_Y, verb: stage.verb, name: stage.name },
);

export default function WorkflowDiagram() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: {} }}
      className="relative mt-14"
    >
      <svg
        viewBox="0 0 1000 320"
        className="h-auto w-full"
        role="img"
        aria-label="The eight-stage workflow drawn as a continuous line, closing with an insights-and-iteration loop back to stage one"
      >
        <motion.path
          d={MAIN_PATH}
          fill="none"
          stroke="var(--line-2)"
          strokeWidth="1.4"
          variants={{
            hidden: { pathLength: 0 },
            show: { pathLength: 1, transition: { duration: 1.1, ease: EASE } },
          }}
        />
        <motion.path
          d={MAIN_PATH}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeDasharray="3 7"
          className="flow"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 0.85, transition: { duration: 0.6, delay: 1.05 } },
          }}
        />
        <motion.path
          d={FEEDBACK_PATH}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.4"
          opacity={0.55}
          variants={{
            hidden: { pathLength: 0 },
            show: { pathLength: 1, transition: { duration: 0.8, delay: 1.3, ease: EASE } },
          }}
        />
        <motion.path
          d={FEEDBACK_PATH}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeDasharray="3 7"
          className="flow flow-slow"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 0.9, transition: { duration: 0.5, delay: 2.0 } },
          }}
        />
        <motion.polygon
          points="60,105 55,117 65,117"
          fill="var(--accent)"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.3, delay: 2.05 } },
          }}
        />
        <motion.text
          x={74}
          y={158}
          fill="var(--accent)"
          fontSize="11"
          letterSpacing="2.4"
          fontFamily="var(--font-geist-mono)"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.5, delay: 2.2 } },
          }}
        >
          INSIGHTS & ITERATION
        </motion.text>

        {STATION_LAYOUT.map((station, i) => {
          const isTop = station.y === TOP_Y;
          const verbY = isTop ? station.y + 30 : station.y - 21;
          const nameY = isTop ? station.y + 47 : station.y - 39;
          return (
            <motion.a
              key={station.id}
              href={`#stage-${station.id}`}
              aria-label={`Stage ${station.id} — ${station.name}`}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { duration: 0.4, delay: 0.7 + i * 0.08 },
                },
              }}
            >
              <circle
                cx={station.x}
                cy={station.y}
                r="13"
                fill="var(--panel)"
                stroke="var(--line-2)"
                strokeWidth="1.2"
              />
              <text
                x={station.x}
                y={station.y + 3.8}
                textAnchor="middle"
                fill="var(--fg)"
                fontSize="10.5"
                fontFamily="var(--font-geist-mono)"
              >
                {station.id}
              </text>
              <text
                x={station.x}
                y={verbY}
                textAnchor="middle"
                fill="var(--accent)"
                fontSize="11"
                letterSpacing="1.6"
                fontFamily="var(--font-geist-mono)"
              >
                {station.verb.toUpperCase()}
              </text>
              <text
                x={station.x}
                y={nameY}
                textAnchor="middle"
                fill="var(--fg)"
                fontSize="14"
                fontFamily="var(--font-geist-sans)"
              >
                {station.name}
              </text>
            </motion.a>
          );
        })}
      </svg>

      <ol className="lg:hidden">
        {STAGES.map((stage, i) => (
          <motion.li
            key={stage.id}
            className={`relative border-l border-line pl-6 ${i === STAGES.length - 1 ? "pb-4" : "pb-5"}`}
            variants={{
              hidden: { opacity: 0, x: -10 },
              show: { opacity: 1, x: 0, transition: { duration: 0.45, delay: i * 0.07 } },
            }}
          >
            <span
              aria-hidden
              className="absolute -left-[3.5px] top-1.5 size-2 rounded-full bg-accent"
            />
            <a href={`#stage-${stage.id}`} className="block">
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] text-faint">{stage.id}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  {stage.verb}
                </span>
                <span className="text-[15.5px] font-medium tracking-tight">
                  {stage.name}
                </span>
              </span>
            </a>
          </motion.li>
        ))}
        <motion.li
          className="relative border-l border-line pl-6"
          variants={{
            hidden: { opacity: 0, x: -10 },
            show: { opacity: 1, x: 0, transition: { duration: 0.45, delay: 0.6 } },
          }}
        >
          <span
            aria-hidden
            className="absolute -left-[3.5px] top-1.5 size-2 rounded-full border border-accent bg-bg"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            ↺ Insights & iteration → stage 01
          </span>
        </motion.li>
      </ol>
    </motion.div>
  );
}
