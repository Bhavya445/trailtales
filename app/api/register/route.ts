import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    const passwordHash = await bcrypt.hash(data.password, 10);
    await prisma.user.create({ data: { name: data.name, email: data.email, passwordHash } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid input" }, { status: 400 });
  }
}
