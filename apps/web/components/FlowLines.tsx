"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/*
 * FlowLines — the page's current, drawn as a bundle of near-parallel strands.
 *
 * A single, page-height SVG sits behind the landing content (the wrapper in
 * `app/(site)/page.tsx` owns the stacking context). Every strand is one cubic
 * Bézier spine, offset a few pixels per copy and nudged at its control points,
 * so the bundle reads hand-drawn instead of mechanical.
 *
 * Tweaking:
 *   • Shape      — edit DESKTOP_SPINE / MOBILE_SPINE below. `c1` is the first
 *                  cubic's control point; each `steps[]` entry is one `S`
 *                  command (control point + endpoint). Keep y increasing.
 *   • Strands    — DESKTOP_STRANDS / MOBILE_STRANDS: `dx`/`dy` offset the whole
 *                  spine, `wobble` leans the control points apart.
 *   • Neon       — `--neon` in app/globals.css (idle is `--mint`).
 *   • Glow       — GLOW_STRENGTH below + the filter's stdDeviation.
 *   • Timing     — the per-strand scroll ranges live in `strandRanges()`.
 *
 * Reduced motion: the media query is tracked in a motion value instead of
 * `useReducedMotion()` on purpose — the hook seeds from `useState`, which
 * flips between server and client and would hydrate a different style tree.
 */

const FALLBACK_IDLE = "#4fcab5";
const FALLBACK_NEON = "#00ffc8";

/** Fraction of each path drawn at the top of the page, before any scroll. */
const MIN_DRAWN = 0.14;
/** Length of the bright tip that rides the drawing head, in path fractions. */
const COMET_LENGTH = 0.012;
/** Peak opacity of the blurred halo. Raise for a hotter line, lower to calm it. */
const GLOW_STRENGTH = 0.42;
const GLOW_FILTER_ID = "flow-lines-glow";

type Point = readonly [number, number];
type CurveStep = { c2: Point; to: Point };
type Spine = { start: Point; c1: Point; steps: CurveStep[] };
type StrandOffset = { dx: number; dy: number; wobble: number };

/* -------------------------------------------------------------------------
 * Geometry
 * ---------------------------------------------------------------------- */

/** Desktop skeleton: leaves the logo corner, sweeps right, folds back left,
 *  returns right once more and pours off the bottom edge. */
const DESKTOP_SPINE: Spine = {
  start: [150, -140],
  c1: [40, 320],
  steps: [
    { c2: [250, 640], to: [520, 900] },
    { c2: [1080, 1250], to: [1090, 1680] },
    { c2: [830, 2320], to: [610, 2500] },
    { c2: [320, 2870], to: [390, 3200] },
    { c2: [780, 3580], to: [940, 3860] },
    { c2: [1070, 4330], to: [830, 4600] },
    { c2: [400, 4940], to: [330, 5230] },
    { c2: [430, 5720], to: [560, 6120] },
  ],
};

/** Mobile skeleton: same gesture with a narrower swing, so the strands stay
 *  inside the tighter frame instead of whipping edge to edge. */
const MOBILE_SPINE: Spine = {
  start: [300, -140],
  c1: [214, 420],
  steps: [
    { c2: [330, 800], to: [470, 1060] },
    { c2: [660, 1560], to: [660, 2060] },
    { c2: [660, 2560], to: [470, 3060] },
    { c2: [300, 3560], to: [360, 4060] },
    { c2: [430, 4560], to: [520, 5060] },
    { c2: [600, 5560], to: [470, 6120] },
  ],
};

const DESKTOP_STRANDS: StrandOffset[] = [
  { dx: 0, dy: 0, wobble: 0 },
  { dx: 12, dy: 9, wobble: 9 },
  { dx: 24, dy: -7, wobble: -8 },
  { dx: 36, dy: 15, wobble: 11 },
];

/** Two strands only — the bundle is decorative, not a texture. */
const MOBILE_STRANDS: StrandOffset[] = [
  { dx: 0, dy: 0, wobble: 0 },
  { dx: 34, dy: 12, wobble: 14 },
];

