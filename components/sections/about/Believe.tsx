"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { believeCards } from "@/content/pages";
import { GridDecor } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ease, scrollRange } from "@/lib/motion";
import { u } from "@/lib/u";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/about/Believe.module.css";
import { asset } from "@/lib/asset";

type Card = (typeof believeCards)[number];
const last = believeCards.length - 1;

/*
 * Pinned scroll timeline (desktop), the same format as "How we do it":
 *   0    – 0.10  rest: the overlapping deck with the note and its arrow
 *   0.10 – 0.30  the deck splits: the cards fan out into a row
 *   0.33 – 0.93  the row travels left, card by card, ending on card 5
 * Scrolling back up closes the row into the deck again.
 */
const SPLIT = [0.1, 0.3] as const;
const ROW = [0.33, 0.93] as const;
/** Deck offset between cards, and the row pitch (495 card + 40 gap), Figma px. */
const DECK_STEP = 25;
const ROW_PITCH = 535;
const fu = (px: number) => `calc(${px} * var(--u))`;

function CardFace({ card, lazy = true, textOpacity }: { card: Card; lazy?: boolean; textOpacity?: MotionValue<number> }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.cardImage}
        src={card.image}
        alt=""
        width={508}
        height={508}
        loading={lazy ? "lazy" : "eager"}
        fetchPriority={lazy ? undefined : "low"}
      />
      <motion.div className={styles.cardText} style={textOpacity ? { opacity: textOpacity } : undefined}>
        <h3>{card.title}</h3>
        <div className={styles.cardBody}>
          <p>{card.body}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/icons/icon-quote.svg")} alt="" width={50} height={50} />
        </div>
      </motion.div>
    </>
  );
}

/** One card in the pinned row: stacked in the deck at rest, fanned out on scroll. */
function RowCard({ i, split, state, current }: { i: number; split: MotionValue<number>; state: string; current: boolean }) {
  const x = useTransform(split, (t) => fu(i * (DECK_STEP + t * (ROW_PITCH - DECK_STEP))));
  // Only the front card's text shows in the deck; the others' appear once
  // the cards have fanned far enough apart not to overlap.
  const textOpacity = useTransform(split, (t) => (i === last ? 1 : scrollRange(t, 0.65, 1, 0, 1)));
  return (
    <motion.li
      className={`${styles.card} ${styles.rowCard} ${state}`}
      style={{ x, zIndex: i }}
      aria-current={current ? "true" : undefined}
    >
      <CardFace card={believeCards[i]} lazy={false} textOpacity={textOpacity} />
    </motion.li>
  );
}

/**
 * "What we Believe." (Figma section 565:9719). Five value cards sit in an
 * overlapping deck (25px offsets).
 * Desktop: the section pins; scrolling down fans the deck out into a row
 * that walks sideways card by card (cards reached stay solid, the ones ahead
 * are faded). Scrolling up closes it back into the deck.
 * Mobile / reduced motion: the deck; tapping it or the arrows sends the front
 * card to the back.
 */
