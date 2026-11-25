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
import { ScrollCue } from "@/components/ui/ScrollCue";
import { socials } from "@/content/site";
import { TypingLoop } from "@/components/ui/TypingLoop";
import { ease, scrollRange } from "@/lib/motion";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/home/HeroHome.module.css";
import { asset } from "@/lib/asset";

/**
 * Home hero (Figma "Featured service" 624:4121).
 *
 * Desktop: a pinned scroll scene. Scene 1 is the temple arch exactly as in
 * Figma; scrolling hands over to the hidden Figma layer — the typing
 * headline "BECOME THE BRAND PEOPLE REMEMBER." with the king and the stone
 * scholar rising together from the bottom.
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
  const s1Opacity = useTransform(p, (v) => scrollRange(v, 0.12, 0.34, 1, 0));
  const s1Y = useTransform(p, [0.1, 0.34], [0, -60]);
  const pillarL = useTransform(p, [0.05, 0.34], ["0%", "-55%"]);
  const pillarR = useTransform(p, [0.05, 0.34], ["0%", "55%"]);
  const archY = useTransform(p, [0.05, 0.34], ["0%", "-110%"]);

  // Scene 2 enters
  const s2Opacity = useTransform(p, (v) => scrollRange(v, 0.24, 0.42, 0, 1));
  const typeY = useTransform(p, [0.28, 0.46], [40, 0]);
  // Both figures arrive together and stay (Figma: the king at his desk in
  // front of the stone bust). They rise from the bottom as one group; the
  // bust stands 129 above the king's box, so the group travels its own
  // height plus that (686 / 557) to start fully out of view.
  const figuresY = useTransform(p, [0.4, 0.62], ["125%", "0%"]);

  const live = pinned && !reduce;

  return (
    <section ref={wrapRef} className={styles.wrap} aria-label="Introduction">
      <div className={styles.stage} onPointerMove={onPointerMove}>
        {/* Scene 1 — temple arch */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.bg} src={asset("/images/home/hero/hero-bg.avif")} alt="" width={1440} height={910} fetchPriority="high" />

        <motion.div className={styles.scene1} style={live ? { opacity: s1Opacity } : undefined}>
          <motion.div
            className={`${styles.pillar} ${styles.pillarLeft}`}
            initial={reduce ? false : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: ease.out }}
          >
            <motion.div className={styles.pillarScroll} style={live ? { x: pillarL } : undefined}>
              <motion.img
                src={asset("/images/home/hero/hero-pillar.avif")}
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
                src={asset("/images/home/hero/hero-pillar.avif")}
                alt=""
                width={577}
                height={923}
                fetchPriority="high"
                style={live ? { x: smx } : undefined}
              />
            </motion.div>
          </motion.div>
          <motion.div className={styles.arch} style={live ? { y: archY } : undefined}>
            {/* Painted with border-image (see the CSS): the carved brackets
                keep their shape and the beam between them repeats, so the
                arch always reaches both pillars whatever the screen width. */}
            <motion.span
              className={styles.archFill}
              initial={reduce ? false : { opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: ease.out }}
            />
          </motion.div>

          <motion.div className={styles.content} style={live ? { y: s1Y } : undefined}>
            <motion.img
              className={styles.logo}
              src={asset("/images/brand/brand-logo-stacked.avif")}
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
          <img className={styles.bg} src={asset("/images/home/hero/hero2-bg.avif")} alt="" width={1440} height={910} loading="eager" fetchPriority="low" />
          <motion.div className={styles.typing} style={live ? { y: typeY } : undefined}>
            <TypingLoop />
          </motion.div>
          {/* Socials under the headline and the scroll cue (Figma). */}
          <motion.ul className={styles.socials} style={live ? { y: typeY } : undefined}>
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={live ? undefined : -1}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.icon} alt="" width={s.iconSize.w} height={s.iconSize.h} loading="lazy" />
                  <span className={styles.handle}>
                    <span className={styles.handleLabel}>{s.label}</span>
                    <span className={styles.handleValue}>{s.handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>
          <ScrollCue className={styles.scrollCue} />
          {/* King and bust as one group: they rise together, so the bust
              always stays in place behind the desk. */}
          <motion.div className={styles.figures} style={live ? { y: figuresY } : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.scholar}
              src={asset("/images/home/hero/hero2-scholar.avif")}
              alt=""
              width={382}
              height={597}
              loading="eager"
              fetchPriority="low"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.king}
              src={asset("/images/home/hero/hero2-king.avif")}
              alt=""
              width={880}
              height={557}
              loading="eager"
              fetchPriority="low"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile / reduced-motion: scene 2 as its own block */}
      <div className={styles.stacked}>
        <TypingLoop />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/home/hero/hero2-king.avif")} alt="" width={880} height={557} loading="eager" fetchPriority="low" />
      </div>
    </section>
  );
}
