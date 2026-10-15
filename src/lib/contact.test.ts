import { describe, expect, it } from "vitest";
import { pending } from "@/config/pending";
import { contactLinks } from "./contact";

describe("contactLinks", () => {
  it("returns no links while contact data is pending (O-5)", () => {
    const links = contactLinks({
      phoneE164: pending("O-5", "phone"),
      email: pending("O-5", "email"),
    });
    expect(links).toEqual({ tel: null, viber: null, whatsapp: null, mailto: null });
  });

  it("builds tel, Viber, WhatsApp and mailto links from E.164", () => {
    const links = contactLinks({ phoneE164: "+359 888 123 456", email: "hello@example.test" });
    expect(links.tel).toBe("tel:+359888123456");
    expect(links.viber).toBe("viber://chat?number=%2B359888123456");
    expect(links.whatsapp).toBe("https://wa.me/359888123456");
    expect(links.mailto).toBe("mailto:hello@example.test");
  });
});
