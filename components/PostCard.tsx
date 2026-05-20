import Link from "next/link";
import Image from "next/image";

type Props = {
  post: {
    id: string;
    title: string;
    destination: string;
    travelGroup: string;
    createdAt: string | Date;
    author: { name: string | null; image: string | null };
    photos: { url: string }[];
    transportModes: { mode: string }[];
  };
};

const GROUP_LABEL: Record<string,string> = {
  SOLO: "Solo", FAMILY: "Family", PARTNER: "Partner", FRIENDS: "Friends", GROUP_TOUR: "Group tour"
};

export function PostCard({ post }: Props) {
  const cover = post.photos[0]?.url;
  return (
    <Link href={`/post/${post.id}`} className="group block rounded-xl overflow-hidden bg-white shadow-card hover:shadow-cardHover transition">
      <div className="relative aspect-[4/3] bg-forest/5">
        {cover ? (
          <Image src={cover} alt={post.title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-forest/30 font-serif text-5xl">~</div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-terracotta">{post.destination}</p>
        <h3 className="font-serif text-2xl text-forest mt-2 leading-tight line-clamp-2">{post.title}</h3>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>{post.author.name ?? "Traveler"}</span>
          <span>{GROUP_LABEL[post.travelGroup] ?? post.travelGroup}</span>
        </div>
      </div>
    </Link>
  );
}
