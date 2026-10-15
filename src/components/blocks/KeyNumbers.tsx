import { isPending } from "@/config/pending";
import { keyNumbers } from "@/content/home";
import { CountUp } from "@/components/ui/CountUp";
import { Label } from "@/components/ui/Label";
import { Value } from "@/components/ui/Placeholder";

/** Key numbers (B-20). Only real figures: unknown ones show a marked placeholder (O-7). */
export function KeyNumbers() {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {keyNumbers.map((item) => (
        <div
          key={item.label}
          className="flex flex-col-reverse justify-end gap-2 rounded-tile border border-line bg-white p-[18px]"
        >
          <dt>
            <Label className="text-muted opacity-100">{item.label}</Label>
          </dt>
          <dd className="font-head text-[40px] leading-none font-extrabold tracking-[-0.04em] text-petrol">
            {isPending(item.value) ? <Value value={item.value} /> : <CountUp value={item.value} />}
          </dd>
        </div>
      ))}
    </dl>
  );
}
