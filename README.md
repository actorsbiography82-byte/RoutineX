# RoutineX — Minimalist Daily Routine with Real-Time Google Sheets Sync ⚡

**RoutineX** is a 100% minimalist, clean, and distraction-free daily routine and task tracker with **real-time hybrid synchronization**: instant browser LocalStorage offline speed + automated bidirectional Google Sheets cloud sync across all your devices.

Built with **Next.js (App Router)**, **Tailwind CSS**, and **Lucide React**.

---

## ✨ Features

- **Real-Time Auto-Syncing (PC & Mobile)**:
  - **Auto-Pull on App Load**: Automatically fetches the latest tasks from your Google Sheet when you open RoutineX.
  - **Auto-Pull on Window/Tab Focus**: Whenever you switch back to RoutineX on your computer or unlock your mobile phone screen, it immediately pulls the latest state.
  - **Periodic Background Sync**: Runs an automatic check every 25 seconds when online and active.
  - **Smart Reconciler**: Merges cloud state with local state based on task-level timestamps, preventing conflict or data loss.
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
  - **Zero Database Costs**: Uses Google Sheets as a free, transparent database.
- **Settings Bridge**:
  - Easily paste your Google Apps Script Web App URL.
  - One-click copy for the backend Apps Script code.
  - Manual Push/Pull actions.

---

## ☁️ Google Sheet Setup Guide (60 Seconds)

1. Create a blank Google Sheet at [sheets.new](https://sheets.new).
2. Go to **Extensions &rarr; Apps Script**.
3. Open the **Settings Modal** in RoutineX, click **"Copy Google Apps Script Code"**, paste it into Apps Script, and save (`Ctrl+S`).
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