export function Believe() {
  const ref = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLOListElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const live = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)") && !reduce;

  // Deck (unpinned): order[0] is the card at the back; the last is in front.
  const [order, setOrder] = useState(() => believeCards.map((_, i) => i));
  const front = order[order.length - 1];
  const next = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  const prev = () => setOrder((o) => [...o.slice(1), o[0]]);

  // Pinned row.
  const [active, setActive] = useState(0);
  const [spread, setSpread] = useState(false);
  const travel = useMotionValue(0);

  useLayoutEffect(() => {
    if (!live) return;
    const measure = () => {
      const row = rowRef.current;
      const end = endRef.current;
      if (!row || !end) return;
      // Fanned-out right edge of the last card: row left + 4 pitches + card width.
      const card = row.firstElementChild as HTMLElement | null;
      if (!card) return;
      const unit = card.offsetWidth / 495;
      const right = row.offsetLeft + (last * ROW_PITCH + 495) * unit;
      travel.set(Math.max(0, right - end.offsetLeft));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [live, travel]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const split = useTransform(p, (v) => scrollRange(v, SPLIT[0], SPLIT[1], 0, 1));
  const rowT = useTransform(p, (v) => scrollRange(v, ROW[0], ROW[1], 0, 1));
  const rowX = useTransform([rowT, travel], ([t, dist]: number[]) => -t * dist);
  const noteOpacity = useTransform(p, (v) => scrollRange(v, 0.1, 0.16, 1, 0));
  const noteY = useTransform(p, (v) => scrollRange(v, 0.1, 0.16, 0, 24));
  const barOpacity = useTransform(p, (v) => scrollRange(v, 0.26, 0.32, 0, 1));
  const barScale = useTransform(rowT, [0, 1], [1 / believeCards.length, 1]);

  useMotionValueEvent(split, "change", (t) => setSpread(t >= 0.98));
  useMotionValueEvent(rowT, "change", (t) => {
    if (live) setActive(Math.min(last, Math.round(t * last)));
  });

  return (
    <section ref={ref} className={styles.section} aria-labelledby="believe-title">
      <div className={styles.stage}>
        <GridDecor style={{ left: u(-231), top: u(-258) }} />

        <div className={styles.intro}>
          <SectionTitle id="believe-title" lead="What we" highlight="Believe." />
          <Reveal className={styles.copy}>
            <p>
              <span className="t-navy">At </span>
              <b>Thandora</b>,
              <span className="t-navy">
                {" "}
                we believe successful marketing begins with strong strategy, clear communication, and purpose. We help
                brands build a consistent presence, reach the right audience, and create meaningful connections.{" "}
              </span>
            </p>
          </Reveal>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.symbol} src={asset("/images/brand/carved-symbol.svg")} alt="" width={858} height={813} aria-hidden />
        <motion.div className={styles.noteWrap} style={live ? { opacity: noteOpacity, y: noteY } : undefined}>
          <Reveal className={styles.note}>
            <p>
              By the way , those aren’t just random carvings, they are <b>numbers in Thamiz</b> like 1, 2, 3 ... Look it
              up...!!
            </p>
          </Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.arrow} src={asset("/images/decor/arrow-loop.avif")} alt="" width={170} height={146} aria-hidden />
        </motion.div>

        {live ? (
          <>
            <div className={styles.rowWrap}>
              <motion.ol ref={rowRef} className={styles.row} style={{ x: rowX }} aria-label="What we believe">
                {believeCards.map((c, i) => (
                  <RowCard
                    key={c.title}
                    i={i}
                    split={split}
                    state={!spread || i <= active ? styles.reached : styles.ahead}
                    current={spread && i === active}
                  />
                ))}
              </motion.ol>
              <motion.div className={styles.progress} style={{ opacity: barOpacity }} aria-hidden>
                <motion.span style={{ scaleX: barScale }} />
              </motion.div>
            </div>
            {/* Where the last card's right edge stops (frame x 1306). */}
            <div ref={endRef} className={styles.rowEnd} aria-hidden />
          </>
        ) : (
          <div className={styles.deckWrap}>
            <div
              className={styles.deck}
              role="group"
              aria-roledescription="card deck"
              aria-label="What we believe"
              onClick={next}
            >
              {order.map((cardIndex, position) => {
                const card = believeCards[cardIndex];
                return (
                  <motion.article
                    key={card.title}
                    className={styles.card}
                    aria-hidden={cardIndex !== front}
                    animate={{ x: position * DECK_STEP, zIndex: position }}
                    transition={reduce ? { duration: 0 } : { duration: 0.5, ease: ease.out }}
                  >
                    <CardFace card={card} />
                  </motion.article>
                );
              })}
            </div>
            <div className={styles.controls}>
              <button type="button" onClick={prev} aria-label="Previous belief">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M13.164 8H2.834M6.75 4.083 2.833 8l3.917 3.917" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <span aria-live="polite">
                {believeCards.length - front} / {believeCards.length}
              </span>
              <button type="button" onClick={next} aria-label="Next belief">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2.836 8h10.33M9.25 4.083 13.167 8 9.25 11.917" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
