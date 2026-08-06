import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { makeSlug } from "@/lib/siteData";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Upload a JPG, PNG, WebP, or GIF image." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const basename = makeSlug(path.basename(file.name, extension)) || "carousel";
  const filename = `${basename}-${Date.now()}${extension.toLowerCase()}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), bytes);

  return NextResponse.json({ src: `/uploads/${filename}` });
}
