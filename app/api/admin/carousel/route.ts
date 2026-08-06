import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSiteContent, makeSlug, saveSiteContent, type CarouselImage } from "@/lib/siteData";
import { syncWithAdminBackend } from "@/lib/adminGateway";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json({ carousel: content.carousel });
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const image = (await request.json()) as Partial<CarouselImage>;
  const content = await getSiteContent();

  const nextImage: CarouselImage = {
    id: image.id || `${makeSlug(image.caption || image.alt || image.src || "image")}-${Date.now()}`,
    src: image.src?.trim() || "",
    alt: image.alt?.trim() || "Scripts and Spirits gathering photo.",
    caption: image.caption?.trim() || "",
  };

  if (!nextImage.src) {
    return NextResponse.json({ error: "Image source is required." }, { status: 400 });
  }

  const carousel = [
    ...content.carousel.filter((item) => item.id !== nextImage.id),
    nextImage,
  ];

  await saveSiteContent({ ...content, carousel });
  await syncWithAdminBackend({ action: "saveCarousel", carousel });

  return NextResponse.json({ image: nextImage, carousel });
}
