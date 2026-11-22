"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";
import { ease, inViewOnce, stagger } from "@/lib/motion";
import styles from "@/styles/ui/SectionTitle.module.css";

type Props = {
  /** Words before the highlighted word, e.g. "What we". */
  lead: string;
  /** Highlighted (blue) last word, e.g. "Do.". */
  highlight: string;
  as?: ElementType;
  tone?: "dark" | "light";
  className?: string;
  id?: string;
};

/**
 * Big section heading with a blue last word ("Who are We.", "What we Do.").
 * Words rise 24px and fade in with a 60ms stagger; the blue word wipes in
 * left to right last.
 */
export function SectionTitle({ lead, highlight, as: Tag = "h2", tone = "dark", className, id }: Props) {
  const reduce = useReducedMotion();
  const words = lead.split(" ");

  const word = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: ease.out, delay: i * stagger },
    }),
  };

  const wipe = {
    hidden: reduce ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" },
    show: {
      opacity: 1,
      clipPath: "inset(0 0% 0 0)",
      transition: { duration: 0.6, ease: ease.out, delay: words.length * stagger + 0.1 },
    },
  };

  return (
    <Tag id={id} className={`${styles.title} ${tone === "light" ? styles.light : ""} ${className ?? ""}`}>
      <motion.span initial="hidden" whileInView="show" viewport={inViewOnce} className={styles.line}>
        {words.map((w, i) => (
          <motion.span key={`${w}-${i}`} custom={i} variants={word} className={styles.word}>
            {w}&nbsp;
          </motion.span>
        ))}
        <motion.span variants={wipe} className={`${styles.word} ${styles.highlight}`}>
          {highlight}
        </motion.span>
      </motion.span>
    </Tag>
  );
}
