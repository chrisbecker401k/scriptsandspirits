import { promises as fs } from "fs";
import path from "path";
import type { EventItem } from "./siteData";

export type GmailConnectorReminder = {
  id: string;
  event: EventItem;
  to: string;
  subject: string;
  body: string;
  createdAt: string;
};

const outboxPath = path.join(process.cwd(), "data", "gmail-connector-outbox.json");

export async function savePendingGmailReminder(reminder: Omit<GmailConnectorReminder, "id" | "createdAt">) {
  const pending: GmailConnectorReminder = {
    ...reminder,
    id: `gmail-reminder-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(outboxPath), { recursive: true });
  await fs.writeFile(outboxPath, `${JSON.stringify(pending, null, 2)}\n`);

  return pending;
}
