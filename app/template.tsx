import styles from "@/styles/app/template.module.css";

/**
 * Remounts on every navigation, so the navy curtain (with the logo mark)
 * sweeps up for 500ms between pages. Pure CSS, so it never blocks first paint
 * waiting for JavaScript.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.curtain} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-mark-white.avif" alt="" width={64} height={60} />
      </div>
      {children}
    </>
  );
}
