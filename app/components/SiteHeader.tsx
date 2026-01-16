import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-[0.2em]">
          Ratio Engine
        </Link>
        <nav className="flex items-center gap-6 text-sm uppercase tracking-[0.3em] text-white/70">
          <Link href="/ratios" className="transition hover:text-white">
            Ratios
          </Link>
        </nav>
      </div>
    </header>
  );
}
