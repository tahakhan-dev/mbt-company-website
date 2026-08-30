"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils/format";

/**
 * Admin UI kit — shadcn-patterned primitives vendored in-repo. Clean, fast,
 * functional dark UI: the theatrical patterns stay on the marketing site.
 */

export function AdminButton({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost" | "danger";
  size?: "md" | "sm" | "icon";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-aurora-cyan",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "md" && "h-9 px-4 text-sm",
        size === "sm" && "h-8 px-3 text-xs",
        size === "icon" && "size-9",
        variant === "default" && "bg-white/8 text-ink ring-1 ring-white/10 hover:bg-white/12",
        variant === "primary" && "bg-cta text-void hover:bg-cta-bright",
        variant === "ghost" && "text-ink-muted hover:bg-white/6 hover:text-ink",
        variant === "danger" && "bg-[#3a1420] text-[#ff9d9d] ring-1 ring-[#ff9d9d]/25 hover:bg-[#4a1a28]",
        className,
      )}
      {...props}
    />
  );
}

export const AdminInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function AdminInput({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-9 w-full rounded-lg bg-white/[0.05] px-3 text-sm text-ink ring-1 ring-white/10",
          "placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-aurora-cyan/60",
          className,
        )}
        {...props}
      />
    );
  },
);

export const AdminTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function AdminTextarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg bg-white/[0.05] px-3 py-2 text-sm text-ink ring-1 ring-white/10",
        "placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-aurora-cyan/60",
        className,
      )}
      {...props}
    />
  );
});

export const AdminSelect = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function AdminSelect({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-9 w-full appearance-none rounded-lg bg-raised px-3 text-sm text-ink ring-1 ring-white/10",
        "focus:outline-none focus:ring-2 focus:ring-aurora-cyan/60",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export function AdminLabel({
  children,
  htmlFor,
  hint,
  className,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-1.5 block text-xs font-medium text-ink-muted", className)}>
      {children}
      {hint && <span className="ml-2 font-normal text-ink-faint">{hint}</span>}
    </label>
  );
}

export function AdminCard({
  children,
  className,
  title,
  actions,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={cn("rounded-xl bg-surface ring-1 ring-white/8", className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-3.5">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {actions}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "teal" | "amber" | "violet" | "red" | "green";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] ring-1",
        tone === "neutral" && "bg-white/6 text-ink-muted ring-white/10",
        tone === "teal" && "bg-aurora-teal/10 text-aurora-teal ring-aurora-teal/25",
        tone === "amber" && "bg-cta/10 text-cta ring-cta/25",
        tone === "violet" && "bg-aurora-violet/10 text-aurora-violet ring-aurora-violet/25",
        tone === "red" && "bg-[#ff9d9d]/10 text-[#ff9d9d] ring-[#ff9d9d]/25",
        tone === "green" && "bg-[#7ee2a8]/10 text-[#7ee2a8] ring-[#7ee2a8]/25",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  detail,
  action,
}: {
  title: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-white/12 px-6 py-14 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {detail && <p className="mt-1.5 max-w-sm text-sm text-ink-faint">{detail}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Accessible modal on the native <dialog> element. */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-full rounded-2xl bg-transparent p-0 text-ink backdrop:bg-void/70 backdrop:backdrop-blur-sm",
        wide ? "max-w-3xl" : "max-w-lg",
      )}
    >
      <div className="max-h-[85vh] overflow-y-auto rounded-2xl bg-raised p-6 ring-1 ring-white/12">
        <h2 className="mb-5 text-base font-semibold">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

export function FieldRow({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}
