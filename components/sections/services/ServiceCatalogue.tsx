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
import { asset } from "@/lib/asset";

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

  // Filter transition: leaving cards shrink and fade, the rest slide to their
  // new places (layout), and incoming cards rise in one after another.
  const card = (order: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.94 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: ease.out, delay: reduce ? 0 : order * 0.07 },
    },
    exit: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, transition: { duration: 0.25, ease: ease.out } },
    transition: { layout: { duration: 0.5, ease: ease.out } },
  });

  return (
    <section className={styles.section} aria-labelledby="catalogue-title">
      <Mandala
        className={styles.mark}
        src={asset("/images/union-whatwedo.svg")}
        width={442.643}
        height={412.221}
        style={{ left: u(860), top: u(-40), width: u(820), height: u(800) }}
      />
      <Mandala
        className={styles.mark}
        src={asset("/images/union-whatwedo.svg")}
        width={442.643}
        height={412.221}
        style={{ left: u(-330), top: u(1500), width: u(820), height: u(800) }}
      />
      <GridDecor tone="blue" className={styles.gridDecor} style={{ left: u(-120), top: u(-260) }} />

      <div className={styles.intro}>
        <SectionTitle as="h2" id="catalogue-title" lead="What we" highlight="Do." tone="light" />
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

      <div className={styles.body}>
        <div className={styles.aside}>
          <Reveal>
            <p className={styles.copy}>
              At <b>Thandora</b>, we help businesses grow online through search engine optimization (SEO) and social
              media marketing. Our website design and development services create responsive, user-friendly websites.
              We run targeted Google Ads and pay-per-click (PPC) campaigns to generate leads.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/contact/" className={styles.converse}>
              Start a conversation
            </Link>
          </Reveal>
        </div>

        <div ref={gridRef} className={styles.grid} aria-live="polite">
          <div className={styles.column}>
            <AnimatePresence mode="popLayout" initial={false}>
              {columns[0].map((s, j) => (
                <motion.div key={s.slug} layout={!reduce} {...card(j * 2)}>
                  <ServiceCard service={s} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.div className={`${styles.column} ${styles.columnRight}`} style={reduce ? undefined : { y: rightY }}>
            <AnimatePresence mode="popLayout" initial={false}>
              {columns[1].map((s, j) => (
                <motion.div key={s.slug} layout={!reduce} {...card(j * 2 + 1)}>
                  <ServiceCard service={s} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
