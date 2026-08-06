import { NextResponse } from "next/server";
import { buildReminderDraft, syncWithAdminBackend } from "@/lib/adminGateway";
import { getAdminSession } from "@/lib/auth";
import { savePendingGmailReminder } from "@/lib/gmailOutbox";
import { getSiteContent } from "@/lib/siteData";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId, recipients } = (await request.json()) as {
    eventId?: string;
    recipients?: string;
  };

  const content = await getSiteContent();
  const event = content.events.find((item) => item.id === eventId);

  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const recipientList = (recipients || event.reminderRecipients || "")
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (recipientList.length === 0) {
    return NextResponse.json({ error: "Add at least one reminder recipient." }, { status: 400 });
  }

  const draft = buildReminderDraft(event);
  const sync = process.env.SCRIPTS_SPIRITS_ADMIN_WEBHOOK_URL
    ? await syncWithAdminBackend({
        action: "sendReminder",
        event,
        recipients: recipientList,
        ...draft,
      })
    : { ok: true, mode: "gmailConnector" as const };
  const pending =
    sync.mode === "gmailConnector"
      ? await savePendingGmailReminder({
          event,
          to: recipientList.join(","),
          ...draft,
        })
      : null;

  return NextResponse.json({
    mode: sync.mode,
    to: recipientList.join(","),
    pendingId: pending?.id,
    ...draft,
  });
}
