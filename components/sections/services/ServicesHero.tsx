"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { GridDecor } from "@/components/ui/Decor";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { asset } from "@/lib/asset";
import { ease } from "@/lib/motion";
import { u } from "@/lib/u";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/services/ServicesHero.module.css";

/** The page curtain (app/template) has lifted by about this point. */
const BASE = 0.55;

const LINES: ReactNode[] = [
  "Every service that",
  <>
    your <span className="t-blue">brand</span> needs
  </>,
  "to be remembered.",
];

/**
 * Services hero (Figma "Desktop - 37"). On load the temple is assembled in
 * three layers, each rising out of the ground line: the front pavilion,
 * then the long hall, then the gopuram.
 * The note fades in and its arrow draws down to the temple.
 *
 * Desktop also gives the layers depth on scroll: the far tower lags behind
 * the nearer buildings as the hero scrolls away.
 */
export function ServicesHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 1024px)");
  const depth = desktop && !reduce;

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const far = useTransform(p, [0, 1], [0, 220]);
  const mid = useTransform(p, [0, 1], [0, 120]);
  const near = useTransform(p, [0, 1], [0, 40]);
  const text = useTransform(p, [0, 1], [0, -80]);
  const mark = useTransform(p, [0, 1], [0, 160]);
  const y = (v: MotionValue<number>) => (depth ? { y: v } : undefined);

  const t = (delay: number, duration = 0.9) =>
    reduce ? { duration: 0 } : { duration, ease: ease.out, delay: BASE + delay };

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="services-hero-title">
      <motion.div className={styles.mark} aria-hidden style={y(mark)}>
        <motion.img
          src={asset("/images/brand/thandora-gradient.avif")}
          alt=""
          width={1050}
          height={1073}
          initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={t(0, 1.6)}
        />
      </motion.div>

      <div className={styles.frame}>
        <GridDecor className={styles.grid} style={{ left: u(23), top: u(108) }} />

        <motion.div className={styles.copy} style={y(text)}>
          <motion.p
            className={styles.eyebrow}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0, 0.6)}
          >
            Services
          </motion.p>
          <h1 id="services-hero-title" className={styles.title}>
            {LINES.map((line, i) => (
              <span key={i} className={styles.line}>
                <motion.span
                  className={styles.lineInner}
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={t(0.05 + i * 0.09, 0.8)}
                >
                  {line}
                </motion.span>{" "}
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.p
          className={styles.note}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(1.05, 0.7)}
        >
          Our <span className="t-navy">Services</span> will help you build your brands that stand strong, last
          generations, and remain unforgettable, like this
        </motion.p>

        <motion.div
          className={styles.scrollCue}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(1.6, 0.6)}
        >
          <ScrollCue />
        </motion.div>

        {/* Hand-drawn arrow from the note down to the temple; it draws itself in. */}
        <svg className={styles.arrow} viewBox="0 0 60 92" fill="none" aria-hidden>
          <motion.path
            d="M56 4C34 12 14 36 15 78"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={t(1.3, 0.6)}
          />
          <motion.path
            d="M7.5 72 15.5 89 23 72.5Z"
            fill="currentColor"
            initial={reduce ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={t(1.82, 0.25)}
            style={{ transformOrigin: "15px 80px" }}
          />
        </svg>
      </div>

      {/* The temple stands on the hero's bottom edge, flush with the left edge
          of the screen (not the centred frame). It is built from the ground
          up, front to back: the front pavilion rises first, then the long
          hall, then the gopuram, each out of the ground line. */}
      <div className={styles.temple} aria-hidden>
        <motion.div className={styles.tower} style={y(far)}>
          <motion.img
            src={asset("/images/services/hero/services-temple-tower.avif")}
            alt=""
            width={780}
            height={734}
            fetchPriority="high"
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            transition={t(0.6, 1.1)}
          />
        </motion.div>
        <motion.div className={styles.middle} style={y(mid)}>
          <motion.img
            src={asset("/images/services/hero/services-temple-middle.avif")}
            alt=""
            width={1468}
            height={417}
            fetchPriority="high"
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            transition={t(0.35, 1)}
          />
        </motion.div>
        <motion.div className={styles.front} style={y(near)}>
          <motion.img
            src={asset("/images/services/hero/services-temple-front.avif")}
            alt=""
            width={816}
            height={360}
            fetchPriority="high"
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            transition={t(0.05, 0.9)}
          />
        </motion.div>
      </div>
    </section>
  );
}
