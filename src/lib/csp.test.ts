import { describe, expect, it } from "vitest";
import { contentSecurityPolicy, securityHeaders } from "./csp";

const directive = (policy: string, name: string) =>
  policy
    .split("; ")
    .find((d) => d.startsWith(`${name} `))
    ?.split(" ")
    .slice(1) ?? [];

describe("contentSecurityPolicy", () => {
  const prod = contentSecurityPolicy({ dev: false, upgradeInsecure: true });

  it("locks down defaults, objects, framing and forms", () => {
    expect(directive(prod, "default-src")).toEqual(["'self'"]);
    expect(directive(prod, "object-src")).toEqual(["'none'"]);
    expect(directive(prod, "frame-ancestors")).toEqual(["'none'"]);
    expect(directive(prod, "form-action")).toEqual(["'self'"]);
    expect(prod).toContain("upgrade-insecure-requests");
  });

  it("allows the third parties the site uses", () => {
    expect(directive(prod, "script-src")).toEqual(
      expect.arrayContaining([
        "https://challenges.cloudflare.com",
        "https://static.cloudflareinsights.com",
        "https://www.googletagmanager.com",
        "https://connect.facebook.net",
      ]),
    );
    expect(directive(prod, "frame-src")).toEqual(
      expect.arrayContaining(["https://challenges.cloudflare.com", "https://www.google.com"]),
    );
    expect(directive(prod, "connect-src")).toEqual(
      expect.arrayContaining(["https://www.google.bg", "https://www.google.de"]),
    );
  });

  it("allows eval and websockets only in development", () => {
    expect(directive(prod, "script-src")).not.toContain("'unsafe-eval'");
    expect(directive(prod, "connect-src")).not.toContain("ws:");
    const dev = contentSecurityPolicy({ dev: true, upgradeInsecure: false });
    expect(directive(dev, "script-src")).toContain("'unsafe-eval'");
    expect(directive(dev, "connect-src")).toContain("ws:");
    expect(dev).not.toContain("upgrade-insecure-requests");
  });
});

describe("securityHeaders", () => {
  it("adds HSTS only when asked", () => {
    const keys = (hsts: boolean) =>
      securityHeaders({ dev: false, upgradeInsecure: hsts, hsts }).map((h) => h.key);
    expect(keys(true)).toContain("Strict-Transport-Security");
    expect(keys(false)).not.toContain("Strict-Transport-Security");
    expect(keys(false)).toContain("Content-Security-Policy");
  });
});
