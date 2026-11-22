"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { processSteps } from "@/content/home";
import { GridDecor, Mandala } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ease } from "@/lib/motion";
import { u } from "@/lib/u";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/home/HowWeDoIt.module.css";
import { asset } from "@/lib/asset";

/** Build-up order of the temple frames (step 4 file is the finished temple). */
const FRAME_ORDER = [0, 1, 2, 4, 3];

/**
 * "How we do it" (Figma "Frame 2085665682"). Desktop pins the section: as you
 * scroll, the temple is built up frame by frame and each process step lights
 * up beneath it. Mobile lists the steps with the finished temple.
 */
export function HowWeDoIt() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const pinned = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const live = pinned && !reduce;
  const [step, setStep] = useState(0);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const templeScale = useTransform(p, [0, 0.25], [1.05, 1]);
  useMotionValueEvent(p, "change", (v) => {
    if (!live) return;
    setStep(Math.min(processSteps.length - 1, Math.max(0, Math.floor(v * processSteps.length * 1.05))));
  });

  const shownStep = live ? step : processSteps.length - 1;
  const frame = processSteps[FRAME_ORDER[shownStep]].image;

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

        <div className={styles.intro}>
          <SectionTitle id="how-title" lead="How we do" highlight="it" className={styles.title} />
          <Reveal>
            <p className={styles.copy}>
              Every successful digital journey starts with the right strategy. At <b>THANDORA</b>, we follow a structured
              and creative approach to understand your business, develop effective digital strategies and bring your
              brand closer to its goals.
            </p>
          </Reveal>
        </div>

        <motion.div className={styles.temple} style={live ? { scale: templeScale } : undefined}>
          <AnimatePresence initial={false}>
            <motion.img
              key={frame.src}
              src={frame.src}
              alt=""
              width={frame.w}
              height={frame.h}
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: ease.out }}
              style={{ aspectRatio: `${frame.w} / ${frame.h}` }}
            />
          </AnimatePresence>
        </motion.div>

        <Reveal className={styles.note}>
          <p>
            Our <span className="t-navy">strategic approach</span> will help you builds your brands that stand strong, last
            generations, and remain unforgettable, like this
          </p>
        </Reveal>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.arrow} src={asset("/images/arrow-curl.avif")} alt="" width={196} height={116} aria-hidden />

        <ol className={styles.steps} aria-label="Our process">
          {processSteps.map((s, i) => (
            <li
              key={s.title}
              className={`${styles.step} ${i === shownStep ? styles.stepActive : ""} ${i < shownStep ? styles.stepDone : ""}`}
              aria-current={live && i === shownStep ? "step" : undefined}
            >
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        {live && (
          <div className={styles.progress} aria-hidden>
            {processSteps.map((s, i) => (
              <span key={s.title} className={i <= shownStep ? styles.progressOn : ""} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
