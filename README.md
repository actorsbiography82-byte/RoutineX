# RoutineX ⚡

**RoutineX** is a modern, production-grade Next.js web application designed for personal daily routine management, task tracking, and time blocking. Built with high performance, mobile-first responsive architecture, and offline persistence.

---

## 🌟 Key Features

1. **Precision Time Blocking & Schedule Matrix**:
   - **Fajar Block (1 Hour)**: Wazu / Nahana + 4 Rakat Namaz + 20 mins Quran Reading & Tadabbur.
   - **Foodpanda Rider Work (6 Hours)**: Order flow checklist, equipment prep, hydration breaks, earnings logging.
   - **YouTube Channels Creation (4 Hours)**: Drama & Cartoon / Fruit Drama channels (scriptwriting, voiceover, animation, video editing, thumbnail & upload).
   - **Spiritual 5 Daily Prayers**: Zuhar (45m), Asar (25m), Maghrib (25m), Isha (45m), and Fajar.
   - **Web Dev Agency & Client Work (2 Hours)**: Client project delivery, debugging, freelance outreach, and SaaS building.
   - **Personal Growth & Skill Learning**: Morning workouts (pushups, cardio), 20 mins targeted skill learning, and night book reading before bed.

2. **Interactive Checklist & Feedback**:
   - Instant visual feedback on check-off (strikethrough, completion timestamp, category color badges).
   - Expandable subtasks for each major routine block.
   - 100% daily completion celebration confetti.

3. **Active Focus Timer & Stopwatch**:
   - Circular countdown timer with elapsed percentage for any time block.
   - Audio chime on completion using the Web Audio API.
   - Quick +5 minutes increment button and direct "Complete & Check Off" action.

4. **LocalStorage Synchronization & Cross-Device Portability**:
   - Persists all routine records, subtasks, and dates in browser `localStorage`.
   - Date navigation (jump to past records or forward).
   - JSON Backup & Restore: Export and import data to sync seamlessly between your PC and Mobile browsers.

5. **24-Hour Live Schedule Matrix**:
   - Automatic real-time detection of the currently active time block based on your device clock.
   - Mobile-first responsive layout with bottom navigation dock and desktop dual-column layout.
   - Sleek dark theme with vibrant category accents (Spiritual: Emerald, Foodpanda: Magenta/Pink, YouTube: Red, Web Dev: Blue, Growth: Purple).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Library**: React 18
- **Styling**: Tailwind CSS & PostCSS
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti & Web Audio API
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.17+ or LTS v24+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/actorsbiography82-byte/RoutineX.git

# Enter the project directory
cd RoutineX

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience RoutineX.

### Production Build

```bash
npm run build
npm run start
```

---

## 📱 Mobile Installation (PWA)

RoutineX comes pre-configured with a web app manifest. To install on your phone:
1. Open RoutineX in Safari (iOS) or Chrome (Android).
2. Tap **Share** or **Options Menu** (three dots).
3. Select **Add to Home Screen**.

---

## 📄 License
This project is licensed under the MIT License.
