import Script from "next/script";

/**
 * Mounts the first-party tracker (public/t.js) after hydration. The script
 * self-gates on DNT/GPC, /admin paths, and the disable_tracking flag.
 */
export function Analytics() {
  const endpoint = process.env.NEXT_PUBLIC_COLLECT_ENDPOINT || "/api/collect";
  return <Script src="/t.js" strategy="afterInteractive" data-endpoint={endpoint} />;
}
