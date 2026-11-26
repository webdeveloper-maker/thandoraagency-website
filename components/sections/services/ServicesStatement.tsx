"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { asset } from "@/lib/asset";
import styles from "@/styles/sections/services/ServicesStatement.module.css";

/**
 * Blue statement band under the Services hero. The highlighted phrase fills
 * with navy left to right as the band scrolls into view (as on Home); the
 * scholar stands on the band's bottom edge, rising above its top.
 */
export function ServicesStatement() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center 45%"] });
  const fill = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section ref={ref} className={styles.band} aria-label="What we do for brands">
      <p className={styles.text}>
        At Thandora, through our{" "}
        <motion.span className={styles.fill} style={{ ["--p" as string]: reduce ? "100%" : fill }}>
          strategic, creative, and digital marketing services
        </motion.span>
        , we help businesses build stronger identities, connect with the right audiences, and grow their digital
        presence—creating lasting impressions that go beyond the first interaction.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.art} src={asset("/images/services/statement/scholar-laptop.avif")} alt="" width={556} height={476} loading="lazy" />
    </section>
  );
}
