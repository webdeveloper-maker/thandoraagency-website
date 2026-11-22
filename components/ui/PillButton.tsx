import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "@/styles/ui/PillButton.module.css";

type Variant = "blue" | "white" | "outline";
type Size = "sm" | "md";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  /** Show the 16px arrow icon after the label (md buttons in Figma). */
  arrow?: boolean;
  /** Use a 12px radius instead of a full pill (About banner button). */
  rounded?: boolean;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkProps = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type ButtonProps = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function PillButton(props: LinkProps | ButtonProps) {
  const { variant = "blue", size = "md", arrow = size === "md", rounded, loading, className, children, ...rest } = props;
  const cls = [
    styles.pill,
    styles[variant],
    styles[size],
    rounded ? styles.rounded : "",
    loading ? styles.loading : "",
    className ?? "",
  ].join(" ");

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {loading ? (
        <span className={styles.spinner} aria-hidden />
      ) : arrow ? (
        <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2.836 8h10.33" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9.25 4.083 13.167 8 9.25 11.917" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ) : null}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as LinkProps;
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      return (
        <a href={href} className={cls} {...(linkRest as ComponentPropsWithoutRef<"a">)}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...linkRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonProps, keyof BaseProps>;
  return (
    <button type="button" className={cls} aria-busy={loading || undefined} {...buttonRest}>
      {content}
    </button>
  );
}
