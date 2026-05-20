import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Max 10MB" }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;
  const res = await cloudinary.uploader.upload(dataUri, { folder: "trailtales" });
  return NextResponse.json({ url: res.secure_url });
}
