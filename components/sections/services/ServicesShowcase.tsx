"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { GridDecor } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { asset } from "@/lib/asset";
import { scrollRange } from "@/lib/motion";
import { u } from "@/lib/u";
import { useMedia } from "@/lib/useMedia";
import styles from "@/styles/sections/services/ServicesShowcase.module.css";

/**
 * Services "What we Do." (new design).
 *
 * Desktop: a pinned black stage that plays the three service cards one by
 * one as the visitor scrolls. For each card:
 *   1. the glow and the photo card (big title) blur in;
 *   2. its floating UI cards appear one at a time around it;
 *   3. the photo blurs, the title drops to a small caption bottom-left and
 *      the card's services appear as pills, one by one;
 *   4. the scene blurs away and the next card arrives.
 * Mobile / reduced motion: each card stacks with its services listed below.
 */

/** Placement in the 1440 x 820 stage frame (Figma px). */
type Spot = { x: number; y: number; w: number; back?: boolean };
type Float = Spot & ({ src: string; iw: number; ih: number } | { node: ReactNode });

type Scene = {
  id: string;
  title: string;
  /** Short caption shown once the photo blurs (Figma: all caps, two lines). */
  caption: [string, string];
  glow: string;
  /** Colour of the bottom progress line while this scene plays. */
  accent: string;
  services: string[];
  floats: Float[];
};

const ui = (name: string) => asset(`/images/services/what-we-do/ui/${name}.avif`);

/* Card: 1096 wide at left 172, top 178 of the frame; floats placed per Figma. */
const scenes: Scene[] = [
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    caption: ["Digital", "Marketing."],
    glow: "rgba(40, 90, 253, 0.55)",
    accent: "#4a6bff",
    services: ["Search Engine Optimization", "Social Media Optimization", "Search Engine Marketing", "Social Media Marketing"],
    floats: [
      { node: <UploadCard />, x: 100, y: 210, w: 310 },
      { node: <SalesCard />, x: 1135, y: 88, w: 207, back: true },
      { node: <ProfileCard />, x: 1022, y: 424, w: 308 },
    ],
  },
  {
    id: "creative-branding",
    title: "Creative Branding",
    caption: ["Creative", "Branding."],
    glow: "rgba(214, 48, 64, 0.5)",
    accent: "#e5484d",
    services: ["Logo Design", "Brand Identity Design", "Graphic Design", "Marketing Creatives"],
    floats: [
      { src: ui("publish-dialog"), iw: 370, ih: 328, x: 98, y: 134, w: 270 },
      { src: ui("typography-panel"), iw: 156, ih: 214, x: 1183, y: 106, w: 156, back: true },
      { src: ui("color-picker"), iw: 236, ih: 344, x: 1104, y: 352, w: 236 },
    ],
  },
  {
    id: "content-communication",
    title: "Content & Communication",
    caption: ["Content &", "Communication"],
    glow: "rgba(232, 168, 56, 0.45)",
    accent: "#f0b44c",
    services: ["Website Content Writing", "Blog Writing", "SEO Content Writing", "Social Media Content", "Marketing Copywriting"],
    floats: [
      { node: <StatsStrip />, x: 34, y: 206, w: 258 },
      { node: <HomeCard />, x: 75, y: 300, w: 100 },
      { src: ui("views-chart"), iw: 222, ih: 128, x: 1114, y: 337, w: 228 },
      { src: ui("top-events"), iw: 324, ih: 162, x: 1055, y: 495, w: 330 },
    ],
  },
];

const photo = (id: string, blur = false) => asset(`/images/services/what-we-do/${id}${blur ? "-blur" : ""}.avif`);

/* Timeline inside one scene's slice of the scroll (0 → 1). */
const T = {
  cardIn: [0, 0.12],
  floatsFrom: 0.1,
  floatStep: 0.08,
  blur: [0.4, 0.52],
  caption: [0.46, 0.56],
  pillsFrom: 0.52,
  pillStep: 0.055,
  out: [0.88, 0.98],
} as const;

