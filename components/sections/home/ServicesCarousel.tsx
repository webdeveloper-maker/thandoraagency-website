"use client";

import Link from "next/link";
import { motion, type MotionStyle, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
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

/** Scroll progress window over which the cards travel (short holds at both ends). */
const START = 0.03;
const END = 0.97;

/**
 * "What we Do." (Figma "Desktop - 32"): heading, intro and a row of featured
 * service cards with the next card peeking in from the right.
 *
 * Desktop: two parts at full design scale. The heading block scrolls
 * normally; then only the card row pins (centred on screen) and scrolling
 * down moves it left, card by card. Keyboard arrows on the row scroll the
 * page to the matching card.
 * Mobile / reduced motion: a swipeable snap carousel; arrows move one card.
 *
 * Hover (Figma hover state): the image zooms, the title grows slightly and a
 * white arrow button appears bottom-right, linking to the Services page.
 */
export function ServicesCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
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

  // Pinned mode: the row travels until the last card's right edge meets the
  // frame's right margin, measured from the real layout. (Stepping a full
  // card per index left blank space beside the last card whenever the frame
  // is scaled to the window height, and the page kept scrolling over it.)
  useLayoutEffect(() => {
    if (!live) return;
    const measure = () => {
      const track = trackRef.current;
      const cards = track?.querySelectorAll<HTMLElement>("[data-card]");
      if (!track || !cards?.length) return;
      const lastCard = cards[cards.length - 1];
      const padRight = parseFloat(getComputedStyle(track).paddingRight || "0");
      const t = Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth + padRight - track.clientWidth);
      setTravel(t);
      travelMV.set(t);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [live, travel, travelMV]);

  /** Row offset (0 → travel) that brings card i to the left margin. */
  const offsetFor = (i: number) => Math.min(i * step(), travelMV.get());

  const { scrollY } = useScroll();
  // White → black as the section rises into view (Figma prototype): 0 while
  // its top is in the lower part of the screen, 1 once it reaches the upper
  // third. CSS mixes every colour in the section from this one value.
  const dark = useTransform(scrollY, () => {
    const sec = sectionRef.current;
    if (!sec) return 0;
    const vh = window.innerHeight;
    return Math.min(1, Math.max(0, (vh * 0.8 - sec.getBoundingClientRect().top) / (vh * 0.5)));
  });
  // Read live from the layout on each scroll frame: sections above can change
  // height after mount (other pinned sections measure themselves), so a
  // position stored at load would go stale.
  const p = useTransform(scrollY, () => {
    const pin = pinRef.current;
    const rail = railRef.current;
    if (!pin || !rail) return 0;
    const stickTop = parseFloat(getComputedStyle(rail).top) || 0;
    const len = Math.max(1, pin.offsetHeight - rail.offsetHeight);
    return Math.min(1, Math.max(0, (stickTop - pin.getBoundingClientRect().top) / len));
  });
  const trackX = useTransform([p, travelMV], ([v, dist]: number[]) => {
    const t = Math.min(1, Math.max(0, (v - START) / (END - START)));
    return -t * dist;
  });
  useMotionValueEvent(p, "change", (v) => {
    if (!live) return;
    const t = Math.min(1, Math.max(0, (v - START) / (END - START)));
    const s = step();
    if (t >= 0.995) setIndex(last);
    else setIndex(s ? Math.min(last, Math.round((t * travelMV.get()) / s)) : 0);
  });

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(last, i));
    if (live) {
      const dist = travelMV.get();
      const t = dist ? offsetFor(clamped) / dist : clamped / last;
      const pin = pinRef.current;
      const rail = railRef.current;
      if (!pin || !rail) return;
      const stickTop = parseFloat(getComputedStyle(rail).top) || 0;
      const start = pin.getBoundingClientRect().top + window.scrollY - stickTop;
      const len = pin.offsetHeight - rail.offsetHeight;
      scrollToY(start + (START + (END - START) * t) * len);
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
    <motion.section
      ref={sectionRef}
      className={styles.section}
      style={{ "--dark": dark } as unknown as MotionStyle}
      aria-labelledby="whatwedo-title"
    >
      <div className={styles.stage}>
        <Mandala
          src={asset("/images/decor/union-whatwedo.svg")}
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
              <PillButton href="/services/" className={styles.cta}>
                THANDORA’s Services
              </PillButton>
              {!live && (
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
              )}
            </Reveal>
          </div>
        </div>

      </div>

      <div
        ref={pinRef}
        className={styles.pin}
        style={live && travel ? { height: `calc(${Math.round(travel / (END - START))}px + 550 * var(--u))` } : undefined}
      >
        <div ref={railRef} className={styles.rail}>
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
      </div>
    </motion.section>
  );
}
