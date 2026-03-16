
I wanted a better journaling app for Windows, so I built one for myself, inspired by Stoic. Feel free to use or PR.

# Mindflow — Journal & Mental Health
 
A beautiful, full-featured mental health companion and daily journal web app. Built with React, all data stored locally in your browser — nothing is sent to any server.
 
---
 
## Features
 
### Home Dashboard
 
- Personalized greeting with daily Stoic quote
- Quick mood check-in
- Morning Preparation prompts (priorities, intentions, outlook)
- Evening Reflection prompts (wins, lessons, improvements)
- Daily to-do list with progress tracking
 
### Guided Journaling
 
- 8 journal categories: Gratitude, Productivity, Happiness, Stress & Anxiety, Relationships, Self-Discovery, Therapy, Dreams
- 64 thought-provoking prompts (8 per category)
- Free writing mode
- Shuffle prompts for fresh inspiration
- Word count tracking
- Edit and delete entries
 
### Mood Tracker
 
- 5-level mood scale with emoji indicators
- 18 emotion tags (Happy, Anxious, Motivated, etc.)
- Optional notes for context
- 7-day mood overview
- Full mood history log
 
### Habits & Streaks
 
- 6 default habits + unlimited custom habits
- Daily check-off with progress bar
- Streak counter with fire animation
- 7-day habit history grid
- 12 earnable badges (First Step, Week Warrior, Century Club, etc.)
 
### Breathing Exercises
 
- **Box Breathing** — stress relief, used by Navy SEALs
- **4-7-8 Breathing** — sleep aid
- **Calming Breath** — parasympathetic activation
- **Energizing Breath** — alertness boost
- **Resonance Breathing** — HRV optimization
- Animated breathing circle with phase indicators
 
### Meditation
 
- Unguided timer: 1, 3, 5, 10, 15, 20, or 30 minutes
- Pause/resume/reset controls
- Circular progress ring
- Session count and total minutes tracking
- Ambient sound selection (visual only in v1)
 
### Quotes & Affirmations
 
- 30 Stoic philosophy quotes from Marcus Aurelius, Seneca, and Epictetus
- 15 positive daily affirmations
- Favorite system to save your top picks
- Copy to clipboard
 
### Trends & Analytics
 
- Mood over time (line chart, last 30 days)
- Words written (bar chart, last 30 days)
- Journal category breakdown
- Top emotions frequency with progress bars
- Overview stats: total entries, total words, average mood, current streak
 
### Journey
 
- Unified timeline of all entries (journal, mood, morning/evening reflections)
- Full-text search across all entries
- Filter by journal category
- Expandable entry cards
 
### Settings
 
- 9 color themes: Midnight, Ocean, Forest, Sunset, Rose, Lavender, Gold, Light, Warm Light
- PIN lock for privacy (4–6 digits)
- Export all data as JSON
- Import data from backup
- Delete all data
 
---
 
## Tech Stack
 
- **React 19** with Vite
- **React Router** for navigation
- **Recharts** for analytics charts
- **Lucide React** for icons
- **date-fns** for date formatting
- **localStorage** for all data persistence — no backend, no accounts, fully offline
 
---
 
## Getting Started
 
```bash
# Install dependencies
npm install
 
# Start dev server
npm run dev
 
# Build for production
npm run build
```
 
---
 
## Privacy
 
All data stays on your device. Mindflow uses browser localStorage exclusively. No data is ever sent to any server, no analytics, no tracking.
 
---
 
## License
 
MIT


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
