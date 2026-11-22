"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { useCanHover } from "@/lib/useMedia";
import styles from "@/styles/sections/shared/GradientBanner.module.css";

type Props = {
  /** "notch-bottom" = Banner 624:3957; "notch-top" = the flipped Banner 624:4108. */
  shape?: "notch-bottom" | "notch-top";
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  bodyWidth?: number;
  button: { label: string; href: string; rounded?: boolean };
  art?: "symbol" | "scholar";
  id?: string;
};

/** Navy gradient banner with drifting blue glows (Figma "Banner"). */
export function GradientBanner({ shape = "notch-bottom", eyebrow, title, body, bodyWidth = 920, button, art = "symbol", id }: Props) {
  const reduce = useReducedMotion();
  const canHover = useCanHover();
  const mx = useMotionValue(0);
  const tilt = useSpring(useTransform(mx, [-1, 1], [-6, 6]), { stiffness: 120, damping: 20 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!canHover || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };

  return (
    <section
      id={id}
      className={`${styles.banner} ${shape === "notch-top" ? styles.flip : ""} ${eyebrow ? styles.withEyebrow : ""}`}
      onPointerMove={onMove}
      onPointerLeave={() => mx.set(0)}
    >
      <div className={styles.bg} aria-hidden>
        <div className={`${styles.glow} ${styles.g1}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/banner-ellipse-697.svg" alt="" />
        </div>
        <div className={`${styles.glow} ${styles.g2}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/banner-ellipse-698.svg" alt="" />
        </div>
        <div className={`${styles.glow} ${styles.g3}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/banner-ellipse-699.svg" alt="" />
        </div>
      </div>

      <div className={styles.copy}>
        <Reveal className={styles.text}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 className={styles.title}>{title}</h2>
          {body && (
            <p className={styles.body} style={{ maxWidth: bodyWidth }}>
              {body}
            </p>
          )}
        </Reveal>
        <Reveal delay={0.1} className={styles.actions}>
          <PillButton href={button.href} variant="white" rounded={button.rounded}>
            {button.label}
          </PillButton>
        </Reveal>
      </div>

      {art === "symbol" ? (
        <motion.div className={styles.symbol} style={{ rotate: reduce ? 0 : tilt }} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/banner-symbol.avif" alt="" width={434} height={415} loading="lazy" />
        </motion.div>
      ) : (
        <Reveal className={styles.scholar} x={80} y={0}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/banner2-scholar.avif" alt="" width={588} height={397} loading="lazy" />
        </Reveal>
      )}
    </section>
  );
}
