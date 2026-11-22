"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { whyReasons } from "@/content/home";
import { GridDecor } from "@/components/ui/Decor";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { scrollRange } from "@/lib/motion";
import { u } from "@/lib/u";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/home/WhyChooseUs.module.css";
import { asset } from "@/lib/asset";

/**
 * "Why choose Us." (Figma "Desktop - 35", Variant2 → Default).
 * Desktop: the section pins; the heading rises from the centre to the top,
 * the two sculptures slide in, then the six reason cards scroll sideways
 * between them. The pinned frame is scaled to fit the screen.
 * Mobile / reduced motion: a swipeable card row.
 *
 * Images load eagerly (low priority): the stage clips them with overflow:hidden
 * while they slide in, and native lazy-loading never fires for clipped images,
 * so they would pop in blank.
 */
export function WhyChooseUs() {
  const ref = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const pinned = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const live = pinned && !reduce;
  const [travel, setTravel] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const strip = stripRef.current;
      if (!strip) return;
      const visible = window.innerWidth - strip.getBoundingClientRect().left + window.scrollX;
      setTravel(Math.max(0, strip.scrollWidth - Math.min(visible, window.innerWidth) + 80));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [live]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Offsets are relative (vh / % of each element) so they hold at any screen size.
  const headY = useTransform(p, [0, 0.18], ["30vh", "0vh"]);
  const cardsOpacity = useTransform(p, (v) => scrollRange(v, 0.08, 0.2, 0, 1));
  const cardsY = useTransform(p, [0.08, 0.2], [80, 0]);
  const stripX = useTransform(p, [0.2, 0.95], [0, -travel]);
  const sageX = useTransform(p, [0.02, 0.2], ["-86%", "0%"]);
  const sageY = useTransform(p, [0.02, 0.2], ["98%", "0%"]);
  const youngX = useTransform(p, [0.02, 0.2], ["74%", "0%"]);
  const youngY = useTransform(p, [0.02, 0.2], ["96%", "0%"]);

  return (
    <section
      ref={ref}
      className={styles.section}
      style={live ? { height: `calc(100vh + ${travel + 900}px)` } : undefined}
      aria-labelledby="why-title"
    >
      <div className={styles.stage}>
        <GridDecor style={{ left: u(-193), top: u(72) }} />
        <GridDecor style={{ left: u(838), top: u(-271) }} />

        <motion.div className={styles.head} style={live ? { y: headY } : undefined}>
          <SectionTitle id="why-title" lead="Why choose" highlight="Us." />
          <p className={styles.copy}>
            At <b>THANDORA</b>, we believe great digital marketing starts with understanding your business. We combine
            creative thinking, strategic planning and innovative digital solutions to help brands build a stronger
            online presence and move towards their goals.
          </p>
        </motion.div>

        <motion.div className={styles.viewport} style={live ? { opacity: cardsOpacity, y: cardsY } : undefined}>
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

        <motion.div className={styles.sage} style={live ? { x: sageX, y: sageY } : undefined} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/why-sage.avif")} alt="" width={600} height={792} loading="eager" fetchPriority="low" />
        </motion.div>
        <motion.div className={styles.young} style={live ? { x: youngX, y: youngY } : undefined} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/why-young.avif")} alt="" width={705} height={777} loading="eager" fetchPriority="low" />
        </motion.div>
      </div>
    </section>
  );
}
