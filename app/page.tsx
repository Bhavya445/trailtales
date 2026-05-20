import Link from "next/link";

export default function Home() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="max-w-3xl">
        <p className="uppercase tracking-[0.18em] text-terracotta text-xs mb-6">An editorial travel journal</p>
        <h1 className="text-5xl md:text-7xl leading-[1.05] text-forest">
          The trips you took, told the way they deserve.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-xl">
          TrailTales is a quiet corner of the internet for travelers who keep notes — routes, stays,
          the cafe with the cardamom coffee. Share yours, find others worth following.
        </p>
        <div className="mt-10 flex gap-3">
          <Link href="/feed" className="px-5 py-3 rounded-xl bg-forest text-cream hover:bg-forest-deep transition">
            Read the feed
          </Link>
          <Link href="/create" className="px-5 py-3 rounded-xl border border-forest/20 text-forest hover:bg-forest/5 transition">
            Write a trip
          </Link>
        </div>
      </div>
    </section>
  );
}
