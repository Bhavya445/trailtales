import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, image: true, bio: true } },
      transportModes: true, stays: true, cafes: true, photos: true
    }
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const post = await prisma.post.findUnique({ where: { id: params.id }, select: { authorId: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.authorId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
