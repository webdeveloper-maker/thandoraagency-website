"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { PillButton } from "@/components/ui/PillButton";
import { ease } from "@/lib/motion";
import styles from "@/styles/layout/Header.module.css";
import { asset } from "@/lib/asset";

/** Parse "rgb(a)(r, g, b[, a])" → [r, g, b, a], or null. */
const parseRgb = (value: string) => {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return [r, g, b, a] as const;
};

/** WCAG relative luminance of an sRGB colour (0 = black, 1 = white). */
const luminance = (r: number, g: number, b: number) => {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

/**
 * Is the page behind point (x, y) dark? Walks the stack of elements under the
 * point (skipping the header itself) and decides from the first one that
 * paints something:
 *  1. data-header-theme="dark" | "light" on any element always wins;
 *  2. a solid background colour → its luminance;
 *  3. a background image/gradient → the element's text colour as a proxy
 *     (sections on dark imagery set light text, and vice versa).
 */
const isDarkAt = (x: number, y: number, header: HTMLElement) => {
  for (const el of document.elementsFromPoint(x, y)) {
    if (header.contains(el) || el.closest("#site-menu")) continue;

    const forced = (el as HTMLElement).closest<HTMLElement>("[data-header-theme]")?.dataset.headerTheme;
    if (forced) return forced === "dark";

    const cs = getComputedStyle(el);
    const bg = parseRgb(cs.backgroundColor);
    if (bg && bg[3] > 0.5) return luminance(bg[0], bg[1], bg[2]) < 0.4;

    if (cs.backgroundImage !== "none" || el.tagName === "IMG" || el.tagName === "VIDEO") {
      const fg = parseRgb(cs.color);
      if (fg) return luminance(fg[0], fg[1], fg[2]) > 0.5;
    }
  }
  return false;
};

const isActive = (pathname: string, href: string) => {
  if (href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));
};

/**
 * Shared header (Figma "Header" 457:4089).
 * Desktop at rest: centred logo + LET'S TALK pill. On hover (or keyboard
 * focus) the logo slides to the left and the inline nav fades in beside the
 * pill. Touch / narrow screens have no hover, so they keep a burger that opens
 * a full-screen navy menu. Transparent over the hero; after 80px it becomes a
 * compact glass bar that hides on scroll down and returns on scroll up.
 * Logo, nav and burger switch between black and white to suit whatever is
 * behind the header (see isDarkAt; mark a section with
 * data-header-theme="dark" | "light" to force it).
 */
export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Re-check what's behind the header on scroll, resize and route change
  // (rAF-throttled), so text and logo flip between black and white.
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const header = headerRef.current;
      if (!header) return;
      const rect = header.getBoundingClientRect();
      const y = Math.max(1, rect.top + rect.height / 2);
      // Sample left, centre and right; majority decides.
      const xs = [0.15, 0.5, 0.85].map((f) => window.innerWidth * f);
      const darkVotes = xs.filter((x) => isDarkAt(x, y, header)).length;
      setDark(darkVotes >= 2);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    schedule();
    const settle = window.setTimeout(schedule, 400); // after page transition
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCompact(y > 80);
    setHidden(y > 240 && y > prev);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const activeHref = nav.find((n) => isActive(pathname, n.href))?.href ?? null;

  return (
    <>
      <header
        ref={headerRef}
        data-theme={dark ? "dark" : "light"}
        className={`${styles.header} ${compact ? styles.compact : ""} ${hidden && !open ? styles.hidden : ""}`}
        data-open={open || undefined}
      >
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.burger}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>

          <Link href="/" className={styles.logo} aria-label="Thandora — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.logoDark} src={asset("/images/logo-black.svg")} alt="" width={240} height={60} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.logoLight} src={asset("/images/logo-white.svg")} alt="" width={240} height={60} />
          </Link>

          <div className={styles.actions}>
            <nav className={styles.nav} aria-label="Primary">
              <ul>
                {nav.map((item, i) => (
                  <li key={item.href} style={{ transitionDelay: `${i * 40}ms` }}>
                    <Link href={item.href} aria-current={item.href === activeHref ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <PillButton href="/contact/" size="sm" className={styles.cta}>
              Let’s Talk
            </PillButton>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className={styles.menu}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: ease.inOut }}
          >
            <nav aria-label="Mobile">
              <ul>
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: ease.out }}
                  >
                    <Link
                      href={item.href}
                      aria-current={item.href === activeHref ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <PillButton href="/contact/" variant="white" className={styles.menuCta} onClick={() => setOpen(false)}>
              Let’s Talk
            </PillButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
