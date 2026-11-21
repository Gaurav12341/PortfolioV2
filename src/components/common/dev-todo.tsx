/**
 * Visible only in development: lists facts still marked ❓ in PROJECTS.md.
 * Never renders in a production build, so unconfirmed content can't ship.
 */
export function DevTodo({ items, className }: { items?: readonly string[]; className?: string }) {
  if (process.env.NODE_ENV === "production" || !items?.length) return null;
  return (
    <div
      className={
        "rounded-xl border border-dashed border-amber-500/60 bg-amber-500/10 p-3 font-mono text-[11px] leading-relaxed text-amber-700 dark:text-amber-300 " +
        (className ?? "")
      }
    >
      <p className="mb-1 font-semibold uppercase tracking-wider">TODO (dev only) · confirm in PROJECTS.md</p>
      <ul className="list-disc pl-4">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
