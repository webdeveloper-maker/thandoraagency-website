"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties } from "react";
import styles from "@/styles/ui/Decor.module.css";

type GridProps = {
  /** Position of the 714px gradient square (the grid extends 28px around it). */
  style?: CSSProperties;
  /** Scale relative to the 770px Figma grid. */
  scale?: number;
  tone?: "navy" | "blue";
  className?: string;
};

/**
 * "Mask group / Group 28": a fine grid of lines revealed through a radial
 * glow. Draws in (fades + expands) the first time it is seen.
 */
export function GridDecor({ style, scale = 1, tone = "navy", className }: GridProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`${styles.grid} ${tone === "blue" ? styles.gridBlue : ""} ${className ?? ""}`}
      style={{ ...style, ["--g" as string]: scale }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

type MandalaProps = {
  src: string;
  /** Unrotated size of the Union shape, in Figma px. */
  width: number;
  height: number;
  /** Resting rotation from Figma, in degrees. */
  rotate?: number;
  /** Extra mirror transform from Figma (e.g. "scaleY(-1)"). */
  flip?: string;
  style?: CSSProperties;
  className?: string;
};

/**
 * The rotated Thandora "Union" mandala shape. It turns slowly into its
 * Figma rotation and drifts at 0.3x scroll speed as its section passes.
 */
export function Mandala({ src, width, height, rotate = -26.41, flip = "", style, className }: MandalaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const r = useTransform(scrollYProgress, [0, 0.5, 1], [rotate + 8, rotate, rotate - 8]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={ref} aria-hidden className={`${styles.mandala} ${className ?? ""}`} style={style}>
      <motion.div
        className={styles.mandalaInner}
        style={{
          width: `calc(${width} * var(--u))`,
          height: `calc(${height} * var(--u))`,
          rotate: reduce ? rotate : r,
          y: reduce ? 0 : y,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={width} height={height} style={flip ? { transform: flip } : undefined} />
      </motion.div>
    </div>
  );
}
