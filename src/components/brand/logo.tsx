import { cn } from "@/lib/utils";

/**
 * Gaurav Raj monogram: "gr" set in mono with a crimson block cursor, like a
 * terminal prompt waiting for input. Pure CSS/text, so it inherits the theme
 * colour and needs no image request.
 *
 * The favicon (app/icon.tsx) draws the same mark at small sizes.
 */
export function Logo({
  className,
  withName = false,
}: {
  className?: string;
  withName?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="inline-flex h-8 items-center gap-[3px] rounded-lg border border-line bg-surface-solid px-2 font-mono text-[15px] font-semibold leading-none tracking-tight text-foreground"
      >
        gr
        <span className="inline-block h-[14px] w-[6px] rounded-[1px] bg-brand" />
      </span>
      {withName ? (
        <span className="text-base font-semibold tracking-tight">Gaurav Raj</span>
      ) : (
        <span className="sr-only">Gaurav Raj</span>
      )}
    </span>
  );
}
