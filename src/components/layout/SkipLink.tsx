/** First focusable element on every page; jumps past the header to the main content. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-ink px-5 py-3 font-semibold text-white no-underline transition-transform duration-150 focus-visible:translate-y-0"
    >
      Към съдържанието
    </a>
  );
}
