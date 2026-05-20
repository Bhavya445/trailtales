import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

const GROUP_LABEL: Record<string,string> = {
  SOLO: "Solo", FAMILY: "Family", PARTNER: "Partner", FRIENDS: "Friends", GROUP_TOUR: "Group tour"
};

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      transportModes: true, stays: true, cafes: true, photos: true
    }
  });
  if (!post) notFound();

  return (
    <article className="container-page py-12">
      <Link href="/feed" className="text-sm text-terracotta hover:underline">← Back to feed</Link>
      <header className="mt-6 max-w-3xl">
        <p className="uppercase tracking-[0.18em] text-terracotta text-xs">{post.destination}</p>
        <h1 className="font-serif text-5xl md:text-6xl text-forest mt-3 leading-[1.05]">{post.title}</h1>
        <div className="flex items-center gap-3 mt-6 text-sm text-muted">
          {post.author.image && <Image src={post.author.image} alt="" width={32} height={32} className="rounded-full" />}
          <span>{post.author.name ?? "Traveler"}</span>
          <span>·</span>
          <span>{format(post.startDate, "MMM d")} – {format(post.endDate, "MMM d, yyyy")}</span>
          <span>·</span>
          <span>{GROUP_LABEL[post.travelGroup]}</span>
        </div>
      </header>

      {post.photos[0] && (
        <div className="relative aspect-[16/9] mt-10 rounded-xl overflow-hidden bg-forest/5">
          <Image src={post.photos[0].url} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-12 mt-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="font-serif text-3xl text-forest mb-4">The trip</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-ink/90">{post.description}</p>
          </section>

          {post.transportModes.length > 0 && (
            <section>
              <h2 className="font-serif text-3xl text-forest mb-4">Getting there</h2>
              <ul className="space-y-3">
                {post.transportModes.map(t => (
                  <li key={t.id} className="border-l-2 border-terracotta/60 pl-4">
                    <div className="font-medium">{t.mode}</div>
                    {t.details && <div className="text-muted text-sm mt-1">{t.details}</div>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {post.stays.length > 0 && (
            <section>
              <h2 className="font-serif text-3xl text-forest mb-4">Where I stayed</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {post.stays.map(s => (
                  <div key={s.id} className="p-5 rounded-xl bg-white shadow-card">
                    <div className="text-xs uppercase tracking-wider text-terracotta">{s.type}</div>
                    <div className="font-serif text-xl text-forest mt-1">{s.name}</div>
                    <div className="text-sm text-muted">{s.location}</div>
                    <div className="flex gap-4 text-sm text-muted mt-3">
                      {s.costPerNight != null && <span>₹{s.costPerNight}/night</span>}
                      {s.rating != null && <span>★ {s.rating}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {post.cafes.length > 0 && (
            <section>
              <h2 className="font-serif text-3xl text-forest mb-4">Food & cafes</h2>
              <ul className="space-y-4">
                {post.cafes.map(c => (
                  <li key={c.id} className="flex justify-between gap-4 border-b border-forest/10 pb-4">
                    <div>
                      <div className="font-medium text-ink">{c.name} <span className="text-muted text-sm">· {c.location}</span></div>
                      {c.hadWhat && <div className="text-sm text-muted mt-1">{c.hadWhat}</div>}
                    </div>
                    {c.rating != null && <div className="text-sm text-muted shrink-0">★ {c.rating}</div>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {post.photos.length > 1 && (
            <section>
              <h2 className="font-serif text-3xl text-forest mb-4">Gallery</h2>
              <div className="grid grid-cols-2 gap-3">
                {post.photos.slice(1).map(p => (
                  <figure key={p.id}>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-forest/5">
                      <Image src={p.url} alt={p.caption ?? ""} fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" />
                    </div>
                    {p.caption && <figcaption className="text-xs text-muted mt-2">{p.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="md:sticky md:top-24 h-fit p-6 rounded-xl bg-white shadow-card">
          <div className="flex items-center gap-3">
            {post.author.image && <Image src={post.author.image} alt="" width={48} height={48} className="rounded-full" />}
            <div>
              <div className="font-serif text-lg text-forest">{post.author.name ?? "Traveler"}</div>
              <div className="text-xs text-muted">Author</div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
