"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { Mandala } from "@/components/ui/Decor";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { u } from "@/lib/u";
import styles from "@/styles/sections/home/Statement.module.css";
import { asset } from "@/lib/asset";

function Fill({ children, progress }: { children: ReactNode; progress: MotionValue<string> | string }) {
  return (
    <motion.span className={styles.fill} style={{ ["--p" as string]: progress }}>
      {children}
    </motion.span>
  );
}

/**
 * Blue statement band (Figma "Section" 624:4083). The highlighted words fill
 * with navy left to right as the section scrolls into view. The VR
 * sculpture stays put, standing on the band's bottom edge.
 */
export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center 45%"] });
  const fillA = useTransform(scrollYProgress, [0, 0.55], ["0%", "100%"]);
  const fillB = useTransform(scrollYProgress, [0.35, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className={styles.section} aria-label="Tradition meets technology">
      <Mandala
        src={asset("/images/decor/union-statement.svg")}
        width={465.933}
        height={433.911}
        style={{ left: u(852), top: u(-84), width: u(610.318), height: u(595.884) }}
      />

      <div className={styles.copy}>
        <h2 className={styles.text}>
          We at Thandora, bring the best of <Fill progress={reduce ? "100%" : fillA}>tradition Legacy</Fill>{" "}
          and <Fill progress={reduce ? "100%" : fillB}>modern technology</Fill> together to create
          experiences that stick with people long after the first impression.
        </h2>
        <Reveal delay={0.1}>
          <PillButton href="/contact/" variant="white">
            Contact us
          </PillButton>
        </Reveal>
      </div>

      <div className={styles.art}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/home/statement/statement-sculpture.avif")} alt="" width={500} height={501} loading="lazy" />
      </div>
    </section>
  );
}
