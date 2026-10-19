import type { IconName } from "@/components/ui/Icon";
import type { LoanSlug } from "@/config/site";

/** Icon per loan product, shared by the mega-menu and the mobile panel. */
export const loanIcons: Record<LoanSlug, IconName> = {
  ipotechni: "home",
  refinansirane: "refresh",
  biznes: "briefcase",
  potrebitelski: "wallet",
};
