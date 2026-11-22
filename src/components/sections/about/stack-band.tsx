import {
  siApachekafka,
  siClaude,
  siDocker,
  siDotnet,
  siFastapi,
  siGithubactions,
  siGraphql,
  siKubernetes,
  siModelcontextprotocol,
  siMongodb,
  siOpenapiinitiative,
  siPostgresql,
  siPython,
  siQdrant,
  siRedis,
  type SimpleIcon,
} from "simple-icons";

/** Named imports keep the rest of simple-icons out of the build. */
const icons: Record<string, SimpleIcon> = {
  siApachekafka,
  siClaude,
  siDocker,
  siDotnet,
  siFastapi,
  siGithubactions,
  siGraphql,
  siKubernetes,
  siModelcontextprotocol,
  siMongodb,
  siOpenapiinitiative,
  siPostgresql,
  siPython,
  siQdrant,
  siRedis,
};

type Group = {
  readonly group: string;
  readonly items: readonly { readonly name: string; readonly icon?: string }[];
};

function Logo({ name }: { name?: string }) {
  const icon = name ? icons[name] : undefined;
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4 shrink-0 fill-current">
      <path d={icon.path} />
    </svg>
  );
}

function Track({ groups, hidden }: { groups: readonly Group[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-[var(--gap)]">
      {groups.map((g) => (
        <li key={g.group} className="flex items-center gap-3">
          <span className="font-mono text-xs text-accent-text">{g.group}</span>
          <ul className="flex items-center gap-2">
            {g.items.map((it) => (
              <li
                key={it.name}
                className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface-solid/70 px-3.5 font-mono text-[13px] text-foreground"
              >
                <Logo name={it.icon} />
                {it.name}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/**
 * Grouped stack (Phase 6.4). Desktop: one slow marquee (the only one on the
 * page) that pauses on hover. Phones and reduced motion: a wrapped grid.
 * Logos are monochrome so they sit inside the site palette.
 */
export function StackBand({ groups }: { groups: readonly Group[] }) {
  return (
    <section aria-labelledby="stack-title" className="mt-20 md:mt-28">
      <div className="container-page">
        <h3 id="stack-title" className="text-h3 font-semibold">
          Stack
        </h3>
      </div>

      {/* Marquee: md+ and motion allowed */}
      <div
        className="group mt-6 hidden gap-[var(--gap)] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:motion-safe:flex"
        style={{ ["--gap" as string]: "2.5rem", ["--duration" as string]: "60s" }}
      >
        <div className="flex shrink-0 animate-marquee group-hover:[animation-play-state:paused]">
          <Track groups={groups} />
        </div>
        <div className="flex shrink-0 animate-marquee group-hover:[animation-play-state:paused]">
          <Track groups={groups} hidden />
        </div>
      </div>

      {/* Static grouped grid: phones, or reduced motion */}
      <div className="container-page mt-6 md:motion-safe:hidden">
        <dl className="grid gap-6 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.group}>
              <dt className="font-mono text-xs text-accent-text">{g.group}</dt>
              <dd className="mt-2.5 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span
                    key={it.name}
                    className="inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface-solid/70 px-3 font-mono text-xs text-foreground"
                  >
                    <Logo name={it.icon} />
                    {it.name}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
