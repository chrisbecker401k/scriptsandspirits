import { promises as fs } from "fs";
import path from "path";

export type CarouselImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  topic: string;
  description: string;
  rsvpUrl: string;
  reminderRecipients?: string;
};

export type SiteContent = {
  carousel: CarouselImage[];
  events: EventItem[];
};

const contentPath = path.join(process.cwd(), "data", "site-content.json");

const defaultContent: SiteContent = {
  carousel: [
    {
      id: "group-table",
      src: "/scripts-spirits-group.png",
      alt: "A Scripts and Spirits gathering around an outdoor table with books and drinks.",
      caption: "Around the table",
    },
    {
      id: "gathering-photo",
      src: "/IMG_9375.png",
      alt: "A Scripts and Spirits gathering photo.",
      caption: "Good drinks, better conversation",
    },
  ],
  events: [
    {
      id: "covenantal-theology-2026-09-22",
      title: "Covenantal Theology",
      date: "2026-09-22",
      time: "8:30 PM",
      location: "Vasso, Dublin",
      topic: "Covenantal Theology",
      description:
        "How Scripture tells one unified story through God's promises, how those covenants shape our reading of the Bible, and why they matter for faith and daily life.",
      rsvpUrl: "https://calendar.app.google/AYStPMaNjjiUHd5P8",
      reminderRecipients: "",
    },
  ],
};

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(contentPath, "utf8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return defaultContent;
  }
}

export async function saveSiteContent(content: SiteContent) {
  await fs.mkdir(path.dirname(contentPath), { recursive: true });
  await fs.writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`);
}

export function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
}

export function formatEventDate(value: string) {
  if (!value) return "";

  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function firstUpcomingEvent(events: EventItem[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    [...events]
      .sort((a, b) => a.date.localeCompare(b.date))
      .find((event) => {
        const eventDate = new Date(`${event.date}T12:00:00`);
        return !Number.isNaN(eventDate.getTime()) && eventDate >= today;
      }) ?? events[0]
  );
}
