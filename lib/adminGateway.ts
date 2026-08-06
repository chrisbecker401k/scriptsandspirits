import type { CarouselImage, EventItem, SiteContent } from "./siteData";

const webhookUrl = process.env.SCRIPTS_SPIRITS_ADMIN_WEBHOOK_URL;
const spreadsheetId =
  process.env.SCRIPTS_SPIRITS_SPREADSHEET_ID ?? "1qQvda4ug6MCbdQTIYqqL52iA6rV_9aWlUP6zxi3sFRM";

type AdminAction =
  | { action: "saveCarousel"; carousel: CarouselImage[] }
  | { action: "saveEvents"; events: EventItem[] }
  | { action: "sendReminder"; event: EventItem; subject: string; body: string; recipients: string[] }
  | { action: "verifyLogin"; username: string; password: string };

export async function syncWithAdminBackend(payload: AdminAction) {
  if (!webhookUrl) {
    return { ok: true, mode: "local" as const };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ spreadsheetId, ...payload }),
  });

  if (!response.ok) {
    throw new Error(`Admin backend returned ${response.status}`);
  }

  return { ok: true, mode: "webhook" as const };
}

export function buildReminderDraft(event: EventItem) {
  const subject = `Reminder: Scripts & Spirits - ${event.title}`;
  const body = [
    `Quick reminder that Scripts & Spirits is coming up:`,
    "",
    `${event.title}`,
    `${event.date} at ${event.time}`,
    event.location,
    "",
    event.description,
    "",
    event.rsvpUrl ? `RSVP/details: ${event.rsvpUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, body };
}

export async function verifyAdminLogin(username: string, password: string) {
  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ spreadsheetId, action: "verifyLogin", username, password }),
    });

    if (!response.ok) {
      throw new Error(`Admin login backend returned ${response.status}`);
    }

    const result = (await response.json()) as {
      ok?: boolean;
      name?: string;
      email?: string;
    };

    if (!result.ok) return null;

    return {
      email: result.email || username,
      name: result.name || username,
    };
  }

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return {
      email: username,
      name: username,
    };
  }

  return null;
}

export function gmailComposeUrl(recipients: string[], subject: string, body: string) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: recipients.join(","),
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function emptyContent(): SiteContent {
  return { carousel: [], events: [] };
}
