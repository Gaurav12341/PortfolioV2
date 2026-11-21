import { cn } from "@/lib/utils";

/**
 * A margin note in Victor Mono's cursive italics, like a pen aside on the
 * page's graph paper. Use sparingly (2–3 per page) and only for true
 * statements. Hidden below `lg` by default, where there's no margin for it.
 */
export function HandNote({
  children,
  className,
  showOnMobile = false,
}: {
  children: React.ReactNode;
  className?: string;
  showOnMobile?: boolean;
}) {
  return (
    <span
      className={cn(
        "type-note pointer-events-none select-none whitespace-nowrap text-[1.05rem] leading-none",
        !showOnMobile && "hidden lg:inline-block",
        className,
      )}
    >
      {children}
    </span>
  );
}