export function ServicesShowcase() {
  const reduce = useReducedMotion();
  const live = useMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)") && !reduce;
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: pinRef, offset: ["start start", "end end"] });

  return (
    <section className={styles.section} aria-labelledby="services-what-title">
      <GridDecor tone="blue" className={styles.grid} style={{ left: u(-200), top: u(-150) }} />

      <div className={styles.head}>
        <SectionTitle id="services-what-title" lead="What we" highlight="Do." tone="light" />
        <Reveal>
          <p className={styles.copy}>
            At <b>Thandora</b>, we help businesses grow online through search engine optimization (SEO) and social media
            marketing. Our website design and development services create responsive, user-friendly websites. We run
            targeted Google Ads and pay-per-click (PPC) campaigns to generate leads.
          </p>
        </Reveal>
      </div>

      {/* Always mounted so the scroll tracker has its target from the start. */}
      <div
        ref={pinRef}
        className={live ? styles.pin : styles.list}
        style={live ? { height: `${scenes.length * 170 + 30}vh` } : undefined}
      >
        {live ? (
          <div className={styles.stage}>
            {scenes.map((s, i) => (
              <SceneView key={s.id} scene={s} index={i} count={scenes.length} p={p} />
            ))}
            <Progress p={p} count={scenes.length} />
          </div>
        ) : (
          scenes.map((s) => (
            <Reveal key={s.id} y={40} className={styles.item}>
              <div className={styles.card}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo(s.id)} alt="" width={1084} height={458} loading="lazy" />
                <h3 className="sr-only">{s.title}</h3>
              </div>
              <ul className={styles.listPills}>
                {s.services.map((name) => (
                  <li key={name}>
                    <ServiceLink name={name} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))
        )}
      </div>
    </section>
  );
}

/**
 * 0 → 1 → 0 visibility within scene `index`: arrives over [a, b] of the
 * scene's slice, leaves at its end (the last scene stays). The first card is
 * already in place when the stage pins.
 */
function useVisibility(p: MotionValue<number>, index: number, count: number, a: number, b: number) {
  return useTransform(p, (v) => {
    const t = v * count - index;
    const enter = index === 0 && a === 0 ? 1 : scrollRange(t, a, b, 0, 1);
    const leave = index === count - 1 ? 1 : scrollRange(t, T.out[0], T.out[1], 1, 0);
    return Math.min(enter, leave);
  });
}

/** Plain 0 → 1 over [a, b] of the scene's slice (no exit). */
function useStep(p: MotionValue<number>, index: number, count: number, a: number, b: number) {
  return useTransform(p, (v) => scrollRange(v * count - index, a, b, 0, 1));
}

const hide = (x: number) => (x < 0.05 ? "hidden" : "visible");

function SceneView({ scene, index, count, p }: { scene: Scene; index: number; count: number; p: MotionValue<number> }) {
  const vis = useVisibility(p, index, count, T.cardIn[0], T.cardIn[1]);
  const blur = useTransform(vis, (x) => `blur(${(1 - x) * 18}px)`);
  const scale = useTransform(vis, (x) => 0.94 + 0.06 * x);
  const hidden = useTransform(vis, hide);

  // Second state: photo blurs, big title gives way to the caption.
  const soft = useStep(p, index, count, T.blur[0], T.blur[1]);
  const sharpOpacity = useTransform(soft, (x) => 1 - x);
  const cap = useStep(p, index, count, T.caption[0], T.caption[1]);
  const capY = useTransform(cap, (x) => (1 - x) * 16);

  return (
    <motion.div className={styles.scene} style={{ visibility: hidden }}>
      <motion.div className={styles.glow} style={{ opacity: vis, "--glow": scene.glow } as never} aria-hidden />
      {scene.floats.map((f, k) => (
        <FloatView key={k} float={f} index={index} count={count} order={k} p={p} />
      ))}
      <motion.div className={styles.cardSlot} style={{ opacity: vis, filter: blur, scale }}>
        <div className={styles.card}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo(scene.id, true)} alt="" width={1084} height={458} loading="lazy" />
          <motion.div className={styles.sharp} style={{ opacity: sharpOpacity }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo(scene.id)} alt="" width={1084} height={458} loading="lazy" />
            {/* The big title is painted in the photo; this one is for screen readers. */}
            <h3 className="sr-only">{scene.title}</h3>
          </motion.div>
          <motion.div className={styles.shade} style={{ opacity: soft }} aria-hidden />
          <motion.p className={styles.caption} style={{ opacity: cap, y: capY }} aria-hidden>
            {scene.caption[0]}
            <br />
            {scene.caption[1]}
          </motion.p>
          <ul className={styles.pills} aria-label={`${scene.title} services`}>
            {scene.services.map((name, k) => (
              <Pill key={name} name={name} index={index} count={count} order={k} p={p} />
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Pill({ name, index, count, order, p }: { name: string; index: number; count: number; order: number; p: MotionValue<number> }) {
  const a = T.pillsFrom + order * T.pillStep;
  const vis = useStep(p, index, count, a, a + 0.08);
  const x = useTransform(vis, (v) => (1 - v) * -24);
  const filter = useTransform(vis, (v) => `blur(${(1 - v) * 8}px)`);
  return (
    <motion.li style={{ opacity: vis, x, filter, visibility: useTransform(vis, hide) }}>
      <ServiceLink name={name} />
    </motion.li>
  );
}

function ServiceLink({ name }: { name: string }) {
  // TODO: point at each service's own page once they exist.
  return (
    <Link href="/contact/" className={styles.pill} aria-label={`${name}: start a conversation`}>
      <span>{name}</span>
      <span className={styles.pillIcon} aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

function FloatView({ float: f, index, count, order, p }: { float: Float; index: number; count: number; order: number; p: MotionValue<number> }) {
  const a = T.floatsFrom + order * T.floatStep;
  const vis = useVisibility(p, index, count, a, a + 0.1);
  const blur = useTransform(vis, (x) => `blur(${(1 - x) * 14}px)`);
  const y = useTransform(vis, (x) => (1 - x) * 40);
  const pos = { left: u(f.x), top: u(f.y), width: u(f.w) } as CSSProperties;

  return (
    <motion.div className={`${styles.float} ${f.back ? styles.back : ""}`} style={{ ...pos, opacity: vis, filter: blur, y }} aria-hidden>
      {"src" in f ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.shot} src={f.src} alt="" width={f.iw} height={f.ih} loading="lazy" />
      ) : (
        f.node
      )}
    </motion.div>
  );
}

/**
 * Thin line along the very bottom of the screen that fills left to right
 * over the whole sequence, in the colour of the scene on screen (as in the
 * reference video).
 */
function Progress({ p, count }: { p: MotionValue<number>; count: number }) {
  const color = useTransform(p, (v) => scenes[Math.max(0, Math.min(count - 1, Math.floor(v * count)))].accent);
  // Only shown while the sequence plays: gone once it has filled, so it
  // never follows the visitor into the next section.
  const opacity = useTransform(p, (v) => (v <= 0.001 ? 0 : scrollRange(v, 0.97, 1, 1, 0)));
  return (
    <motion.div className={styles.progress} style={{ opacity }} aria-hidden>
      <motion.i style={{ scaleX: p, backgroundColor: color }} />
    </motion.div>
  );
}

/* ---- Coded floating cards ---- */

function UploadCard() {
  return (
    <div className={`${styles.white} ${styles.upload}`}>
      <div className={styles.uploadTop}>
        <span className={styles.uploadIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5" />
            <path d="M12 12v8M9 15l3-3 3 3" />
          </svg>
        </span>
        <div>
          <strong>Uploading 4 Files</strong>
          <small>43% · 4 minutes left</small>
        </div>
      </div>
      <div className={styles.barRow}>
        <span className={styles.bar}>
          <i />
        </span>
        <span className={styles.pause} />
      </div>
      <small>280 MB of 1.8 GB</small>
    </div>
  );
}

function SalesCard() {
  return (
    <div className={`${styles.white} ${styles.stat}`}>
      <div className={styles.statHead}>
        <span className={styles.statIcon} />
        <div>
          <small>Weekly report</small>
          <strong>Total Sales</strong>
        </div>
      </div>
      <p className={styles.amount}>
        <span>$</span>48,654<em>.00</em>
      </p>
      <small className={styles.delta}>▲ 12.4% vs last week</small>
      <svg viewBox="0 0 120 50" fill="none" className={styles.chart}>
        <path d="M2 40 C14 38 18 30 30 32 S48 22 60 26 76 12 88 18 106 6 118 8" stroke="#c7cddb" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M2 44 C14 42 22 36 34 38 S52 30 64 33 80 22 92 26 108 16 118 18" stroke="#315cff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div className={styles.axis}>
        <span>Mo</span>
        <span>We</span>
        <span>Fr</span>
      </div>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className={`${styles.white} ${styles.profile}`}>
      <div className={styles.profileHead}>
        <div>
          <strong>Roshan.S</strong>
          <small>Product Designer</small>
        </div>
        <span className={styles.dots}>···</span>
      </div>
      <p>
        Design is something that comes naturally, and more importantly on time. AI brings speed and precision but a
        designer brings creativity and taste.
      </p>
      <small>Talk about #UX #Problem-Solving #UI</small>
      <div className={styles.people}>
        <span className={styles.avatars}>
          <i />
          <i />
          <i />
        </span>
        <small>250 Followers | 300 Following</small>
      </div>
      <span className={styles.follow}>Follow</span>
    </div>
  );
}

/** Dark email-stats strip (Figma: growth, conversions, rate). */
function StatsStrip() {
  return (
    <div className={`${styles.dark} ${styles.strip}`}>
      <div>
        <strong>
          <span className={styles.up}>⊞</span> 3.4%
        </strong>
        <small>List Size Growth (MoM)</small>
      </div>
      <div>
        <strong>320</strong>
        <small>Total Conversions</small>
      </div>
      <div>
        <strong>4.6%</strong>
        <small>Conversion Rate</small>
      </div>
    </div>
  );
}

function HomeCard() {
  return (
    <div className={`${styles.dark} ${styles.home}`}>
      <small>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 3h8l4 4v14H6z" />
        </svg>
        Home
      </small>
      <strong>6,292</strong>
      <small>37% of views</small>
    </div>
  );
}
