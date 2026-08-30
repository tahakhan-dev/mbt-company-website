"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils/format";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "surface";
  size?: "md" | "lg" | "sm";
  /** Hide the trailing arrow-in-circle. */
  plain?: boolean;
  magnetic?: boolean;
  className?: string;
  disabled?: boolean;
  /** Forwarded to the analytics tracker (data-cta attribute). */
  cta?: string;
  target?: string;
  ariaLabel?: string;
};

/**
 * Button-in-button CTA: pill with the trailing arrow nested in its own
 * circular wrapper, magnetic hover, press physics. `primary` is the single
 * warm (amber) action per screen.
 */
export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  plain = false,
  magnetic = true,
  className,
  disabled,
  cta,
  target,
  ariaLabel,
}: ButtonProps) {
  const base = cn(
    "group inline-flex select-none items-center justify-center gap-3 rounded-full font-medium",
    "transition-[background-color,color,box-shadow,transform] duration-300 ease-swift",
    "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
    size === "lg" && "px-7 py-3.5 text-base",
    size === "md" && "px-6 py-3 text-[0.95rem]",
    size === "sm" && "px-4 py-2 text-sm",
    variant === "primary" &&
      "bg-cta text-cta-ink shadow-[0_0_28px_-8px_var(--cta-glow)] hover:bg-cta-hover",
    variant === "ghost" &&
      "text-ink ring-1 ring-hairline-strong hover:bg-bezel hover:ring-[color:color-mix(in_oklab,var(--hairline-strong)_130%,transparent)]",
    variant === "surface" && "bg-raised text-ink inner-glow soft-shadow hover:bg-lift",
    className,
  );

  const arrowWrap = cn(
    "grid size-6 place-items-center rounded-full transition-transform duration-300 ease-swift",
    size === "lg" && "size-7",
    size === "sm" && "size-5",
    variant === "primary" ? "bg-cta-ink/15" : "bg-bezel-hover",
  );

  const inner = (
    <>
      <span>{children}</span>
      {!plain && (
        <span className={arrowWrap} aria-hidden="true">
          <ArrowUpRight
            weight="bold"
            className={cn(
              "size-3.5 transition-transform duration-300 ease-swift",
              "group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]",
            )}
          />
        </span>
      )}
    </>
  );

  const el = href ? (
    <Link
      href={href}
      className={base}
      data-cta={cta}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {inner}
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      className={base}
      disabled={disabled}
      data-cta={cta}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );

  return magnetic ? <Magnetic strength={0.22}>{el}</Magnetic> : el;
}
