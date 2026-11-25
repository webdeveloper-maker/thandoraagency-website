"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";
import { reviewRows } from "@/content/home";
import { GridDecor } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { u } from "@/lib/u";
import { useCanHover } from "@/lib/useMedia";
import styles from "@/styles/sections/home/Testimonials.module.css";
import { asset } from "@/lib/asset";

type Logo = NonNullable<(typeof reviewRows)[number][number]>;

function LogoCard({ logo }: { logo: Logo | null }) {
  const reduce = useReducedMotion();
  const canHover = useCanHover();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!canHover || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set((((e.clientX - r.left) / r.width) * 2 - 1) * 4);
    rx.set(-(((e.clientY - r.top) / r.height) * 2 - 1) * 4);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      className={`${styles.card} ${logo ? "" : styles.empty}`}
      style={{ rotateX: rx, rotateY: ry }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo.src}
          alt={logo.alt}
          width={logo.w}
          height={logo.h}
          loading="lazy"
          style={{ width: `${(logo.w / 318) * 100}%` }}
        />
      )}
    </motion.div>
  );
}

/** "What they say." (Figma "Frame 2085665691"): dark band with review platforms. */
export function Testimonials() {
  return (
    <section className={styles.section} aria-labelledby="say-title">
      <div className={styles.glowA} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/home/testimonials/say-ellipse-698.svg")} alt="" />
      </div>
      <div className={styles.glowB} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/home/testimonials/say-ellipse-696.svg")} alt="" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.pillar} src={asset("/images/home/hero/hero-pillar.avif")} alt="" width={577} height={923} loading="lazy" aria-hidden />
      <GridDecor tone="blue" style={{ left: u(1019), top: u(-372) }} />

      <div className={styles.head}>
        <SectionTitle id="say-title" lead="What they" highlight="say." tone="light" className={styles.title} />
        <Reveal>
          <p className={styles.copy}>
            Discover <b>THANDORA</b> Across Platforms . Connect with us and explore our presence across professional
            networks and trusted business platforms.{" "}
          </p>
        </Reveal>
      </div>

      <Reveal className={styles.figure} x={-40} y={0}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/home/testimonials/say-architect.avif")} alt="" width={829} height={778} loading="lazy" />
      </Reveal>

      <div className={styles.rows}>
        {reviewRows.map((row, ri) => (
          <Reveal key={ri} className={`${styles.row} ${ri === 1 ? styles.rowOffset : ""}`} delay={ri * 0.1} x={60} y={0}>
            {row.map((logo, i) => (
              <LogoCard key={logo?.id ?? `empty-${ri}-${i}`} logo={logo} />
            ))}
          </Reveal>
        ))}
      </div>

      <div className={styles.fade} aria-hidden />
    </section>
  );
}
