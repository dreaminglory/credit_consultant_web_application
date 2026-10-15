import { describe, expect, it } from "vitest";
import { isActivePath, splitHref } from "./nav";

describe("splitHref", () => {
  it("separates path and hash", () => {
    expect(splitHref("/#za-men")).toEqual({ path: "/", hash: "za-men" });
    expect(splitHref("/kontakti")).toEqual({ path: "/kontakti", hash: null });
  });
});

describe("isActivePath", () => {
  it("matches section prefixes but not look-alikes", () => {
    expect(isActivePath("/krediti/ipotechni", "/krediti")).toBe(true);
    expect(isActivePath("/krediti", "/krediti")).toBe(true);
    expect(isActivePath("/kreditite", "/krediti")).toBe(false);
  });

  it("never marks anchor items by path", () => {
    expect(isActivePath("/", "/#za-men")).toBe(false);
  });

  it("matches Home exactly", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/kontakti", "/")).toBe(false);
  });
});
