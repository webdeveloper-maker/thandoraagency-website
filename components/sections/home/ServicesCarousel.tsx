"use client";

import Link from "next/link";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { featuredServices } from "@/content/home";
import { scrollToY } from "@/components/layout/SmoothScroll";
import { Mandala } from "@/components/ui/Decor";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { u } from "@/lib/u";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/home/ServicesCarousel.module.css";
import { asset } from "@/lib/asset";

/** Scroll progress window over which the cards travel (holds at both ends). */
const START = 0.08;
const END = 0.92;

/**
 * "What we Do." (Figma "Desktop - 32"): heading, intro and a row of featured
 * service cards with the next card peeking in from the right.
 *
 * Desktop: the section pins (scaled to fit the screen) and scrolling down
 * moves the row left, card by card. The arrow buttons and keyboard arrows
 * scroll the page to the matching card.
 * Mobile / reduced motion: a swipeable snap carousel; arrows move one card.
 *
 * Hover (Figma hover state): the image zooms, the title grows slightly and a
 * white arrow button appears bottom-right, linking to the Services page.
 */
export function ServicesCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const live = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)") && !reduce;
  const [index, setIndex] = useState(0);
  const [travel, setTravel] = useState(0);
  const travelMV = useMotionValue(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const last = featuredServices.length - 1;

  const step = () => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-card]");
    if (!track || !card) return 0;
    return card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  };

  // Pinned mode: distance the row travels = every card but the first.
  useLayoutEffect(() => {
    if (!live) return;
    const measure = () => {
      const t = last * step();
      setTravel(t);
      travelMV.set(t);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [live, last, travelMV]);

  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const trackX = useTransform([p, travelMV], ([v, dist]: number[]) => {
    const t = Math.min(1, Math.max(0, (v - START) / (END - START)));
    return -t * dist;
  });
  useMotionValueEvent(p, "change", (v) => {
    if (!live) return;
    const t = Math.min(1, Math.max(0, (v - START) / (END - START)));
    setIndex(Math.round(t * last));
  });

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(last, i));
    if (live) {
      const sec = sectionRef.current;
      if (!sec) return;
      const top = sec.getBoundingClientRect().top + window.scrollY;
      const length = sec.offsetHeight - window.innerHeight;
      scrollToY(top + (START + ((END - START) * clamped) / last) * length);
      return;
    }
    trackRef.current?.scrollTo({ left: clamped * step(), behavior: "smooth" });
  };

  // Swipe carousel: keep the index in step with the native scroll position.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || live) return;
    const onScroll = () => {
      const s = step();
      if (s) setIndex(Math.round(track.scrollLeft / s));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [live]);

  // Mouse drag for the swipe carousel (touch devices already swipe natively).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (live || e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
    trackRef.current.dataset.dragging = "true";
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !trackRef.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    if (!drag.current || !trackRef.current) return;
    delete trackRef.current.dataset.dragging;
    const s = step();
    if (s) goTo(Math.round(trackRef.current.scrollLeft / s));
    drag.current = null;
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={live && travel ? { height: `calc(100vh + ${Math.round(travel / (END - START))}px)` } : undefined}
      aria-labelledby="whatwedo-title"
    >
      <div className={styles.stage}>
        <Mandala
          src={asset("/images/union-whatwedo.svg")}
          width={442.643}
          height={412.221}
          style={{ left: u(-13), top: 0, width: u(579.811), height: u(566.098) }}
        />

        <div className={styles.intro}>
          <SectionTitle id="whatwedo-title" lead="What we" highlight="Do." />
          <div className={styles.side}>
            <Reveal>
              <p className={styles.copy}>
                At <b>Thandora</b>, we help businesses grow online through search engine optimization (SEO) and social
                media marketing. Our website design and development services create responsive, user-friendly websites.
                We run targeted Google Ads and pay-per-click (PPC) campaigns to generate leads.
              </p>
            </Reveal>
            <Reveal delay={0.1} className={styles.actions}>
              <PillButton href="/services/">THANDORA’s Services</PillButton>
              <div className={styles.arrows}>
                <button type="button" aria-label="Previous service" onClick={() => goTo(index - 1)} disabled={index === 0}>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M13.164 8H2.834M6.75 4.083 2.833 8l3.917 3.917" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                <button type="button" aria-label="Next service" onClick={() => goTo(index + 1)} disabled={index === last}>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M2.836 8h10.33M9.25 4.083 13.167 8 9.25 11.917" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </Reveal>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          className={styles.track}
          style={live ? { x: trackX } : undefined}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured services"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              goTo(index + 1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              goTo(index - 1);
            }
          }}
        >
          {featuredServices.map((s, i) => (
            <article
              key={s.id}
              data-card
              className={styles.card}
              style={{ backgroundColor: s.color }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${featuredServices.length}: ${s.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" width={1280} height={550} loading="eager" fetchPriority="low" draggable={false} />
              <div className={styles.cardShade} aria-hidden />
              <div className={styles.cardText}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
              <Link href="/services/" className={styles.cardGo} aria-label={`Explore ${s.title}`} draggable={false}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 12h15M13 5.5 19.5 12 13 18.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </article>
          ))}
        </motion.div>

        <div className={styles.dots} aria-hidden>
          {featuredServices.map((s, i) => (
            <span key={s.id} className={i === index ? styles.dotActive : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
