"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { processSteps } from "@/content/home";
import { GridDecor, Mandala } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { scrollRange } from "@/lib/motion";
import { u } from "@/lib/u";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/home/HowWeDoIt.module.css";
import { asset } from "@/lib/asset";

/** Temple frame shown for each step (the step 4 file is the finished temple). */
const FRAME_ORDER = [0, 1, 2, 4, 3];
const finished = processSteps[FRAME_ORDER[FRAME_ORDER.length - 1]].image;
const last = processSteps.length - 1;

/*
 * Scroll timeline of the pinned section (0 → 1), as in the Figma prototype:
 *   0    – 0.10  rest: intro, the finished temple, the note and its arrow
 *   0.10 – 0.30  the temple splits: the earlier stages appear behind it and
 *                spread right into a row, which settles onto its ground line
 *   0.33 – 0.93  the row travels left, step by step, ending on step 5
 * Scrolling back up reverses it: the row closes up into the full temple.
 */
const SPLIT = [0.1, 0.3] as const;
const ROW = [0.33, 0.93] as const;
/** The full temple stands 232 Figma px lower than the row's ground line. */
const DROP = 232;
/** Column pitch in Figma px: 583 wide + 60 gap. */
const PITCH = 643;
/** Figma px → CSS length in the pinned frame's units. */
const fu = (px: number) => `calc(${px} * var(--u))`;

type ColProps = {
  i: number;
  split: MotionValue<number>;
  textOpacity: MotionValue<number>;
  live: boolean;
  state: string;
  current: boolean;
};

/** One step: its temple stage, title and line. Stacked on the temple at rest. */
function StepCol({ i, split, textOpacity, live, state, current }: ColProps) {
  const s = processSteps[i];
  const frame = processSteps[FRAME_ORDER[i]].image;
  // At rest every column sits on the first column's spot (stacked).
  const x = useTransform(split, (t) => fu(-(1 - t) * i * PITCH));
  // The finished temple (last column) shows at rest; the earlier stages
  // appear behind it as the split begins.
  const imgOpacity = useTransform(split, (t) => (i === last ? 1 : scrollRange(t, 0, 0.35, 0, 1)));

  return (
    <motion.li
      className={`${styles.col} ${state}`}
      style={live ? { x, zIndex: i } : undefined}
      aria-current={current ? "step" : undefined}
    >
      <motion.div className={styles.figure} style={live ? { opacity: imgOpacity } : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={frame.src} alt="" width={frame.w} height={frame.h} loading="eager" fetchPriority="low" />
      </motion.div>
      <motion.div style={live ? { opacity: textOpacity } : undefined}>
        <h3>{s.title}</h3>
        <p>{s.body}</p>
      </motion.div>
    </motion.li>
  );
}

/**
 * "How we do it" (Figma "Frame 2085665682"). Desktop pins the section. At
 * rest it shows the finished temple with the note "…like this"; scrolling
 * down splits the temple into its five building stages, which spread into a
 * row and walk sideways step by step. Steps reached stay solid, the ones
 * ahead are faded.
 * Mobile / reduced motion: a swipeable row of steps, then the finished temple.
 */
export function HowWeDoIt() {
  const ref = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLOListElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const live = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)") && !reduce;
  const [active, setActive] = useState(0);
  const [spread, setSpread] = useState(false);
  const travel = useMotionValue(0);

  // How far the row travels so the last step's right edge stops at the
  // frame's right margin, measured from the layout.
  useLayoutEffect(() => {
    if (!live) return;
    const measure = () => {
      const row = rowRef.current;
      const end = endRef.current;
      const cols = row?.children;
      if (!row || !end || !cols || cols.length < 2) return;
      const lastCol = cols[cols.length - 1] as HTMLElement;
      travel.set(Math.max(0, row.offsetLeft + lastCol.offsetLeft + lastCol.offsetWidth - end.offsetLeft));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [live, travel]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const split = useTransform(p, (v) => scrollRange(v, SPLIT[0], SPLIT[1], 0, 1));
  const rowT = useTransform(p, (v) => scrollRange(v, ROW[0], ROW[1], 0, 1));
  const rowX = useTransform([rowT, travel], ([t, dist]: number[]) => -t * dist);
  const rowY = useTransform(split, (t) => fu((1 - t) * DROP));
  const noteOpacity = useTransform(p, (v) => scrollRange(v, 0.1, 0.16, 1, 0));
  const noteY = useTransform(p, (v) => scrollRange(v, 0.1, 0.16, 0, 24));
  const introOpacity = useTransform(p, (v) => scrollRange(v, 0.16, 0.26, 1, 0));
  const introY = useTransform(p, (v) => scrollRange(v, 0.16, 0.26, 0, -60));
  const textOpacity = useTransform(p, (v) => scrollRange(v, 0.24, 0.3, 0, 1));
  const barOpacity = useTransform(p, (v) => scrollRange(v, 0.26, 0.32, 0, 1));
  const barScale = useTransform(rowT, [0, 1], [1 / processSteps.length, 1]);

  useMotionValueEvent(split, "change", (t) => setSpread(t >= 0.98));
  useMotionValueEvent(rowT, "change", (t) => {
    if (live) setActive(Math.min(last, Math.round(t * last)));
  });

  return (
    <section ref={ref} className={styles.section} aria-labelledby="how-title">
      <div className={styles.stage}>
        <Mandala
          src={asset("/images/union-how.svg")}
          width={959.728}
          height={893.766}
          style={{ left: u(248), top: u(-78.42), width: u(1257.131), height: u(1227.399) }}
        />
        <GridDecor style={{ left: u(801.47), top: u(461.47) }} scale={777.055 / 714} />

        <motion.div className={styles.intro} style={live ? { opacity: introOpacity, y: introY } : undefined}>
          <SectionTitle id="how-title" lead="How we do" highlight="it" className={styles.title} />
          <Reveal>
            <p className={styles.copy}>
              Every successful digital journey starts with the right strategy. At <b>THANDORA</b>, we follow a structured
              and creative approach to understand your business, develop effective digital strategies and bring your
              brand closer to its goals.
            </p>
          </Reveal>
        </motion.div>

        <div className={styles.rowWrap}>
          <motion.ol
            ref={rowRef}
            className={styles.row}
            style={live ? { x: rowX, y: rowY } : undefined}
            aria-label="Our process"
          >
            {processSteps.map((s, i) => (
              <StepCol
                key={s.title}
                i={i}
                split={split}
                textOpacity={textOpacity}
                live={live}
                state={!live || !spread || i <= active ? styles.reached : styles.ahead}
                current={live && spread && i === active}
              />
            ))}
          </motion.ol>
          {live && (
            <motion.div className={styles.progress} style={{ opacity: barOpacity }} aria-hidden>
              <motion.span style={{ scaleX: barScale }} />
            </motion.div>
          )}
        </div>
        {/* Where the last step's right edge stops (frame x 1405). */}
        <div ref={endRef} className={styles.rowEnd} aria-hidden />

        {/* Finished temple for the unpinned layout (desktop builds it from the row). */}
        <div className={styles.temple}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={finished.src} alt="" width={finished.w} height={finished.h} loading="lazy" />
        </div>

        <motion.div className={styles.noteWrap} style={live ? { opacity: noteOpacity, y: noteY } : undefined}>
          <p className={styles.note}>
            Our <span className="t-navy">strategic approach</span> will help you builds your brands that stand strong, last
            generations, and remain unforgettable, like this
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.arrow} src={asset("/images/arrow-curl.avif")} alt="" width={196} height={116} aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
