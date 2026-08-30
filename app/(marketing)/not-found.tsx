import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AuroraBackdrop } from "@/components/ui/AuroraBackdrop";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] items-center overflow-hidden">
      <AuroraBackdrop intensity="soft" />
      <div className="relative mx-auto w-full max-w-3xl px-4 text-center md:px-8">
        <p
          className="mx-auto font-mono text-[7rem] leading-none md:text-[10rem]"
          style={{ color: "rgba(94,234,212,0.4)" }}
          aria-hidden="true"
        >
          404
        </p>
        <h1 className="mt-6 font-display text-title font-medium">
          This page shipped to another universe.
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-muted">
          The link is broken or the page has moved. Everything we actually ship is one click
          away.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" cta="404-home">
            Back to home
          </Button>
          <Button href="/work" variant="ghost">
            See our work
          </Button>
        </div>
        <p className="mt-10 text-sm text-ink-faint">
          Looking for something specific?{" "}
          <Link href="/contact" className="text-aurora-teal underline-offset-4 hover:underline">
            Ask us directly
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
