# Scripts & Spirits Admin Backend

Use this Google Apps Script as the optional backend for `/admin`. It receives
requests from the Next app, checks admin credentials against the sheet, writes
carousel/events to Google Sheets, and sends reminders from the Gmail account
that owns the script.

## Setup

1. Open the Scripts & Spirits Google Sheet.
2. Go to Extensions > Apps Script.
3. Paste the script below.
4. Deploy > New deployment > Web app.
5. Set "Execute as" to "Me" and access to the narrowest option that works for
   your deployment.
6. Add the web app URL to the site as `SCRIPTS_SPIRITS_ADMIN_WEBHOOK_URL`.

## Admins Sheet

Create an `Admins` tab with this header row:

```text
username,password,name,email,active
```

For now, store the password in plain text in the `password` column.

## Script

```javascript
function doPost(event) {
  const payload = JSON.parse(event.postData.contents);
  const spreadsheet = SpreadsheetApp.openById(payload.spreadsheetId);

  if (payload.action === "verifyLogin") {
    return json(verifyLogin(spreadsheet, payload.username, payload.password));
  }

  if (payload.action === "saveCarousel") {
    writeRows(spreadsheet, "Carousel", ["id", "src", "alt", "caption"], payload.carousel);
    return json({ ok: true });
  }

  if (payload.action === "saveEvents") {
    writeRows(
      spreadsheet,
      "Events",
      ["id", "title", "date", "time", "location", "topic", "description", "rsvpUrl", "reminderRecipients"],
      payload.events
    );
    return json({ ok: true });
  }

  if (payload.action === "sendReminder") {
    GmailApp.sendEmail(payload.recipients.join(","), payload.subject, payload.body);
    return json({ ok: true });
  }

  return json({ ok: false, error: "Unknown action" });
}

function verifyLogin(spreadsheet, username, password) {
  const sheet = spreadsheet.getSheetByName("Admins");
  if (!sheet || !username || !password) return { ok: false };

  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const usernameIndex = headers.indexOf("username");
  const passwordIndex = headers.indexOf("password");
  const nameIndex = headers.indexOf("name");
  const emailIndex = headers.indexOf("email");
  const activeIndex = headers.indexOf("active");

  for (var i = 0; i < rows.length; i += 1) {
    var row = rows[i];
    var rowActive = activeIndex === -1 ? true : String(row[activeIndex]).toLowerCase() !== "false";

    if (
      rowActive &&
      String(row[usernameIndex]).trim() === String(username).trim() &&
      String(row[passwordIndex]) === String(password)
    ) {
      return {
        ok: true,
        name: nameIndex === -1 ? username : row[nameIndex],
        email: emailIndex === -1 ? username : row[emailIndex],
      };
    }
  }

  return { ok: false };
}

function writeRows(spreadsheet, sheetName, headers, rows) {
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  sheet.clearContents();
  sheet.appendRow(headers);

  rows.forEach(function (row) {
    sheet.appendRow(headers.map(function (header) {
      return row[header] || "";
    }));
  });
}

function json(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
```
