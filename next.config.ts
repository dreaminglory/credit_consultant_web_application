import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { securityHeaders } from "./src/lib/csp";

// Security headers incl. CSP (TR-10). HTTPS-only parts follow the canonical origin, so plain
// http://localhost (`next start`) keeps working.
const dev = process.env.NODE_ENV === "development";
const https = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");

const nextConfig: NextConfig = {
  // Images are pre-optimised at build time by scripts/optimize-images.mjs (A-8).
  images: { unoptimized: true },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({ dev, upgradeInsecure: https, hsts: https && !dev }),
      },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
