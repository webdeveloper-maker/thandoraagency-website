"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { ease, inViewOnce } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance to rise from, in px. */
  y?: number;
  x?: number;
  as?: "div" | "p" | "li" | "section";
};

/** Fades and rises its children into place the first time they scroll into view. */
export function Reveal({ children, className, delay = 0, y = 24, x = 0, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 0.6, ease: ease.out, delay }}
    >
      {children}
    </Tag>
  );
}