function buildPath(spine: Spine, { dx, dy, wobble }: StrandOffset): string {
  const num = (value: number) => Math.round(value * 10) / 10;
  const pt = ([x, y]: Point, lean = 0) => `${num(x + dx + lean)} ${num(y + dy)}`;

  const [first, ...rest] = spine.steps;
  let d = `M${pt(spine.start)}C${pt(spine.c1, wobble)},${pt(first.c2, -wobble)},${pt(first.to)}`;

  rest.forEach((step, i) => {
    d += `S${pt(step.c2, i % 2 === 0 ? -wobble : wobble)},${pt(step.to)}`;
  });

  return d;
}

const DESKTOP_PATHS = DESKTOP_STRANDS.map((offset) =>
  buildPath(DESKTOP_SPINE, offset),
);
const MOBILE_PATHS = MOBILE_STRANDS.map((offset) => buildPath(MOBILE_SPINE, offset));

/* -------------------------------------------------------------------------
 * Colour
 * ---------------------------------------------------------------------- */

function parseColor(input: string): [number, number, number] | null {
  const hex = input.replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return [
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
    ];
  }
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  const rgb = input.match(/rgba?\(([^)]+)\)/i);
  if (!rgb) return null;
  const [r, g, b] = rgb[1].split(/[,\s/]+/).map(Number);
  return [r, g, b];
}

