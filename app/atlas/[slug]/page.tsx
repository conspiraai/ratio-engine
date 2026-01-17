import Link from "next/link";
import { notFound } from "next/navigation";
import AtlasSceneClient from "@/app/components/atlas/AtlasSceneClient";
import MarkdownContent from "@/app/components/atlas/MarkdownContent";
import { getRatioBySlug } from "@/app/lib/atlas/ratios";

const toAnchorId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default function AtlasEntryPage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = getRatioBySlug(params.slug);

  if (!entry) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 py-16 text-[var(--fg)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Link
              href="/atlas"
              className="atlas-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.65rem] uppercase tracking-[0.4em]"
            >
              Atlas Index
            </Link>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
                Ratio Entry
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                {entry.tagline}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {entry.title}
              </h1>
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-5xl font-semibold text-[var(--fg)]">
                  {entry.symbol}
                </span>
                <span className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
                  {entry.value}
                </span>
                <span className="text-sm text-[var(--muted)]">
                  {entry.exactForm}
                </span>
              </div>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
                {entry.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.24em] text-[var(--muted)]">
              {entry.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-white/10 px-3 py-1"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <AtlasSceneClient slug={params.slug} />
        </header>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-4 text-xs uppercase tracking-[0.35em] text-[var(--muted)] lg:sticky lg:top-10 lg:self-start">
            <p className="text-[var(--fg)]">Atlas Index</p>
            <nav className="flex flex-col gap-3 text-[0.65rem]">
              {entry.sections.map((section) => {
                const anchor = toAnchorId(section.title);
                return (
                  <a
                    key={section.title}
                    href={`#${anchor}`}
                    className="transition hover:text-[var(--fg)]"
                  >
                    {section.title}
                  </a>
                );
              })}
            </nav>
          </aside>

          <main className="space-y-10">
            {entry.sections.map((section) => {
              const anchor = toAnchorId(section.title);
              return (
                <section key={section.title} id={anchor} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-[var(--fg)]">
                    {section.title}
                  </h2>
                  <MarkdownContent content={section.body} />
                  {section.bullets ? (
                    <ul className="space-y-2 pl-4 text-sm leading-7 text-[var(--muted)]">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="list-disc">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}

            <section className="glass-card rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-[var(--fg)]">
                References
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                {entry.references.map((reference) => (
                  <li key={reference.url}>
                    <a
                      href={reference.url}
                      className="underline decoration-white/20 underline-offset-4 transition hover:text-[var(--fg)]"
                    >
                      {reference.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
