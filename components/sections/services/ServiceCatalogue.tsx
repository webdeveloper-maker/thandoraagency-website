"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
import { serviceCategories, services, type ServiceCategory } from "@/content/pages";
import { GridDecor, Mandala } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ease } from "@/lib/motion";
import { u } from "@/lib/u";
import styles from "@/styles/sections/services/ServiceCatalogue.module.css";
import { ServiceCard } from "@/components/sections/services/ServiceCard";

type Filter = ServiceCategory | "all";
const isFilter = (v: string | null): v is Filter => serviceCategories.some((c) => c.id === v);

/**
 * "What we Do." catalogue: filter chips and a two-column staggered grid of
 * service cards. The active filter lives in the URL (?category=…) so filtered
 * views can be shared.
 */
export function ServiceCatalogue() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const raw = params.get("category");
  const active: Filter = isFilter(raw) ? raw : "all";

  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start end", "end start"] });
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const visible = useMemo(() => services.filter((s) => active === "all" || s.category === active), [active]);
  const columns = [visible.filter((_, i) => i % 2 === 0), visible.filter((_, i) => i % 2 === 1)];

  const setFilter = (id: Filter) => {
    const next = new URLSearchParams(params.toString());
    if (id === "all") next.delete("category");
    else next.set("category", id);
    const qs = next.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const card = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 },
    transition: { duration: 0.3, ease: ease.out },
  };

  return (
    <section className={styles.section} aria-labelledby="catalogue-title">
      <Mandala
        src="/images/union-whatwedo.svg"
        width={442.643}
        height={412.221}
        style={{ left: u(-13), top: u(60), width: u(579.811), height: u(566.098) }}
      />
      <GridDecor style={{ left: u(860), top: u(-120) }} />

      <div className={styles.intro}>
        <SectionTitle as="h1" id="catalogue-title" lead="What we" highlight="Do." />
        <Reveal>
          <p className={styles.copy}>
            At <b>Thandora</b>, we help businesses grow online through search engine optimization (SEO) and social media
            marketing. Our website design and development services create responsive, user-friendly websites. We run
            targeted Google Ads and pay-per-click (PPC) campaigns to generate leads.
          </p>
        </Reveal>
      </div>

      <div className={styles.chipsBar}>
        <LayoutGroup id="service-filters">
          <div className={styles.chips} role="group" aria-label="Filter services">
            {serviceCategories.map((c) => {
              const on = c.id === active;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                  aria-pressed={on}
                  onClick={() => setFilter(c.id)}
                >
                  {on && (
                    <motion.span
                      layoutId="chip-active"
                      className={styles.chipBg}
                      transition={{ duration: 0.3, ease: ease.out }}
                    />
                  )}
                  <span className={styles.chipLabel}>{c.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      <div ref={gridRef} className={styles.grid} aria-live="polite">
        <div className={styles.column}>
          <AnimatePresence mode="popLayout" initial={false}>
            {columns[0].map((s) => (
              <motion.div key={s.slug} layout={!reduce} {...card}>
                <ServiceCard service={s} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <motion.div className={`${styles.column} ${styles.columnRight}`} style={reduce ? undefined : { y: rightY }}>
          <Link href="/contact/" className={styles.converse}>
            Start a conversation <span aria-hidden>→</span>
          </Link>
          <AnimatePresence mode="popLayout" initial={false}>
            {columns[1].map((s) => (
              <motion.div key={s.slug} layout={!reduce} {...card}>
                <ServiceCard service={s} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
