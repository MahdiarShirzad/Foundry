"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Eyebrow from "./eyebrow";
import { STAGES } from "./data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** The index of the ecosystem: a ledger of the eight stages. Rows expand in
 *  place; the hero's cycle nodes deep-link here via #stage-01 … #stage-08. */
export default function Stages() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>("01");

  useEffect(() => {
    let settleTimer: number | undefined;

    const applyHash = () => {
      const match = window.location.hash.match(/^#stage-(\d{2})$/);
      if (!match) return;
      const id = match[1];
      setOpenId(id);

      // The ledger reflows while panels swap, so the browser's own fragment
      // scroll can land on the row's pre-reflow position — re-align once settled.
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        const row = document.getElementById(`stage-${id}`);
        if (!row) return;
        const delta = Math.abs(row.getBoundingClientRect().top - 80);
        if (delta > 12) {
          row.scrollIntoView({ behavior: "instant", block: "start" });
        }
      }, 500);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => {
      window.removeEventListener("hashchange", applyHash);
      window.clearTimeout(settleTimer);
    };
  }, []);

  return (
    <section
      id="stages"
      aria-labelledby="stages-title"
      className="scroll-mt-16 border-b border-line"
    >
      <div className="px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Eyebrow>Sec. 02 — The ecosystem</Eyebrow>
              <h2
                id="stages-title"
                className="mt-8 text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.03em]"
              >
                Eight stages. One continuous cycle.
              </h2>
            </motion.div>
          </div>
          <motion.div
            className="lg:col-span-5 lg:pt-3"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
          >
            <p className="max-w-[52ch] text-[16.5px] leading-[1.75] text-muted">
              From first spark to shipped product — and back again. Each stage owns its
              own domain and hands its evidence to the next. Open one to see what it
              holds.
            </p>
          </motion.div>
        </div>

        <motion.ul
          className="mt-12 border-t border-line"
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {STAGES.map((stage) => {
            const open = openId === stage.id;
            return (
              <motion.li
                key={stage.id}
                id={`stage-${stage.id}`}
                className="scroll-mt-20 border-b border-line"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                }}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : stage.id)}
                    aria-expanded={open}
                    aria-controls={`stage-panel-${stage.id}`}
                    className="group relative flex w-full items-start gap-4 py-6 text-left sm:gap-6"
                  >
                    <span
                      aria-hidden
                      className={`absolute left-0 top-0 h-full w-px origin-top bg-mint transition-transform duration-300 ${
                        open ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                      }`}
                    />
                    <span className="shrink-0 pl-4 font-mono text-[13px] text-faint transition-colors group-hover:text-accent sm:pl-5">
                      {stage.id}
                    </span>
                    <span className="hidden w-28 shrink-0 pt-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent md:block">
                      {stage.verb}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[clamp(1.15rem,2vw,1.6rem)] font-medium leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent">
                        {stage.name}
                      </span>
                      <span className="mt-1.5 block text-[14.5px] leading-snug text-muted">
                        {stage.tagline}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`mt-2 shrink-0 pr-1 font-mono text-[16px] leading-none text-faint transition-all duration-300 group-hover:text-accent ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`stage-panel-${stage.id}`}
                      initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-7 pb-9 pl-4 pr-1 sm:pl-5 md:grid-cols-[1fr_15rem] md:gap-10">
                        <div>
                          <p className="max-w-[62ch] text-[15.5px] leading-[1.7] text-muted">
                            {stage.detail}
                          </p>
                          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                            {stage.bullets.map((bullet) => (
                              <li
                                key={bullet}
                                className="flex gap-2.5 text-[14px] leading-snug text-fg"
                              >
                                <span
                                  aria-hidden
                                  className="mt-[0.45em] size-1.5 shrink-0 bg-mint"
                                />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-t border-line pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                            Hands off to
                          </div>
                          <a
                            href={`#stage-${stage.next.slice(0, 2)}`}
                            className="mt-2.5 block font-mono text-[13px] leading-relaxed text-accent transition-colors hover:text-ink"
                          >
                            {stage.next}
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}