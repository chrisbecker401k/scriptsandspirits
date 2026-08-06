# Scripts & Spirits

A public landing page for Scripts & Spirits, a men's Bible study gathering in cocktail bars for honest conversation about Scripture, theology, and the Christian life.

## Local Development

```bash
npm install
npm run dev
npm run build
```

## Admin Portal

Visit `/admin` to manage the site content:

- Upload or add image URLs for the homepage carousel.
- Create new Scripts & Spirits events.
- Prepare Gmail connector reminders for a selected event.

By default, admin changes are written to `data/site-content.json`, and uploaded
images are stored in `public/uploads`. That works for local editing and committed
site updates. For hosted production updates without committing files, set
`SCRIPTS_SPIRITS_ADMIN_WEBHOOK_URL` to a Google Apps Script web app that writes
to the shared spreadsheet and sends Gmail reminders. See
`docs/admin-google-apps-script.md` for a starter script.

Admin access uses a username/password form. In production, the credentials are
checked by the Google Apps Script backend against an `Admins` tab in the shared
Google Sheet. For now, the sheet uses a plain `password` column. Configure:

```text
AUTH_COOKIE_SECRET=
NEXT_PUBLIC_SITE_URL=https://scriptsandspirits.com
SCRIPTS_SPIRITS_ADMIN_WEBHOOK_URL=
```

For local-only development without the sheet webhook, you can also set:

```text
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

When no `SCRIPTS_SPIRITS_ADMIN_WEBHOOK_URL` is configured, reminder actions save
the latest pending Gmail connector payload to `data/gmail-connector-outbox.json`.
From Codex, ask to send the pending reminder and the connected Gmail connector can
send that exact subject, body, and recipient list.

The default spreadsheet id is:

```text
1qQvda4ug6MCbdQTIYqqL52iA6rV_9aWlUP6zxi3sFRM
```

You can override it with `SCRIPTS_SPIRITS_SPREADSHEET_ID`.
