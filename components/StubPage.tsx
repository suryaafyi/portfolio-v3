import Link from "next/link";

// Temporary placeholder for routes you'll build next. `cursor:auto` restores the
// native cursor (these pages don't mount the custom Cursor yet).
export default function StubPage({ label }: { label: string }) {
  return (
    <main
      style={{ cursor: "auto" }}
      className="min-h-screen flex flex-col items-center justify-center gap-5 text-center px-6"
    >
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue">{label}</p>
      <h1 className="font-display font-bold text-ink text-5xl">Coming soon.</h1>
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-[0.13em] text-muted underline underline-offset-4"
      >
        ← Home
      </Link>
    </main>
  );
}
