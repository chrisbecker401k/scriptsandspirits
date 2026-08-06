import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { makeSlug, getSiteContent, saveSiteContent, type EventItem } from "@/lib/siteData";
import { syncWithAdminBackend } from "@/lib/adminGateway";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json({ events: content.events });
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = (await request.json()) as Partial<EventItem>;
  const content = await getSiteContent();

  const nextEvent: EventItem = {
    id: event.id || `${makeSlug(event.title || "event")}-${event.date || Date.now()}`,
    title: event.title?.trim() || "Untitled Event",
    date: event.date || "",
    time: event.time?.trim() || "",
    location: event.location?.trim() || "",
    topic: event.topic?.trim() || event.title?.trim() || "",
    description: event.description?.trim() || "",
    rsvpUrl: event.rsvpUrl?.trim() || "",
    reminderRecipients: event.reminderRecipients?.trim() || "",
  };

  const events = [
    ...content.events.filter((item) => item.id !== nextEvent.id),
    nextEvent,
  ].sort((a, b) => a.date.localeCompare(b.date));

  await saveSiteContent({ ...content, events });
  await syncWithAdminBackend({ action: "saveEvents", events });

  return NextResponse.json({ event: nextEvent, events });
}
