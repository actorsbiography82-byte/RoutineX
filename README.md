# RoutineX — Minimalist Daily Routine with Google Sheets Sync ⚡

**RoutineX** is a 100% minimalist, clean, and distraction-free daily routine and task tracker with **hybrid storage**: instant browser LocalStorage offline speed + automated Google Sheets cloud synchronization.

Built with **Next.js (App Router)**, **Tailwind CSS**, and **Lucide React**.

---

## ✨ Features

- **Minimalist & Distraction-Free UI**: High-contrast, clean typography, dark/light theme, and refined aesthetics.
- **Pre-Loaded Daily Routine**:
  - **Fajar Block**: 1 Hour (Wazu/Nahana + 4 Rakat Namaz + 20 mins Quran Reading)
  - **Foodpanda Rider Work**: 6 Hours daily
  - **YouTube Channels Creation**: 4 Hours daily (Drama & Cartoon/Fruit Drama)
  - **Daily Prayers (5 Times)**: Zuhar (45m), Asar (25m), Maghrib (25m), Isha (45m), Fajar
  - **Web Dev Agency & Client Work / Projects**: 2 Hours
  - **Personal Growth & Skills**: Daily workout (30m), 20 mins skill learning, and night reading before sleep
- **Full CRUD Capabilities**:
  - **Create**: Add custom tasks with title, duration, and category tags.
  - **Read**: Filter by `All`, `Pending`, or `Completed`.
  - **Update**: Check/uncheck status, or edit any task inline.
  - **Delete**: Instant one-click trash removal.
  - **Reset Day**: Uncheck all items for a fresh day with one tap.
- **Hybrid Storage & Google Sheets Cloud Backend**:
  - **100% Offline Resilience**: Instant UI responsiveness via `localStorage`.
  - **Automatic Cloud Sync**: Background synchronization with Google Sheets whenever an internet connection is available.
  - **Offline Queue**: If offline, changes queue locally and auto-sync when connection returns.
  - **Zero Database Costs**: Uses Google Sheets as a free, transparent database.
- **Settings Bridge**:
  - Easily paste your Google Apps Script Web App URL.
  - One-click copy for the backend Apps Script code.
  - Manual Push/Pull actions.

---

## ☁️ Google Sheet Setup Guide (60 Seconds)

1. Create a blank Google Sheet at [sheets.new](https://sheets.new).
2. Go to **Extensions &rarr; Apps Script**.
3. Paste the following script and save (`Ctrl+S`):

```javascript
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var tasks = [];

  if (data.length > 1) {
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0]) {
        tasks.push({
          id: String(row[0]),
          title: String(row[1] || ''),
          time: String(row[2] || ''),
          category: String(row[3] || 'General'),
          completed: String(row[4]).toLowerCase() === 'true' || row[4] === true,
          createdAt: Number(row[5] || Date.now()),
          updatedAt: Number(row[6] || Date.now())
        });
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    tasks: tasks,
    lastSyncedAt: Date.now()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var tasks = payload.data || [];

    sheet.clearContents();
    sheet.appendRow(["ID", "Title", "Time", "Category", "Completed", "CreatedAt", "UpdatedAt"]);

    tasks.forEach(function(t) {
      sheet.appendRow([
        t.id,
        t.title,
        t.time || '',
        t.category || 'General',
        t.completed ? true : false,
        t.createdAt || Date.now(),
        t.updatedAt || Date.now()
      ]);
    });

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      count: tasks.length,
      lastSyncedAt: Date.now()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Deploy &rarr; New deployment**.
5. Choose **Web app**, set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. Click **Deploy**, copy the Web App URL, and paste it into the **RoutineX Settings Modal**!

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.17+ or LTS v24+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/actorsbiography82-byte/RoutineX.git
cd RoutineX

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 📄 License
MIT License.
