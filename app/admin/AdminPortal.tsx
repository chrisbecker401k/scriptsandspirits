"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CarouselImage, EventItem, SiteContent } from "@/lib/siteData";

type Status = {
  tone: "idle" | "success" | "error";
  message: string;
};

const blankEvent: EventItem = {
  id: "",
  title: "",
  date: "",
  time: "",
  location: "",
  topic: "",
  description: "",
  rsvpUrl: "",
  reminderRecipients: "",
};

export function AdminPortal({
  adminEmail,
  initialContent,
}: {
  adminEmail: string;
  initialContent: SiteContent;
}) {
  const [carousel, setCarousel] = useState(initialContent.carousel);
  const [events, setEvents] = useState(initialContent.events);
  const [imageDraft, setImageDraft] = useState<Partial<CarouselImage>>({});
  const [eventDraft, setEventDraft] = useState<EventItem>(blankEvent);
  const [selectedReminderEvent, setSelectedReminderEvent] = useState(initialContent.events[0]?.id ?? "");
  const [reminderRecipients, setReminderRecipients] = useState(initialContent.events[0]?.reminderRecipients ?? "");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<Status>({
    tone: "idle",
    message: "Ready to update the site.",
  });

  const reminderEvent = useMemo(
    () => events.find((event) => event.id === selectedReminderEvent),
    [events, selectedReminderEvent],
  );

  async function saveImage() {
    setStatus({ tone: "idle", message: "Saving carousel image..." });
    const response = await fetch("/api/admin/carousel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(imageDraft),
    });

    const payload = await response.json();
    if (!response.ok) {
      setStatus({ tone: "error", message: payload.error || "Could not save image." });
      return;
    }

    setCarousel(payload.carousel);
    setImageDraft({});
    setStatus({ tone: "success", message: "Carousel image saved." });
  }

  async function uploadImage(file: File | null) {
    if (!file) return;

    setUploading(true);
    setStatus({ tone: "idle", message: "Uploading image..." });

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();

    setUploading(false);

    if (!response.ok) {
      setStatus({ tone: "error", message: payload.error || "Could not upload image." });
      return;
    }

    setImageDraft((draft) => ({ ...draft, src: payload.src }));
    setStatus({ tone: "success", message: "Image uploaded. Add alt text, then save it to the carousel." });
  }

  async function saveEvent() {
    setStatus({ tone: "idle", message: "Saving event..." });
    const response = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(eventDraft),
    });
    const payload = await response.json();

    if (!response.ok) {
      setStatus({ tone: "error", message: payload.error || "Could not save event." });
      return;
    }

    setEvents(payload.events);
    setSelectedReminderEvent(payload.event.id);
    setReminderRecipients(payload.event.reminderRecipients || "");
    setEventDraft(blankEvent);
    setStatus({ tone: "success", message: "Event saved." });
  }

  async function sendReminder() {
    setStatus({ tone: "idle", message: "Preparing Gmail reminder..." });
    const response = await fetch("/api/admin/reminders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventId: selectedReminderEvent,
        recipients: reminderRecipients,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setStatus({ tone: "error", message: payload.error || "Could not prepare reminder." });
      return;
    }

    if (payload.composeUrl) {
      window.open(payload.composeUrl, "_blank", "noopener,noreferrer");
      setStatus({ tone: "success", message: "Gmail compose opened with the reminder ready to send." });
      return;
    }

    if (payload.mode === "gmailConnector") {
      setStatus({
        tone: "success",
        message: `Pending Gmail connector send saved: "${payload.subject}" to ${payload.to}.`,
      });
      return;
    }

    setStatus({ tone: "success", message: "Reminder sent through the connected admin backend." });
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="brand-lockup" href="/" aria-label="Scripts and Spirits home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>Scripts &amp; Spirits</span>
        </Link>
        <div className="admin-session">
          <span>{adminEmail}</span>
          <form action="/api/auth/logout" method="post">
            <button type="submit">Sign out</button>
          </form>
        </div>
        <div className={`admin-status ${status.tone}`}>{status.message}</div>
      </header>

      <section className="admin-heading">
        <p className="kicker">Admin</p>
        <h1>Back-end portal</h1>
      </section>

      <section className="admin-grid" aria-label="Admin tools">
        <article className="admin-panel">
          <div className="admin-panel-heading">
            <p className="kicker">Carousel</p>
            <h2>Upload gathering photos</h2>
          </div>

          <label className="field-label">
            Image file
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => uploadImage(event.target.files?.[0] ?? null)}
            />
          </label>
          <label className="field-label">
            Image URL
            <input
              value={imageDraft.src ?? ""}
              onChange={(event) => setImageDraft((draft) => ({ ...draft, src: event.target.value }))}
              placeholder="/uploads/gathering.jpg"
            />
          </label>
          <label className="field-label">
            Alt text
            <input
              value={imageDraft.alt ?? ""}
              onChange={(event) => setImageDraft((draft) => ({ ...draft, alt: event.target.value }))}
              placeholder="Men gathered around a table at Scripts and Spirits."
            />
          </label>
          <label className="field-label">
            Caption
            <input
              value={imageDraft.caption ?? ""}
              onChange={(event) => setImageDraft((draft) => ({ ...draft, caption: event.target.value }))}
              placeholder="Around the table"
            />
          </label>

          <button className="button primary admin-button" type="button" onClick={saveImage} disabled={uploading}>
            {uploading ? "Uploading..." : "Save Image"}
          </button>

          <div className="admin-list">
            {carousel.map((image) => (
              <div className="admin-list-row" key={image.id}>
                <span>{image.caption || image.alt}</span>
                <code>{image.src}</code>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel event-panel">
          <div className="admin-panel-heading">
            <p className="kicker">Events</p>
            <h2>Create a new gathering</h2>
          </div>

          <div className="field-pair">
            <label className="field-label">
              Title
              <input
                value={eventDraft.title}
                onChange={(event) => setEventDraft((draft) => ({ ...draft, title: event.target.value }))}
                placeholder="Covenantal Theology"
              />
            </label>
            <label className="field-label">
              Topic
              <input
                value={eventDraft.topic}
                onChange={(event) => setEventDraft((draft) => ({ ...draft, topic: event.target.value }))}
                placeholder="Topic name"
              />
            </label>
          </div>
          <div className="field-pair">
            <label className="field-label">
              Date
              <input
                type="date"
                value={eventDraft.date}
                onChange={(event) => setEventDraft((draft) => ({ ...draft, date: event.target.value }))}
              />
            </label>
            <label className="field-label">
              Time
              <input
                value={eventDraft.time}
                onChange={(event) => setEventDraft((draft) => ({ ...draft, time: event.target.value }))}
                placeholder="8:30 PM"
              />
            </label>
          </div>
          <label className="field-label">
            Location
            <input
              value={eventDraft.location}
              onChange={(event) => setEventDraft((draft) => ({ ...draft, location: event.target.value }))}
              placeholder="Vasso, Dublin"
            />
          </label>
          <label className="field-label">
            RSVP URL
            <input
              value={eventDraft.rsvpUrl}
              onChange={(event) => setEventDraft((draft) => ({ ...draft, rsvpUrl: event.target.value }))}
              placeholder="https://calendar.app.google/..."
            />
          </label>
          <label className="field-label">
            Reminder recipients
            <textarea
              rows={3}
              value={eventDraft.reminderRecipients}
              onChange={(event) => setEventDraft((draft) => ({ ...draft, reminderRecipients: event.target.value }))}
              placeholder="email@example.com, another@example.com"
            />
          </label>
          <label className="field-label">
            Description
            <textarea
              rows={5}
              value={eventDraft.description}
              onChange={(event) => setEventDraft((draft) => ({ ...draft, description: event.target.value }))}
              placeholder="What the group will discuss..."
            />
          </label>

          <button className="button primary admin-button" type="button" onClick={saveEvent}>
            Save Event
          </button>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-heading">
            <p className="kicker">Gmail</p>
            <h2>Send reminders</h2>
          </div>

          <label className="field-label">
            Event
            <select
              value={selectedReminderEvent}
              onChange={(event) => {
                const nextEvent = events.find((item) => item.id === event.target.value);
                setSelectedReminderEvent(event.target.value);
                setReminderRecipients(nextEvent?.reminderRecipients || "");
              }}
            >
              {events.map((event) => (
                <option value={event.id} key={event.id}>
                  {event.title} - {event.date}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            Recipients
            <textarea
              rows={5}
              value={reminderRecipients}
              onChange={(event) => setReminderRecipients(event.target.value)}
              placeholder="email@example.com, another@example.com"
            />
          </label>

          {reminderEvent ? (
            <div className="reminder-preview">
              <strong>{reminderEvent.title}</strong>
              <span>
                {reminderEvent.date} at {reminderEvent.time}
              </span>
              <span>{reminderEvent.location}</span>
            </div>
          ) : null}

          <button className="button primary admin-button" type="button" onClick={sendReminder}>
            Prepare Gmail Connector Send
          </button>

          <p className="admin-note">
            This prepares the exact recipients, subject, and body for the connected Gmail
            connector. Ask Codex to send the pending reminder from this task.
          </p>
        </article>
      </section>
    </main>
  );
}
