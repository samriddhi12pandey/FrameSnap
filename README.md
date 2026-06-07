# FrameSnap — Video Frame Extractor

Extract pixel-perfect frames from any video, entirely in your browser. No server uploads, no accounts, no limits.

# FrameSnap — Video Frame Extractor

🚀 Live Demo: https://frame-snap-cyan.vercel.app/

Extract pixel-perfect frames from any video, entirely in your browser.

---

## ✨ Features

- **Instant Processing** — Uses the browser's native Video/Canvas API; no server round-trips.
- **100% Private** — Your video never leaves your device.
- **Bulk Extraction** — Extract a frame every N seconds and download as a single ZIP.
- **PNG & JPG** — Choose format and quality before capturing.
- **Keyboard Shortcuts** — `Space` play/pause, `←`/`→` seek, `C` capture, `Esc` close zoom.
- **Dark / Light Theme** — Persists for the session.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
framesnap/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component, routing between Hero & Workspace
    ├── index.css             # Global styles + Tailwind base
    ├── assets/               # Static assets (icons, images)
    ├── components/
    │   ├── Header.jsx        # Fixed top nav with theme toggle & "New Video" button
    │   ├── Hero.jsx          # Heading + short description text
    │   ├── UploadZone.jsx    # Drag-and-drop / click upload area + button
    │   ├── Footer.jsx        # Logo, social links, copyright
    │   ├── Workspace.jsx     # Video player, extraction tools, frame gallery
    │   ├── Toast.jsx         # Animated toast notification stack
    │   └── ZoomModal.jsx     # Fullscreen frame preview overlay
    ├── hooks/
    │   ├── useToast.js       # Toast state management
    │   ├── useVideoPlayer.js # Video playback state & controls
    │   └── useFrameExtractor.js # Frame capture, download, ZIP logic
    └── utils/
        └── frameUtils.js     # formatTime, formatSize, JSZip loader, etc.
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React 18](https://react.dev/) | UI framework |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |
| [JSZip](https://stuk.github.io/jszip/) (CDN) | ZIP bundling for bulk download |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `←` | Seek back 0.1s |
| `→` | Seek forward 0.1s |
| `C` | Capture current frame |
| `Esc` | Close zoom modal |

---

## Screenshots 

<img width="1919" height="871" alt="image" src="https://github.com/user-attachments/assets/cab86c70-15e6-4417-b9ef-1052cc84c1e8" />



## 📄 License

MIT © 2026 FrameSnap
