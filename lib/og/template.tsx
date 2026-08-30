import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

async function loadFonts() {
  const dir = path.join(process.cwd(), "lib/og");
  const [medium, bold] = await Promise.all([
    readFile(path.join(dir, "SpaceGrotesk-Medium.ttf")),
    readFile(path.join(dir, "SpaceGrotesk-Bold.ttf")),
  ]);
  return [
    { name: "Space Grotesk", data: medium, weight: 500 as const },
    { name: "Space Grotesk", data: bold, weight: 700 as const },
  ];
}

/** Brand OG template: Void ground, aurora orbs, constellation, big title. */
export async function brandOgImage({
  title,
  eyebrow,
  metric,
  siteName,
}: {
  title: string;
  eyebrow: string;
  metric?: string;
  siteName: string;
}) {
  const fonts = await loadFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#05070C",
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(129,140,248,0.28), transparent 46%), radial-gradient(circle at 12% 88%, rgba(34,211,238,0.22), transparent 42%), radial-gradient(circle at 60% 55%, rgba(94,234,212,0.10), transparent 50%)",
          color: "#EEF2F8",
          fontFamily: "Space Grotesk",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {siteName}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundImage: "linear-gradient(135deg, #22d3ee, #818cf8)",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 17,
              letterSpacing: "0.25em",
              color: "#8f9cb3",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: title.length > 60 ? 54 : 66,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.04,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {metric && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "1px solid rgba(94,234,212,0.45)",
                  color: "#5EEAD4",
                  fontSize: 24,
                  fontWeight: 500,
                }}
              >
                {metric}
              </div>
            )}
            <div style={{ color: "#8f9cb3", fontSize: 22 }}>
              AI products, engineered end to end
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
