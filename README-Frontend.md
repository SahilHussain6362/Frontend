# Spy Game Frontend

This folder contains a professional-grade React + Vite frontend scaffold for the Spy Game.

Quick overview:

- Framework: React 18 + Vite
- Styling: Tailwind CSS
- Animations: Framer Motion
- Audio: Howler.js (service ready)
- Real-time: socket.io-client (service ready)

Folders:

- `src/` - source code
  - `components/` - reusable UI components
  - `pages/` - page route components
  - `services/` - audio/socket services
  - `index.css` - global styles (Tailwind)
- `assets/` - put images and audio here
  - `images/` - UI/avatars/backgrounds
  - `sounds/` - sfx and music

Run locally:

1. cd into frontend folder

```bash
cd SpyGameFrontend
npm install
npm run dev
```

2. Open `http://localhost:5173` in your browser

Notes:

- The dev server proxies `/api` and `/socket.io` to `http://localhost:3000` so it works with the provided backend.
- The frontend reads `VITE_SOCKET_URL` from environment to override socket server URL.

If you need production deployment steps, tell me which host or I'll add a Dockerfile/CI pipeline.
