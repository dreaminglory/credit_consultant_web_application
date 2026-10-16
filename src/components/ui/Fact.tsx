import type { ReactNode } from "react";
import { Label } from "./Label";

/** Mono label + bold value pair inside a `<dl>` (contact strip, contact card). */
export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt>
        <Label className="text-muted opacity-100">{label}</Label>
      </dt>
      <dd className="mt-2 font-head text-lg leading-snug font-bold tracking-[-0.01em]">
        {children}
      </dd>
    </div>
  );
}
