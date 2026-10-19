import { describe, expect, it } from "vitest";
import { pending } from "@/config/pending";
import { mapLinks } from "./map";

describe("mapLinks", () => {
  it("builds encoded embed and open URLs from the address and city", () => {
    const links = mapLinks("Пловдив", "бул. „Христо Ботев“ 92");
    const query = encodeURIComponent("бул. „Христо Ботев“ 92, Пловдив");
    expect(links).toEqual({
      embed: `https://www.google.com/maps?q=${query}&output=embed`,
      open: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
  });

  it("keeps the query a single parameter", () => {
    const links = mapLinks("Пловдив", "ул. A & B 1")!;
    expect(new URL(links.open).searchParams.get("query")).toBe("ул. A & B 1, Пловдив");
  });

  it("returns null while the address is pending", () => {
    expect(mapLinks("Пловдив", pending("O-11", "Office address"))).toBeNull();
  });
});
