"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { footer } from "@/content/site";
import styles from "@/styles/layout/Footer.module.css";

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

function FooterLink({ href, label }: { href: string; label: string }) {
  if (isExternal(href)) {
    return (
      <a href={href} className={styles.link} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={styles.link}>
      {label}
    </Link>
  );
}

/** Footer (Figma "Desktop - 6"): columns on desktop, accordions on mobile. */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-mark-white.avif" alt="Thandora" width={39} height={36} />
          <p className={styles.tagline}>
            {footer.tagline[0]}
            <br />
            {footer.tagline[1]}
          </p>
        </div>

        {footer.columns.map((col) => (
          <div key={col.title} className={styles.col}>
            <h4 className={styles.heading}>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
            <details className={styles.accordion}>
              <summary className={styles.heading}>{col.title}</summary>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink href={l.href} label={l.label} />
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>

      <motion.div className={styles.wordmark} style={{ y: reduce ? 0 : y }} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-mark-white.avif" alt="" width={217} height={202} />
        <span>THANDORA</span>
      </motion.div>
    </footer>
  );
}
