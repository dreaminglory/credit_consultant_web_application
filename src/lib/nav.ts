/** Splits "/#za-men" into its path and hash parts ("/" and "za-men"). */
export function splitHref(href: string): { path: string; hash: string | null } {
  const [path = "/", hash] = href.split("#");
  return { path: path || "/", hash: hash ?? null };
}

/**
 * Whether a header item points at the current page (NAV-5). Section menus match by prefix
 * (`/krediti/ipotechni` highlights Кредити); Home is exact; anchor items are handled by the
 * scroll-spy instead and never match here.
 */
export function isActivePath(pathname: string, href: string): boolean {
  const { path, hash } = splitHref(href);
  if (hash) return false;
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}
