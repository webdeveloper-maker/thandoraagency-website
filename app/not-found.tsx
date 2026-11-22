import { PillButton } from "@/components/ui/PillButton";
import styles from "@/styles/pages/not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>
        This page wandered off. <span className="t-blue">Let&apos;s get you back.</span>
      </h1>
      <PillButton href="/">Back to home</PillButton>
    </section>
  );
}
