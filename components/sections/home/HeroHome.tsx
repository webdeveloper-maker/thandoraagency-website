"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type PointerEvent } from "react";
import { PillButton } from "@/components/ui/PillButton";
import { TypingLoop } from "@/components/ui/TypingLoop";
import { ease } from "@/lib/motion";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/home/HeroHome.module.css";
import { asset } from "@/lib/asset";

/**
 * Home hero (Figma "Featured service" 624:4121).
 *
 * Desktop: a pinned scroll scene. Scene 1 is the temple arch exactly as in
 * Figma; scrolling hands over to the hidden Figma layer — the typing
 * headline "BECOME THE BRAND PEOPLE REMEMBER." with the king, then the stone
 * scholar, sliding in from the bottom and right.
 * Mobile / reduced motion: the two scenes simply stack.
 */
export function HeroHome() {
  const wrapRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const pinned = useMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
  const canHover = useMedia("(hover: hover) and (pointer: fine)");

  const { scrollYProgress: p } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  // Mouse parallax for the pillars (±8px), desktop only.
  const mx = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 80, damping: 20 });
  const onPointerMove = (e: PointerEvent) => {
    if (!canHover || reduce) return;
    mx.set(((e.clientX / window.innerWidth) * 2 - 1) * 8);
  };

  // Scene 1 exits
  const s1Opacity = useTransform(p, [0.12, 0.34], [1, 0]);
  const s1Y = useTransform(p, [0.1, 0.34], [0, -60]);
  const pillarL = useTransform(p, [0.05, 0.34], ["0%", "-55%"]);
  const pillarR = useTransform(p, [0.05, 0.34], ["0%", "55%"]);
  const archY = useTransform(p, [0.05, 0.34], ["0%", "-110%"]);

  // Scene 2 enters
  const s2Opacity = useTransform(p, [0.24, 0.42], [0, 1]);
  const typeY = useTransform(p, [0.28, 0.46], [40, 0]);
  const kingY = useTransform(p, [0.4, 0.62, 0.72, 0.86], ["100%", "0%", "0%", "105%"]);
  const scholarX = useTransform(p, [0.74, 0.92], ["110%", "0%"]);

  const live = pinned && !reduce;

  return (
    <section ref={wrapRef} className={styles.wrap} aria-label="Introduction">
      <div className={styles.stage} onPointerMove={onPointerMove}>
        {/* Scene 1 — temple arch */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.bg} src={asset("/images/hero-bg.avif")} alt="" width={1440} height={910} fetchPriority="high" />

        <motion.div className={styles.scene1} style={live ? { opacity: s1Opacity } : undefined}>
          <motion.div
            className={`${styles.pillar} ${styles.pillarLeft}`}
            initial={reduce ? false : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: ease.out }}
          >
            <motion.div className={styles.pillarScroll} style={live ? { x: pillarL } : undefined}>
              <motion.img
                src={asset("/images/hero-pillar.avif")}
                alt=""
                width={577}
                height={923}
                fetchPriority="high"
                style={live ? { x: smx } : undefined}
              />
            </motion.div>
          </motion.div>
          <motion.div
            className={`${styles.pillar} ${styles.pillarRight}`}
            initial={reduce ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: ease.out }}
          >
            <motion.div className={styles.pillarScroll} style={live ? { x: pillarR } : undefined}>
              <motion.img
                src={asset("/images/hero-pillar.avif")}
                alt=""
                width={577}
                height={923}
                fetchPriority="high"
                style={live ? { x: smx } : undefined}
              />
            </motion.div>
          </motion.div>
          <motion.div className={styles.arch} style={live ? { y: archY } : undefined}>
            <motion.img
              src={asset("/images/hero-arch.avif")}
              alt=""
              width={1122}
              height={369}
              initial={reduce ? false : { opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: ease.out }}
            />
          </motion.div>

          <motion.div className={styles.content} style={live ? { y: s1Y } : undefined}>
            <motion.img
              className={styles.logo}
              src={asset("/images/brand-logo-stacked.avif")}
              alt="Thandora — Whoever has ears, let them hear."
              width={521}
              height={449}
              fetchPriority="high"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: ease.out, delay: 0.15 }}
            />
            <h1 className={styles.headline}>
              <motion.span
                className={styles.line}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: ease.out, delay: 0.35 }}
              >
                Make Your <span className="t-blue">Brand</span> heard,
              </motion.span>
              <motion.span
                className={styles.line}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: ease.out, delay: 0.45 }}
              >
                Make Your <span className="t-navy">Business</span> <span className="t-blue">Grow.</span>
              </motion.span>
            </h1>
            <motion.p
              className={styles.sub}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: ease.out, delay: 0.55 }}
            >
              We help businesses stand out in the digital world through strategic marketing, creative solutions and
              powerful digital experience
            </motion.p>
            <motion.div
              className={styles.cta}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: ease.out, delay: 0.65 }}
            >
              <PillButton href="/contact/" size="sm">
                Let’s Talk
              </PillButton>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scene 2 — typing headline (hidden layer in Figma) */}
        <motion.div className={styles.scene2} style={live ? { opacity: s2Opacity } : undefined} aria-hidden={live ? undefined : true}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.bg} src={asset("/images/hero2-bg.avif")} alt="" width={1440} height={910} loading="lazy" />
          <motion.div className={styles.typing} style={live ? { y: typeY } : undefined}>
            <TypingLoop />
          </motion.div>
          <motion.img
            className={styles.king}
            src={asset("/images/hero2-king.avif")}
            alt=""
            width={880}
            height={557}
            loading="lazy"
            style={live ? { y: kingY } : undefined}
          />
          <motion.img
            className={styles.scholar}
            src={asset("/images/hero2-scholar.avif")}
            alt=""
            width={382}
            height={597}
            loading="lazy"
            style={live ? { x: scholarX } : undefined}
          />
        </motion.div>
      </div>

      {/* Mobile / reduced-motion: scene 2 as its own block */}
      <div className={styles.stacked}>
        <TypingLoop />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/hero2-king.avif")} alt="" width={880} height={557} loading="lazy" />
      </div>
    </section>
  );
}