function mixColor(from: string, to: string, t: number): string {
  const a = parseColor(from);
  const b = parseColor(to);
  if (!a || !b) return from;
  const k = Math.min(1, Math.max(0, t));
  const channel = (i: number) => Math.round(a[i] + (b[i] - a[i]) * k);
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)})`;
}

/* -------------------------------------------------------------------------
 * Hooks
 * ---------------------------------------------------------------------- */

/** 0 → 1 across the page wrapper, smoothed so fast flicks don't snap. */
function useScrollProgress(target: React.RefObject<HTMLDivElement | null>) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  const clamped = useTransform(scrollYProgress, (value) =>
    Math.min(1, Math.max(0, value)),
  );

  return useSpring(clamped, { stiffness: 80, damping: 20, mass: 0.4 });
}

/** 1 while the visitor prefers reduced motion. Written from a listener, so no
 *  render (and no hydration difference) is involved. */
function useReducedMotionFlag() {
  const reduced = useMotionValue(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => reduced.set(query.matches ? 1 : 0);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [reduced]);

  return reduced;
}

/** Resolves the brand tokens from CSS so nothing is hardcoded twice. */
function usePalette(ref: React.RefObject<HTMLDivElement | null>) {
  const [palette, setPalette] = useState({ idle: FALLBACK_IDLE, neon: FALLBACK_NEON });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const styles = getComputedStyle(element);
    const idle = styles.getPropertyValue("--mint").trim();
    const neon = styles.getPropertyValue("--neon").trim();
    if (!parseColor(idle) || !parseColor(neon)) return;

    setPalette((prev) =>
      prev.idle === idle && prev.neon === neon ? prev : { idle, neon },
    );
  }, [ref]);

  return palette;
}

/* -------------------------------------------------------------------------
 * Strands
 * ---------------------------------------------------------------------- */

/** Each strand draws over its own slice of the scroll, so the bundle fans in
 *  instead of switching on as one line. */
function strandRanges(index: number): [number, number] {
  const start = 0.02 + index * 0.05;
  return [start, Math.min(0.98, 0.9 + index * 0.02)];
}

type StrandProps = {
  d: string;
  index: number;
  progress: MotionValue<number>;
  reduced: MotionValue<number>;
  palette: { idle: string; neon: string };
};

function Strand({
  d,
  index,
  progress,
  reduced,
  palette,
  strokeWidth,
}: StrandProps & { strokeWidth: number }) {
  const [start, end] = strandRanges(index);

  const drawn = useTransform(progress, [start, end], [MIN_DRAWN, 1]);
  const dashOffset = useTransform<number, number>([drawn, reduced], ([value, calm]) =>
    calm ? 0 : 1 - value,
  );
  const opacity = useTransform<number, number>([progress, reduced], ([value, calm]) =>
    calm ? 0.4 : 0.38 + Math.min(1, Math.max(0, value)) * 0.57,
  );
  const stroke = useTransform<number, string>([progress, reduced], ([value, calm]) => {
    if (calm) return palette.idle;
    const t = Math.min(1, Math.max(0, (value - start) / (0.82 - start)));
    return mixColor(palette.idle, palette.neon, t);
  });
  const cometOffset = useTransform<number, number>([drawn, reduced], ([value, calm]) =>
    calm ? COMET_LENGTH : COMET_LENGTH - value,
  );
  const cometOpacity = useTransform<number, number>([drawn, reduced], ([value, calm]) =>
    calm ? 0 : Math.min(1, Math.max(0, (value - 0.25) * 2.4)) * 0.9,
  );

  return (
    <g>
      <motion.path
        d={d}
        pathLength={1}
        fill="none"
        strokeDasharray="1 1"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{
          stroke,
          opacity,
          strokeDashoffset: dashOffset,
          willChange: "stroke-dashoffset",
        }}
      />
      {/* Bright tip riding the drawing head — keeps the stroke alive between
          sections without a looping dash running ahead of the draw. */}
      <motion.path
        d={d}
        pathLength={1}
        fill="none"
        stroke={palette.neon}
        strokeDasharray={`${COMET_LENGTH} ${1 - COMET_LENGTH}`}
        strokeWidth={2.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ opacity: cometOpacity, strokeDashoffset: cometOffset }}
      />
    </g>
  );
}

/** Blurred duplicate for the halo. Its own motion values keep the glow's
 *  opacity independent of the crisp stroke's. */
function GlowStrand({ d, index, progress, reduced, palette }: StrandProps) {
  const [start, end] = strandRanges(index);

  const drawn = useTransform(progress, [start, end], [MIN_DRAWN, 1]);
  const dashOffset = useTransform<number, number>([drawn, reduced], ([value, calm]) =>
    calm ? 0 : 1 - value,
  );
  const opacity = useTransform<number, number>([progress, reduced], ([value, calm]) =>
    calm
      ? 0
      : Math.min(1, Math.max(0, (value - 0.06) / 0.94)) * GLOW_STRENGTH,
  );

  return (
    <motion.path
      d={d}
      pathLength={1}
      fill="none"
      stroke={palette.neon}
      strokeDasharray="1 1"
      strokeWidth={3.4}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      style={{ opacity, strokeDashoffset: dashOffset }}
    />
  );
}

/* -------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------- */

export default function FlowLines() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(ref);
  const reduced = useReducedMotionFlag();
  const palette = usePalette(ref);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1200 6000"
        preserveAspectRatio="none"
        fill="none"
        className="h-full w-full"
      >
        <defs>
          <filter
            id={GLOW_FILTER_ID}
            x="-5%"
            y="-1%"
            width="110%"
            height="102%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="flow-blur" />
            <feMerge>
              <feMergeNode in="flow-blur" />
              <feMergeNode in="flow-blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="hidden md:block">
          <g filter={`url(#${GLOW_FILTER_ID})`}>
            {DESKTOP_PATHS.map((d, i) => (
              <GlowStrand
                key={i}
                d={d}
                index={i}
                progress={progress}
                reduced={reduced}
                palette={palette}
              />
            ))}
          </g>
          {DESKTOP_PATHS.map((d, i) => (
            <Strand
              key={i}
              d={d}
              index={i}
              progress={progress}
              reduced={reduced}
              palette={palette}
              strokeWidth={1.7}
            />
          ))}
        </g>

        <g className="block md:hidden" opacity={0.72}>
          <g filter={`url(#${GLOW_FILTER_ID})`}>
            {MOBILE_PATHS.map((d, i) => (
              <GlowStrand
                key={i}
                d={d}
                index={i}
                progress={progress}
                reduced={reduced}
                palette={palette}
              />
            ))}
          </g>
          {MOBILE_PATHS.map((d, i) => (
            <Strand
              key={i}
              d={d}
              index={i}
              progress={progress}
              reduced={reduced}
              palette={palette}
              strokeWidth={1.6}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
