"use client";

import { motion, useReducedMotion } from "motion/react";
import { socials } from "@/content/site";
import { GridDecor } from "@/components/ui/Decor";
import { ease } from "@/lib/motion";
import { u } from "@/lib/u";
import styles from "@/styles/sections/about/AboutHero.module.css";
import { asset } from "@/lib/asset";

/** Seconds until the page-transition curtain has cleared the screen. */
const CURTAIN = 0.7;

/**
 * About hero (Figma "Desktop - 42", Variant2 → Default). On load the two
 * reaching hands slide in from the edges, the logo fades up between them and
 * the statement rises into place.
 */
export function AboutHero() {
  const reduce = useReducedMotion();
  // Starts once the page curtain (app/template: 250ms delay + 500ms sweep)
  // has lifted; otherwise most of the slide played hidden behind it.
  const t = (delay = 0) => ({ duration: 1.3, ease: ease.out, delay: CURTAIN + delay });

  return (
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <GridDecor style={{ left: u(766.31), top: u(-125.69) }} scale={900.382 / 714} />
      <GridDecor style={{ left: u(-146.69), top: u(142.31) }} scale={900.382 / 714} />

      <motion.div
        className={styles.union}
        aria-hidden
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={t()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/about/hero/about-union.svg")} alt="" width={741} height={690} />
      </motion.div>

      <motion.div
        className={styles.handLeft}
        aria-hidden
        initial={reduce ? false : { x: "-75%", y: "35%" }}
        animate={{ x: 0, y: 0 }}
        transition={t(0.1)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/about/hero/about-hand-human.avif")} alt="" width={623} height={516} fetchPriority="high" />
      </motion.div>

      <motion.div
        className={styles.handRight}
        aria-hidden
        initial={reduce ? false : { x: "75%", y: "-35%" }}
        animate={{ x: 0, y: 0 }}
        transition={t(0.1)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/about/hero/about-hand-robot.avif")} alt="" width={613} height={476} fetchPriority="high" />
      </motion.div>

      <motion.img
        className={styles.logo}
        src={asset("/images/brand/brand-logo-stacked.avif")}
        alt="Thandora — Whoever has ears, let them hear."
        width={398}
        height={352}
        initial={reduce ? false : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.5)}
      />

      <motion.ul
        className={styles.socials}
        initial={reduce ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t(0.6)}
      >
        {socials.map((s) => (
          <li key={s.id}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.icon} alt="" width={s.iconSize.w} height={s.iconSize.h} />
              <span className={styles.handle}>
                <span className={styles.handleLabel}>{s.label}</span>
                <span className={styles.handleValue}>{s.handle}</span>
              </span>
            </a>
          </li>
        ))}
      </motion.ul>

      {/* Hand-drawn arrow (Figma): curves up from the statement to the
          tagline, drawing itself in once the hero has settled. */}
      <svg className={styles.arrow} viewBox="0 0 60 92" fill="none" aria-hidden>
        <motion.path
          d="M56 88C34 80 14 56 15 14"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={t(0.9)}
        />
        <motion.path
          d="M7.5 20 15.5 3 23 19.5Z"
          fill="currentColor"
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={t(1.5)}
          style={{ transformOrigin: "15px 12px" }}
        />
      </svg>

      <motion.h1
        id="about-hero-title"
        className={styles.statement}
        initial={reduce ? false : { opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.3)}
      >
        A place where the best of <span className="t-blue">tradition Legacy</span> and{" "}
        <span className="t-blue">modern technology </span>
        come together to create experiences that stick with people long after the first impression.
      </motion.h1>
    </section>
  );
}
