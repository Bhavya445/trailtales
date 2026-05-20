import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const group = searchParams.get("group")?.trim();
  const mode = searchParams.get("mode")?.trim();

  const posts = await prisma.post.findMany({
    where: {
      AND: [
        q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { destination: { contains: q, mode: "insensitive" } }] } : {},
        group ? { travelGroup: group } : {},
        mode ? { transportModes: { some: { mode } } } : {}
      ]
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, image: true } },
      photos: { take: 1 },
      transportModes: { select: { mode: true } }
    },
    take: 60
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const data = postSchema.parse(body);
    const post = await prisma.post.create({
      data: {
        title: data.title,
        description: data.description,
        destination: data.destination,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        travelGroup: data.travelGroup,
        authorId: session.user.id,
        transportModes: { create: data.transportModes.map(t => ({ mode: t.mode, details: t.details || null })) },
        stays: { create: data.stays.map(s => ({ ...s, costPerNight: s.costPerNight ?? null, rating: s.rating ?? null })) },
        cafes: { create: data.cafes.map(c => ({ name: c.name, location: c.location, hadWhat: c.hadWhat || null, rating: c.rating ?? null })) },
        photos: { create: data.photos.map(p => ({ url: p.url, caption: p.caption || null })) }
      },
      select: { id: true }
    });
    return NextResponse.json(post, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid post" }, { status: 400 });
  }
}
