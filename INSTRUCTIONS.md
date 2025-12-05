INSTRUCTIONS — Where to place assets, run steps and wiring

Overview:
This file lists explicit locations and step-by-step instructions so your team knows where to place images, sound files and how to wire environment variables.

1. Asset folders (important — exact paths)

- Images: place all UI images, avatars and backgrounds in:
  `SpyGameFrontend/assets/images/`
  Example: `SpyGameFrontend/assets/images/avatar-agent-1.png`

- Sounds: place all sound effects and music in:
  `SpyGameFrontend/assets/sounds/`
  Expected filenames used by `audioService.js` (replace or add):
  - `click.mp3` # UI click
  - `vote.mp3` # vote sound
  - `spy-reveal.mp3` # spy reveal
  - `timer.mp3` # countdown tick
  - `error.mp3` # error buzz
  - `gameplay.mp3` # background music (loop)

If you use different file names, update `src/services/audioService.js` to match.

2. Image usage in code

- Import images from `/assets/images` using absolute paths (Vite serves `/assets` folder):
  Example in JSX:
  <img src="/assets/images/avatar-agent-1.png" alt="agent" />

3. Sound usage

- Audio files are referenced from `/assets/sounds/` in `src/services/audioService.js`.
- To replace/copy sounds, place MP3 files with same names into `assets/sounds`.
- To add a new sound: add the file, then update `audioService.js` and call `audioService.play('yourSoundName')`.

4. Environment variables

- Create a `.env` file at `SpyGameFrontend/.env` (not committed) to override socket server URL:
  VITE_SOCKET_URL=http://your-server:3000
- Vite exposes variables prefixed with `VITE_` to the frontend.

5. Integrating with backend

- The dev server proxies `/api` and `/socket.io` to `http://localhost:3000` (see `vite.config.js`).
- If your backend runs on a different host/port, update `vite.config.js` or set `VITE_SOCKET_URL`.

6. Step-by-step run guide (Windows PowerShell)

- Open PowerShell, then:
  cd "c:\Users\hario\OneDrive\Desktop\SpyGame\SpyGameBackend\SpyGameFrontend"
  npm install
  npm run dev
- Visit http://localhost:5173

7. Recommended file naming & optimization

- Images: use webp when possible for smaller size: `background.webp`.
- Sounds: keep short sound effects (<= 1s) for snappy feedback; music may be longer and looped.

8. Where to add new pages/components

- Pages: `src/pages/` (route components)
- Shared components: `src/components/`
- Services: `src/services/` (audio/socket/api)

9. To connect Redux or other store

- Add store files under `src/store/` and wrap `App` root with `<Provider>` in `src/main.jsx`.

10. Production build

- `npm run build` will create an optimized `dist/` folder. Serve the `dist/` contents from any static host.

If you'd like, I can now:

- Add a full `Lobby`, `Room`, `Voting` pages and wire them to socket events
- Add sample placeholder images and short sound files
- Add Tailwind utilities for specific components

Tell me which of those you'd like next and I'll continue scaffolding and wiring.
