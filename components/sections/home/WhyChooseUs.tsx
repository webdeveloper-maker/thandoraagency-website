"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { whyReasons } from "@/content/home";
import { GridDecor } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ease, scrollRange } from "@/lib/motion";
import { u } from "@/lib/u";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/home/WhyChooseUs.module.css";
import { asset } from "@/lib/asset";

/**
 * "Why choose Us." (Figma "Desktop - 35", Variant2 → Default).
 * Desktop, at full design scale in two parts: the heading and copy scroll
 * normally; then the band below (cards + the two sculptures, Figma y 423 →
 * 1115) pins to the bottom of the screen, so the sculptures stand on its
 * edge as in Figma. They slide in as the band appears; then the six reason
 * cards scroll sideways between them.
 * Mobile / reduced motion: a swipeable card row.
 *
 * Images load eagerly (low priority): the stage clips them with overflow:hidden
 * while they slide in, and native lazy-loading never fires for clipped images,
 * so they would pop in blank.
 */
export function WhyChooseUs() {
  const pinRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const pinned = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const live = pinned && !reduce;
  const [travel, setTravel] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const strip = stripRef.current;
      if (!strip) return;
      // Strip's untransformed left edge (offset within the page frame).
      const visible = window.innerWidth - (strip.parentElement?.getBoundingClientRect().left ?? 0);
      setTravel(Math.max(0, strip.scrollWidth - Math.min(visible, window.innerWidth) + 80));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [live, travel]);

  const { scrollY } = useScroll();
  // Read live from the layout on each scroll frame: sections above can change
  // height after mount (other pinned sections measure themselves), so a
  // position stored at load would go stale.
  const p = useTransform(scrollY, () => {
    const pin = pinRef.current;
    const rail = railRef.current;
    if (!pin || !rail) return 0;
    const stickTop = parseFloat(getComputedStyle(rail).top) || 0;
    const len = Math.max(1, pin.offsetHeight - rail.offsetHeight);
    return Math.min(1, Math.max(0, (stickTop - pin.getBoundingClientRect().top) / len));
  });
  // While pinned the scroll only moves the cards (short holds at both ends).
  const stripX = useTransform(p, (v) => -scrollRange(v, 0.04, 0.96, 0, 1) * travel);
  // The sculptures and cards arrive as the band scrolls into view, so it is
  // never empty on screen. Triggered by the band itself: the sculptures start
  // pushed outside it, where its overflow clips them, so they could never
  // reach an in-view threshold of their own.
  const bandIn = useInView(railRef, { once: true, amount: 0.3 });
  const enter = (from: Record<string, string | number>, delay = 0) =>
    live
      ? {
          initial: from,
          animate: bandIn ? { x: 0, y: 0, opacity: 1 } : from,
          transition: { duration: 1.1, ease: ease.out, delay },
        }
      : {};

  return (
    <section className={styles.section} aria-labelledby="why-title">
      <div className={styles.top}>
        <GridDecor style={{ left: u(-193), top: u(72) }} />
        <GridDecor style={{ left: u(838), top: u(-271) }} />

        <div className={styles.head}>
          <SectionTitle id="why-title" lead="Why choose" highlight="Us." />
          <Reveal>
            <p className={styles.copy}>
              At <b>THANDORA</b>, we believe great digital marketing starts with understanding your business. We combine
              creative thinking, strategic planning and innovative digital solutions to help brands build a stronger
              online presence and move towards their goals.
            </p>
          </Reveal>
        </div>
      </div>

      <div
        ref={pinRef}
        className={styles.pin}
        style={live ? { height: `calc(692 * var(--u) + ${Math.round(travel * 1.1)}px)` } : undefined}
      >
        <div ref={railRef} className={styles.stage}>
          <motion.div className={styles.viewport} {...enter({ opacity: 0, y: 80 }, 0.3)}>
            <motion.ul ref={stripRef} className={styles.strip} style={live ? { x: stripX } : undefined}>
              {whyReasons.map((r, i) => (
                <li key={r.title} className={styles.card}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt="" width={582} height={582} loading="eager" fetchPriority="low" />
                  <div className={styles.cardText}>
                    <h3>{r.title}</h3>
                    <p style={{ fontWeight: i === 0 ? 600 : 700 }}>{r.body}</p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div className={styles.sage} {...enter({ x: "-70%", y: "45%", opacity: 0 })} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/images/why-sage.avif")} alt="" width={465} height={643} loading="eager" fetchPriority="low" />
          </motion.div>
          <motion.div className={styles.young} {...enter({ x: "65%", y: "45%", opacity: 0 }, 0.1)} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/images/why-young.avif")} alt="" width={599} height={658} loading="eager" fetchPriority="low" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
