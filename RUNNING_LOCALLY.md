Running Frontend locally

1. Copy example env and update API/SOCKET urls:

PowerShell commands:
cd Frontend
copy .env.example .env

# edit .env and set VITE_API_URL and VITE_SOCKET_URL to point to backend (e.g., http://localhost:3000)

2. Install dependencies and run dev server:

PowerShell commands:
npm install
npm run dev

3. Open the site in the browser at the address shown by Vite (default http://localhost:5173).
