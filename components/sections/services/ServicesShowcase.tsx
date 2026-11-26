"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { GridDecor } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { asset } from "@/lib/asset";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ease } from "@/lib/motion";
import { u } from "@/lib/u";
import styles from "@/styles/sections/services/ServicesShowcase.module.css";

/**
 * Services "What we Do." (new design): heading + copy, then the large
 * "DIGITAL MARKETING." photo card with three floating UI cards around it.
 * The card image is the Figma export (title and "More" pill drawn in); a
 * link sits over the drawn pill.
 */
export function ServicesShowcase() {
  const reduce = useReducedMotion();
  // The floating cards drift at different speeds as the stage scrolls past.
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const yA = useTransform(p, [0, 1], [50, -50]);
  const yB = useTransform(p, [0, 1], [80, -80]);
  const yC = useTransform(p, [0, 1], [30, -30]);
  const drift = (v: typeof yA) => (reduce ? undefined : { y: v });

  return (
    <section className={styles.section} aria-labelledby="services-what-title">
      <GridDecor tone="blue" className={styles.grid} style={{ left: u(-200), top: u(-150) }} />

      <div className={styles.head}>
        <SectionTitle id="services-what-title" lead="What we" highlight="Do." tone="light" />
        <Reveal>
          <p className={styles.copy}>
            At <b>Thandora</b>, we help businesses grow online through search engine optimization (SEO) and social media
            marketing. Our website design and development services create responsive, user-friendly websites. We run
            targeted Google Ads and pay-per-click (PPC) campaigns to generate leads.
          </p>
        </Reveal>
      </div>

      <div ref={stageRef} className={styles.stage}>
        <Reveal className={styles.card} y={60}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/services/what-we-do/digital-marketing.avif")} alt="" width={1083} height={457} loading="lazy" />
          <h3 className="sr-only">Digital Marketing</h3>
          {/* Real button laid exactly over the one drawn in the photo (which blurs when scaled). */}
          <Link href="/contact/" className={styles.more} aria-label="More about digital marketing: start a conversation">
            <span>More</span>
            <span className={styles.moreIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </Reveal>

        {/* Floating UI cards (decorative) */}
        <motion.div className={`${styles.float} ${styles.upload}`} style={drift(yA)} aria-hidden>
          <div className={styles.uploadTop}>
            <span className={styles.uploadIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5" />
                <path d="M12 12v8M9 15l3-3 3 3" />
              </svg>
            </span>
            <div>
              <strong>Uploading 4 Files</strong>
              <small>43% · 4 minutes left</small>
            </div>
          </div>
          <div className={styles.barRow}>
            <span className={styles.bar}>
              <motion.i
                initial={{ width: "8%" }}
                whileInView={{ width: "43%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: ease.out, delay: 0.3 }}
              />
            </span>
            <span className={styles.pause} />
          </div>
          <small>280 MB of 1.8 GB</small>
        </motion.div>

        <motion.div className={`${styles.float} ${styles.stat}`} style={drift(yB)} aria-hidden>
          <div className={styles.statHead}>
            <span className={styles.statIcon} />
            <div>
              <small>Weekly report</small>
              <strong>Total Sales</strong>
            </div>
          </div>
          <p className={styles.amount}>
            <span>$</span>48,654<em>.00</em>
          </p>
          <small className={styles.delta}>▲ 12.4% vs last week</small>
          <svg viewBox="0 0 120 50" fill="none" className={styles.chart}>
            <path d="M2 40 C14 38 18 30 30 32 S48 22 60 26 76 12 88 18 106 6 118 8" stroke="#c7cddb" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M2 44 C14 42 22 36 34 38 S52 30 64 33 80 22 92 26 108 16 118 18" stroke="#315cff" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <div className={styles.axis}>
            <span>Mo</span>
            <span>We</span>
            <span>Fr</span>
          </div>
        </motion.div>

        <motion.div className={`${styles.float} ${styles.profile}`} style={drift(yC)} aria-hidden>
          <div className={styles.profileHead}>
            <div>
              <strong>Roshan.S</strong>
              <small>Product Designer</small>
            </div>
            <span className={styles.dots}>···</span>
          </div>
          <p>
            Design is something that comes naturally, and more importantly on time. AI brings speed and precision but a
            designer brings creativity and taste.
          </p>
          <small>Talk about #UX #Problem-Solving #UI</small>
          <div className={styles.people}>
            <span className={styles.avatars}>
              <i />
              <i />
              <i />
            </span>
            <small>250 Followers | 300 Following</small>
          </div>
          <span className={styles.follow}>Follow</span>
        </motion.div>
      </div>
    </section>
  );
}
