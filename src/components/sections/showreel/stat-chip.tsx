import type { ElementType } from "react";
import { CountUp } from "./count-up";

interface StatChipProps {
  icon: ElementType;
  value: number;
  suffix?: string;
  label: string;
  trigger: boolean;
}

export function StatChip({
  icon: Icon,
  value,
  suffix,
  label,
  trigger,
}: StatChipProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md">
      <Icon size={12} className="text-white/50" />
      <span className="flex items-baseline font-mono text-xs font-semibold text-white">
        <CountUp to={value} trigger={trigger} />
        {suffix}
      </span>
      <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
